import { prisma } from "@/src/lib/db";
import { redis } from "@/src/lib/redis";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const resolveParams = await params;
  const id = resolveParams.id;
  try {
    const { published } = await req.json();

    if (typeof published !== "boolean") {
      return NextResponse.json(
        { error: "Invalid 'published' value. Must be boolean." },
        { status: 400 }
      );
    }

    const slide = await prisma.heroSlide.update({
      where: { id: id },
      data: { published },
    });
    await redis.del("heroSlidesCache"); // Invalidate cache
    return NextResponse.json(slide);
  } catch (error) {
    console.error("Publish slide error:", error);
    return NextResponse.json(
      { error: "Failed to update publish state" },
      { status: 500 }
    );
  }
}
