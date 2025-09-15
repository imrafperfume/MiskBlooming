import { prisma } from "@/src/lib/db";
import { isAdmin } from "@/src/lib/isAdmin";
import { redis } from "@/src/lib/redis";
import type { CreateCouponInput, UpdateCouponInput } from "@/src/types/coupon";

export const CouponResolvers = {
  Query: {
    allCoupons: async (_: any, __: any, context: { userId: string }) => {
      try {
        const { userId } = context;
        if (!userId) throw new Error("User not authenticated");

        const userRole = await isAdmin(userId);
        if (userRole.role !== "ADMIN") throw new Error("Not authorized");

        const cache = await redis.get("allCoupons");
        if (cache) {
          return cache;
        }

        const coupons = await prisma.coupon.findMany({
          orderBy: { createdAt: "desc" },
        });

        await redis.set("allCoupons", JSON.stringify(coupons), { ex: 60 * 5 });
        return coupons;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },

    couponById: async (
      _: any,
      args: { id: string },
      context: { userId: string }
    ) => {
      try {
        const { userId } = context;
        if (!userId) throw new Error("User not authenticated");

        const userRole = await isAdmin(userId);
        if (userRole.role !== "ADMIN") throw new Error("Not authorized");

        const coupon = await prisma.coupon.findUnique({
          where: { id: args.id },
          include: {
            usages: {
              include: {
                order: true,
              },
              orderBy: { usedAt: "desc" },
              take: 10,
            },
          },
        });

        if (!coupon) throw new Error("Coupon not found");
        return coupon;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },

    couponByCode: async (_: any, args: { code: string }) => {
      try {
        const coupon = await prisma.coupon.findUnique({
          where: { code: args.code.toUpperCase() },
        });

        return coupon;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },

    couponStats: async (_: any, __: any, context: { userId: string }) => {
      try {
        const { userId } = context;
        if (!userId) throw new Error("User not authenticated");

        const userRole = await isAdmin(userId);
        if (userRole.role !== "ADMIN") throw new Error("Not authorized");

        const cache = await redis.get("couponStats");
        if (cache) {
          return cache;
        }

        const now = new Date();
        const [
          totalCoupons,
          activeCoupons,
          expiredCoupons,
          totalUsage,
          totalDiscountGiven,
          topCoupons,
        ] = await Promise.all([
          prisma.coupon.count(),
          prisma.coupon.count({
            where: {
              isActive: true,
              validFrom: { lte: now },
              validUntil: { gte: now },
            },
          }),
          prisma.coupon.count({
            where: {
              validUntil: { lt: now },
            },
          }),
          prisma.couponUsage.count(),
          prisma.couponUsage.aggregate({
            _sum: { discountAmount: true },
          }),
          prisma.coupon.findMany({
            include: {
              _count: {
                select: { usages: true },
              },
              usages: {
                select: { discountAmount: true },
              },
            },
            orderBy: {
              usages: { _count: "desc" },
            },
            take: 5,
          }),
        ]);

        const stats = {
          totalCoupons,
          activeCoupons,
          expiredCoupons,
          totalUsage,
          totalDiscountGiven: totalDiscountGiven._sum.discountAmount || 0,
          topCoupons: topCoupons.map((coupon) => ({
            code: coupon.code,
            name: coupon.name,
            usageCount: coupon._count.usages,
            totalDiscount: coupon.usages.reduce(
              (sum, usage) => sum + usage.discountAmount,
              0
            ),
          })),
        };

        await redis.set("couponStats", JSON.stringify(stats), { ex: 60 * 5 });
        return stats;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },

    couponUsages: async (
      _: any,
      args: { couponId: string },
      context: { userId: string }
    ) => {
      try {
        const { userId } = context;
        if (!userId) throw new Error("User not authenticated");

        const userRole = await isAdmin(userId);
        if (userRole.role !== "ADMIN") throw new Error("Not authorized");

        const usages = await prisma.couponUsage.findMany({
          where: { couponId: args.couponId },
          include: {
            coupon: true,
            order: {
              include: {
                user: true,
              },
            },
          },
          orderBy: { usedAt: "desc" },
        });

        return usages;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },

    validateCoupon: async (
      _: any,
      args: { code: string; orderAmount: number; userId: string }
    ) => {
      try {
        const { code, orderAmount, userId } = args;

        // Only logged-in users can use coupons
        if (!userId) throw new Error("User not authenticated");

        // Find the coupon
        const coupon = await prisma.coupon.findUnique({
          where: { code: code.toUpperCase() },
        });
        if (!coupon) return { isValid: false, error: "Invalid coupon code" };

        const now = new Date();

        // Check coupon validity period and active status
        if (
          !coupon.isActive ||
          now < new Date(coupon.validFrom) ||
          now > new Date(coupon.validUntil)
        ) {
          return {
            isValid: false,
            error: "This coupon is not valid or has expired",
          };
        }

        // Minimum order amount check
        if (coupon.minimumAmount && orderAmount < coupon.minimumAmount) {
          return {
            isValid: false,
            error: `Minimum order amount of ${coupon.minimumAmount} required`,
          };
        }

        // Global usage limit
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
          return {
            isValid: false,
            error: "This coupon has reached its usage limit",
          };
        }

        // Per-user usage limit
        if (coupon.userUsageLimit) {
          const userUsageCount = await prisma.couponUsage.count({
            where: { couponId: coupon.id, userId },
          });
          if (userUsageCount >= coupon.userUsageLimit) {
            return {
              isValid: false,
              error: "You have already used this coupon",
            };
          }
        }

        // New users only
        if (coupon.newUsersOnly) {
          const userOrderCount = await prisma.order.count({
            where: { userId },
          });
          if (userOrderCount > 0) {
            return {
              isValid: false,
              error: "This coupon is only for new customers",
            };
          }
        }

        // Calculate discount
        let discountAmount = 0;
        if (coupon.discountType === "PERCENTAGE") {
          discountAmount = (orderAmount * coupon.discountValue) / 100;
          if (coupon.maximumDiscount)
            discountAmount = Math.min(discountAmount, coupon.maximumDiscount);
        } else if (coupon.discountType === "FIXED_AMOUNT") {
          discountAmount = coupon.discountValue;
        }

        discountAmount = Math.min(discountAmount, orderAmount);

        return { isValid: true, coupon, discountAmount };
      } catch (error: any) {
        return {
          isValid: false,
          error: error.message || "Coupon validation failed",
        };
      }
    },
  },

  Mutation: {
    createCoupon: async (
      _: any,
      args: { input: CreateCouponInput },
      context: { userId: string }
    ) => {
      try {
        const { userId } = context;
        if (!userId) throw new Error("User not authenticated");

        const userRole = await isAdmin(userId);
        if (userRole.role !== "ADMIN") throw new Error("Not authorized");

        const { input } = args;

        // Check if coupon code already exists
        const existingCoupon = await prisma.coupon.findUnique({
          where: { code: input.code.toUpperCase() },
        });

        if (existingCoupon) {
          throw new Error("Coupon code already exists");
        }

        const coupon = await prisma.coupon.create({
          data: {
            ...input,
            code: input.code.toUpperCase(),
            createdBy: userId,
            applicableProducts: input.applicableProducts || [],
            applicableCategories: input.applicableCategories || [],
            applicableUsers: input.applicableUsers || [],
            newUsersOnly: input.newUsersOnly || false,
          },
        });

        // Clear cache
        await redis.del("allCoupons");
        await redis.del("couponStats");

        return coupon;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },

    updateCoupon: async (
      _: any,
      args: { input: UpdateCouponInput },
      context: { userId: string }
    ) => {
      try {
        const { userId } = context;
        if (!userId) throw new Error("User not authenticated");

        const userRole = await isAdmin(userId);
        if (userRole.role !== "ADMIN") throw new Error("Not authorized");

        const { input } = args;
        const { id, ...updateData } = input;

        const coupon = await prisma.coupon.update({
          where: { id },
          data: updateData,
        });

        // Clear cache
        await redis.del("allCoupons");
        await redis.del("couponStats");

        return coupon;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },

    deleteCoupon: async (
      _: any,
      args: { id: string },
      context: { userId: string }
    ) => {
      try {
        const { userId } = context;
        if (!userId) throw new Error("User not authenticated");

        const userRole = await isAdmin(userId);
        if (userRole.role !== "ADMIN") throw new Error("Not authorized");

        await prisma.coupon.delete({
          where: { id: args.id },
        });

        // Clear cache
        await redis.del("allCoupons");
        await redis.del("couponStats");

        return true;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },

    toggleCouponStatus: async (
      _: any,
      args: { id: string },
      context: { userId: string }
    ) => {
      try {
        const { userId } = context;
        if (!userId) throw new Error("User not authenticated");

        const userRole = await isAdmin(userId);
        if (userRole.role !== "ADMIN") throw new Error("Not authorized");

        const coupon = await prisma.coupon.findUnique({
          where: { id: args.id },
        });

        if (!coupon) throw new Error("Coupon not found");

        const updatedCoupon = await prisma.coupon.update({
          where: { id: args.id },
          data: { isActive: !coupon.isActive },
        });

        // Clear cache
        await redis.del("allCoupons");
        await redis.del("couponStats");

        return updatedCoupon;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  },
};
