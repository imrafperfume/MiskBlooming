import { prisma } from "./db";
import { redis } from "./redis";

export async function isAdmin(userId: string) {
  try {
    const cachedRole: string | null = await redis.get(`role:${userId}`);
    let userRole;
    if (cachedRole) {
      userRole = cachedRole;
    } else {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });
      if (!user) throw new Error("User not found");
      userRole = user;
      await redis.set(`role:${userId}`, JSON.stringify(userRole), {
        ex: 60 * 5,
      });
    }
    return userRole;
  } catch (error: any) {
    return error.message;
  }
}
