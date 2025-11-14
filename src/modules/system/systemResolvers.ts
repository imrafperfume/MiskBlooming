import { prisma } from "@/src/lib/db";
import { isAdmin } from "@/src/lib/isAdmin";
import { redis } from "@/src/lib/redis";

export const systemResolvers = {
  Query: {
    getSystemSetting: async (
      _parent: any,
      _args: any,
      context: { userId: string }
    ) => {
      const { userId } = context;
      if (!userId) throw new Error("user ID not found");
      const role = await isAdmin(userId);
      if (role.role !== "ADMIN") throw new Error("Not authorized");
      try {
        const cache = await redis.get("theme");
        if (cache) {
          return cache;
        }
        const setting = await prisma.systemSetting.findFirst();
        if (!setting) {
          return await prisma.systemSetting.create({
            data: { theme: "light" },
          });
        }
        await redis.set("theme", JSON.stringify(setting));
        return setting;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    updateSystemTheme: async (
      _: any,
      args: { theme: string },
      context: { userId: string }
    ) => {
      const { userId } = context;
      if (!userId) throw new Error("user ID not found");
      const role = await isAdmin(userId);
      if (role.role !== "ADMIN") throw new Error("Not authorized");
      try {
        const setting = await prisma.systemSetting.updateMany({
          data: { theme: args.theme },
        });
        console.log("🚀 ~ setting:", setting);
        await redis.del("theme");
        return await prisma.systemSetting.findFirst();
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  },
};
