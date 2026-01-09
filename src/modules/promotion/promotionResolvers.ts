import { redis } from "@/src/lib/redis";
import { prisma } from "@/src/lib/db";
import { validateAdmin } from "@/src/lib/isAdmin";
import { Promotion } from "@prisma/client";
const CACHE_KEY = "promotions";

export const PromotionResolvers = {
  Query: {
    getPromotions: async () => {
      try {
        const cache = await redis.get(CACHE_KEY);
        if (cache) return cache;

        const promotions = await prisma.promotion.findMany();
        if (!promotions) return [];
        await redis.set(CACHE_KEY, JSON.stringify(promotions), {
          ex: 60 * 60, // Cache for 5 minutes
        });
        return promotions;
      } catch (error: Error | any) {
        throw new Error(error.message);
      }
    },
    getPromotionById: async (_: any, { id }: { id: string }) => {
      try {
        const cache = await redis.get(`${CACHE_KEY}:${id}`);
        if (cache) return cache;

        const promotion = await prisma.promotion.findUnique({
          where: { id },
        });
        if (!promotion) throw new Error("Promotion not found");
        await redis.set(`${CACHE_KEY}:${id}`, JSON.stringify(promotion), {
          ex: 60 * 60, // Cache for 5 minutes
        });
        return promotion;
      } catch (error: Error | any) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    createPromotion: async (
      _: any,
      { input }: { input: any },
      context: { userId: string }
    ) => {
      await validateAdmin(context.userId);
      try {
        const promotion = await prisma.promotion.create({
          data: {
            ...input,
          },
        });
        //Invalidate cache
        await redis.del(CACHE_KEY);
        return promotion;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    },
    updatePromotion: async (
      _: any,
      { id, input }: { id: string; input: Promotion },
      { userId }: { userId: string }
    ) => {
      await validateAdmin(userId);
      try {
        const promotion = await prisma.promotion.update({
          where: { id },
          data: {
            ...input,
          },
        });
        //Invalidate cache
        await redis.del(CACHE_KEY);
        await redis.del(`${CACHE_KEY}:${id}`);
        return promotion;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    },
    deletePromotion: async (
      _: any,
      { id }: { id: string },
      { userId }: { userId: string }
    ) => {
      await validateAdmin(userId);
      try {
        const deleted = await prisma.promotion.delete({
          where: { id },
        });
        //Invalidate cache
        await redis.del(CACHE_KEY);
        await redis.del(`${CACHE_KEY}:${id}`);
        return true;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    },
  },
};
