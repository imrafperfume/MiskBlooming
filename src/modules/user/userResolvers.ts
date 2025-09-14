import { prisma } from "@/src/lib/db";
import { isAdmin } from "@/src/lib/isAdmin";
import { redis } from "@/src/lib/redis";

export const UserResolvers = {
  Query: {
    users: async (_: any, __: any, context: { userId: string }) => {
      try {
        const { userId } = context;
        if (!userId) throw new Error("userId not found");

        //  Check user role cache
        const userRole = await isAdmin(userId);

        //  Admin check
        if (userRole.role !== "ADMIN") throw new Error("Not authorized");

        //  Check all users cache
        const cachedUsers: string | null = await redis.get("allUsers");
        if (cachedUsers) {
          return cachedUsers;
        }

        //  Fetch all users from DB
        const allUsers = await prisma.user.findMany({
          where: { role: { in: ["USER", "GUEST"] } },
        });
        if (!allUsers || allUsers.length === 0)
          throw new Error("No users found");

        //  Cache all users
        await redis.set("allUsers", JSON.stringify(allUsers), { ex: 60 * 5 });

        return allUsers;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    adminUsers: async (_: any, __: any, context: { userId: string }) => {
      try {
        const { userId } = context;
        if (!userId) throw new Error("userId not found");
        const userRole = await isAdmin(userId);
        if (userRole.role !== "ADMIN") throw new Error("Not authorized");
        const cachedUsers: string | null = await redis.get("adminUsers");
        if (cachedUsers) {
          return cachedUsers;
        }
        const adminUsers = await prisma.user.findMany({
          where: { role: "ADMIN" },
        });
        if (!adminUsers || adminUsers.length === 0)
          throw new Error("No admin users found");
        await redis.set("adminUsers", JSON.stringify(adminUsers), {
          ex: 60 * 5,
        });
        return adminUsers;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    },
    userById: async (_: any, args: { id: string }) => {
      try {
        const cache: string | null = await redis.get(`user:${args.id}`);
        if (cache) {
          return cache;
        }
        const user = await prisma.user.findUnique({
          where: { id: args.id },
        });
        if (!user) throw new Error("User not found");
        await redis.set(`user:${args.id}`, JSON.stringify(user), {
          ex: 60 * 5,
        });
        return user;
      } catch (error) {
        throw new Error((error as Error).message);
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
  Mutation: {
    updateUser: async (
      _: any,
      args: {
        id: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        phoneNumber?: string;
        address?: string;
      },
      context: { userId: string }
    ) => {
      try {
        const { userId } = context;
        if (!userId) throw new Error("userId not found");
        if (userId !== args.id) throw new Error("Not authorized");

        const updatedUser = await prisma.user.update({
          where: { id: args.id },
          data: {
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email,
            phoneNumber: args.phoneNumber,
            address: args.address,
          },
        });
        if (!updatedUser) throw new Error("User not found");

        // Invalidate user cache
        await redis.del(`user:${args.id}`);
        return updatedUser;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    updateUserRole: async (
      _: any,
      args: { id: string; role: string },
      context: { userId: string }
    ) => {
      try {
        const { userId } = context;
        if (!userId) throw new Error("userId not found");
        const userRole = await isAdmin(userId);
        if (userRole.role !== "ADMIN") throw new Error("Not authorized");
        const cacheUser = await redis.get(`user:${args.id}`);
        if (typeof cacheUser === "string" && cacheUser) {
          const parsedUser = JSON.parse(cacheUser);
          if (parsedUser.role === args.role)
            throw new Error("User already has this role");
        }
        const user = await prisma.user.findUnique({ where: { id: args.id } });
        if (!user) throw new Error("User not found");

        if (user.role === args.role)
          throw new Error("User already has this role");
        const updatedUser = await prisma.user.update({
          where: { id: args.id },
          data: { role: args.role as any },
        });
        if (!updatedUser) throw new Error("User not found");
        await redis.del(`user:${args.id}`);
        await redis.del("allUsers");
        await redis.del("adminUsers");
        return updatedUser;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    deleteUser: async (
      _: any,
      args: { id: string },
      context: { userId: string }
    ) => {
      try {
        const { userId } = context;
        if (!userId) throw new Error("userId not found");
        const userRole = await isAdmin(userId);
        if (userRole.role !== "ADMIN") throw new Error("Not authorized");
        const deleteUser = await prisma.user.delete({ where: { id: args.id } });
        if (!deleteUser) throw new Error("User not found");
        await redis.del(`user:${args.id}`);
        await redis.del("allUsers");
        return deleteUser ? true : false;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  },
};
