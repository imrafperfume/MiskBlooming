import { prisma } from "@/src/lib/db";
import { isAdmin, validateAdmin } from "@/src/lib/isAdmin";
import { redis } from "@/src/lib/redis";

export const systemResolvers = {
  Query: {
    getSystemSetting: async (_parent: any, _args: any) => {
      // const { userId } = context;
      // if (!userId) throw new Error("user ID not found");
      // const role = await isAdmin(userId);
      // if (role.role !== "ADMIN") throw new Error("Not authorized");
      try {
        // const cache = await redis.get("systemSetting");
        // if (cache) {
        //   return cache;
        // }
        const setting = await prisma.systemSetting.findFirst();
        if (!setting) {
          return await prisma.systemSetting.create({
            data: { theme: "light", layoutStyle: "fullscreen" },
          });
        }
        await redis.set("systemSetting", JSON.stringify(setting));
        return setting;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    updateSystemTheme: async (
      _: any,
      args: { theme: string; layoutStyle?: string },
      context: { userId: string }
    ) => {
      const { userId } = context;
      if (!userId) throw new Error("user ID not found");
      const role = await isAdmin(userId);
      if (role.role !== "ADMIN") throw new Error("Not authorized");
      try {
        const setting = await prisma.systemSetting.updateMany({
          data: {
            theme: args.theme,
          },
        });
        await redis.del("systemSetting");
        return await prisma.systemSetting.findFirst();
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    updateSystemLayout: async (
      _: any,
      args: { layoutStyle: string },
      context: { userId: string }
    ) => {
      const { userId } = context;
      await validateAdmin(userId);

      try {
        const setting = await prisma.systemSetting.updateMany({
          data: { layoutStyle: args.layoutStyle },
        });
        await redis.del("systemSetting");
        return await prisma.systemSetting.findFirst();
      } catch (error) {
        throw new Error((error as Error).message);
      }
    },
  },
};
