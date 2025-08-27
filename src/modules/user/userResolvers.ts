import { prisma } from "@/src/lib/db";
import { isAdmin } from "@/src/lib/isAdmin";
import { redis } from "@/src/lib/redis";

export const UserResolvers = {
  Query: {
    users: async (_: any, __: any, context: { userId: string }) => {
      try {
        const { userId } = context;
        if (!userId) throw new Error("userId not found");

        // 🔹 Check user role cache
        const userRole = await isAdmin(userId);

        // 🔹 Admin check
        if (userRole.role !== "ADMIN") throw new Error("Not authorized");

        // 🔹 Check all users cache
        const cachedUsers: string | null = await redis.get("allUsers");
        console.log("🚀 ~ cachedUsers:", cachedUsers);
        if (cachedUsers) {
          console.log("hit");
          return cachedUsers;
        }

        // 🔹 Fetch all users from DB
        const allUsers = await prisma.user.findMany();
        if (!allUsers || allUsers.length === 0)
          throw new Error("No users found");

        // 🔹 Cache all users
        await redis.set("allUsers", JSON.stringify(allUsers), { ex: 60 * 5 });

        return allUsers;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  },
  User: {
    stats: async (parent: any) => {
      const [totalOrders, totalSpent] = await Promise.all([
        prisma.order.count({ where: { userId: parent.id } }),
        prisma.order.aggregate({
          where: { userId: parent.id },
          _sum: { totalAmount: true },
        }),
      ]);

      return {
        totalOrders,
        totalSpent: totalSpent._sum.totalAmount || 0,
      };
    },
    lastOrder: async (parent: any) => {
      return prisma.order.findFirst({
        where: { userId: parent.id },
        orderBy: { createdAt: "desc" },
      });
    },
  },
};
