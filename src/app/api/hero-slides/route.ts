import { prisma } from "@/src/lib/db";
import { redis } from "@/src/lib/redis";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cacheKey = "heroSlidesCache";
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }
    const slides = await prisma.heroSlide.findMany({
      orderBy: { order: "asc" },
    });
    await redis.set(cacheKey, JSON.stringify(slides), { ex: 60 * 5 }); // Cache for 5 minutes
    return NextResponse.json(slides);
  } catch (error) {
    console.error("GET SLIDES ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch slides" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const slide = await prisma.heroSlide.create({
      data: {
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        imageUrl: body.imageUrl,
        order: Number(body.order),
        published: body.published ?? false,
        buttons: body.buttons ?? [],
      },
    });
    await redis.del("heroSlidesCache"); // Invalidate cache
    return NextResponse.json(slide);
  } catch (error) {
    console.error("CREATE SLIDE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create slide" },
      { status: 500 }
    );
  }
}
