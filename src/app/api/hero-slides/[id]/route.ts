import { prisma } from "@/src/lib/db";
import { redis } from "@/src/lib/redis";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  try {
    const body = await req.json();

    const slide = await prisma.heroSlide.update({
      where: { id: id },
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
    console.error("UPDATE SLIDE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update slide" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    // Optional: first check if slide exists
    const slide = await prisma.heroSlide.findUnique({ where: { id } });
    if (!slide) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    await prisma.heroSlide.delete({ where: { id } });
    await redis.del("heroSlidesCache"); // Invalidate cache
    return NextResponse.json({ message: "Slide deleted ✅" });
  } catch (error) {
    console.error("DELETE SLIDE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete slide" },
      { status: 500 }
    );
  }
}
