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
        if (!content) return "Home page content not found";
        await redis.set(CACHE_KEY, JSON.stringify(content), {
          ex: 60 * 60,
        }); // 1 hour
        return content;
      } catch (error) {
        throw new Error("Failed to fetch home page content");
      }
    },
    getCollectionContent: async () => {
      try {
        const cache = await redis.get("collection_content");
        if (cache) {
          return cache;
        }
        const content = await prisma.collection.findFirst();
        console.log("🚀 ~ content:", content);
        if (!content)
          return {
            id: "null", // or a placeholder if your type requires it
            collectionTitle: "No content",
            collectionDesc: "No content",
          };
        await redis.set("collection_content", JSON.stringify(content), {
          ex: 60 * 60,
        }); // 1 hour
        return content;
      } catch (error: any) {
        throw new Error(error.message || "Failed to fetch collection content");
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
    updateCollectionContent: async (
      _: any,
      args: { input: { collectionTitle: string; collectionDesc: string } },
      context: { userId: string }
    ) => {
      await validateAdmin(context?.userId);
      try {
        const fields = args.input;
        const data = await prisma.collection.upsert({
          where: { id: "COLLECTION" },
          update: { ...fields },
          create: { id: "COLLECTION", ...fields },
        });
        await redis.del("collection_content"); // Invalidate cache
        return data;
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to update collection content"
        );
      }
    },
  },
};
