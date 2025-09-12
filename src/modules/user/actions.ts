"use server";

import { prisma } from "@/src/lib/db";
import { redis } from "@/src/lib/redis";

export async function deleteAccount(userId: string) {
  try {
    if (!userId) return { success: false, error: "User ID is required" };
    await prisma.user.delete({
      where: { id: userId },
    });
    await redis.del(`user:${userId}`);
    return { success: true };
  } catch (error) {
    console.error("Delete account error:", error);
    return { success: false, error: "Failed to delete account" };
  }
}
