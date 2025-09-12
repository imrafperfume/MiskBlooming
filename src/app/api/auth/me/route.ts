import { prisma } from "@/src/lib/db";
import { redis } from "@/src/lib/redis";
import { getSessionUserId } from "@/src/lib/session";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const userId: string | null = await getSessionUserId();
    console.log("userId", userId);
    if (!userId)
      return NextResponse.json({ message: "user id invalid" }, { status: 404 });
    const cache = await redis.get(`user:${userId}`);
    if (cache) return NextResponse.json(cache, { status: 200 });

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        email: true,
        emailVerified: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    await redis.set(`user:${userId}`, JSON.stringify(user), { ex: 60 * 15 });
    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.massage }, { status: 500 });
  }
}
