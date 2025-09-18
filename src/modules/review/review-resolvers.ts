import { prisma } from "@/src/lib/db";
import { isAdmin } from "@/src/lib/isAdmin";
import { redis } from "@/src/lib/redis";

export const ReviewResolvers = {
  Query: {
    reviews: async (_: any, args: { id: string }) => {
      try {
        const id = args.id;
        if (!id) throw new Error("Id not found");
        const cache = await redis.get(`reviews:${id}`);
        if (cache) {
          return cache;
        }
        const reviews = await prisma.review.findMany({
          where: { productId: id },
          include: { user: true },
        });
        await redis.set(`reviews:${id}`, JSON.stringify(reviews), {
          ex: 60 * 60,
        });
        return reviews;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  },

  Mutation: {
    createReview: async (
      _: any,
      args: {
        data: {
          rating: number;
          comment: string;
          productId: string;
          userId: string;
          slug: string;
        };
      }
    ) => {
      try {
        const { rating, comment, productId, userId, slug } = args.data;
        if (!userId) throw new Error("user id not found");
        const user = await isAdmin(userId);
        if (!user) throw new Error("User not login");

        const review = await prisma.review.create({
          data: {
            rating: rating,
            comment: comment,
            userId: userId,
            productId: productId,
          },
        });
        await redis.del("reviews");
        await redis.del("allProducts");
        await redis.del("featured-products");
        await redis.del(`product:${slug}`);
        return review;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  },
};
