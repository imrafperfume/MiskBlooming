import { prisma } from "@/src/lib/db";
import { redis } from "@/src/lib/redis";
import { HomeContentFormData } from "./managmentTypeDefs";
import { validateAdmin } from "@/src/lib/isAdmin";

const CACHE_KEY = "home_page_content";
export const ManagementResolvers = {
  Query: {
    getHomePageContent: async () => {
      try {
        const cache = await redis.get(CACHE_KEY);
        if (cache) {
          return cache;
        }
        const content = await prisma.homePageContent.findFirst();
        if (!content) throw new Error("Home page content not found");
        await redis.set(CACHE_KEY, JSON.stringify(content), {
          ex: 60 * 60,
        }); // 1 hour
        return content;
      } catch (error) {
        throw new Error("Failed to fetch home page content");
      }
    },
  },
  Mutation: {
    updateHomePageContent: async (
      _: any,
      args: { input: HomeContentFormData },
      context: { userId: string }
    ) => {
      await validateAdmin(context?.userId);
      try {
        const fields = args.input;
        const data = await prisma.homePageContent.upsert({
          where: { id: "HOME_PAGE" },
          update: { ...fields }, // fields directly, no `input`
          create: { id: "HOME_PAGE", ...fields }, // add id for primary key
        });
        await redis.del(CACHE_KEY); // Invalidate cache
        return data;
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to update home page content"
        );
      }
    },
  },
};
