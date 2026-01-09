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
      args: { code: string; orderAmount: number; userId?: string }
    ) => {
      const { code, orderAmount, userId } = args;

      // Try to find as a regular coupon first
      let coupon = await prisma.coupon.findUnique({
        where: { code: code.toUpperCase() },
      });

      let isPromotion = false;

      // If not found as coupon, try to find as a promotion
      if (!coupon) {
        const promotion = await prisma.promotion.findFirst({
          where: {
            promoCode: {
              equals: code,
              mode: "insensitive",
            },
          },
        });

        if (promotion) {
          // Map Promotion to Coupon-like structure
          coupon = {
            id: promotion.id,
            code: promotion.promoCode,
            name: promotion.name,
            discountType:
              promotion.discountType === "PERCENTAGE"
                ? "PERCENTAGE"
                : "FIXED_AMOUNT",
            discountValue: promotion.discountValue,
            validFrom: promotion.startDate,
            validUntil: promotion.endDate,
            isActive: promotion.isActive && promotion.status === "ACTIVE",
            minimumAmount: null,
            maximumDiscount: null,
            usageLimit: null,
            usageCount: 0,
            userUsageLimit: null,
            newUsersOnly: false,
            description: "",
            applicableProducts: promotion.products,
            applicableCategories: promotion.categories,
            applicableUsers: [],
            createdAt: promotion.createdAt,
            updatedAt: promotion.updatedAt,
            createdBy: null,
          } as any;
          isPromotion = true;
        }
      }

      if (!coupon) {
        return { isValid: false, error: "Invalid coupon code" };
      }

      const now = new Date();
      const validFrom = new Date(coupon.validFrom);
      const validUntil = new Date(coupon.validUntil);

      // Coupon/Promotion active & valid period check
      if (!coupon.isActive || now < validFrom || now > validUntil) {
        return {
          isValid: false,
          error: `${isPromotion ? "Promotion" : "Coupon"
            } is not valid or has expired`,
        };
      }

      // Minimum order amount (only for regular coupons for now)
      if (coupon.minimumAmount && orderAmount < coupon.minimumAmount) {
        return {
          isValid: false,
          error: `Minimum order amount of ${coupon.minimumAmount} required`,
        };
      }

      // Global usage limit (only for regular coupons)
      if (
        !isPromotion &&
        coupon.usageLimit &&
        coupon.usageCount >= coupon.usageLimit
      ) {
        return {
          isValid: false,
          error: "This coupon has reached its usage limit",
        };
      }

      // Per-user usage & new users only check (only for regular coupons and when userId is provided)
      if (!isPromotion && userId && (coupon.userUsageLimit || coupon.newUsersOnly)) {
        let userUsageCount = 0;
        let userOrderCount = 0;

        await prisma.$transaction(async (tx) => {
          if (coupon!.userUsageLimit) {
            userUsageCount = await tx.couponUsage.count({
              where: { couponId: coupon!.id, userId },
            });
          }
          if (coupon!.newUsersOnly) {
            userOrderCount = await tx.order.count({ where: { userId } });
          }
        });

        if (userOrderCount || userUsageCount) {
          return {
            isValid: false,
            error: "This coupon only for new user or already applied",
          };
        }
      }

      // Calculate discount
      let discountAmount = 0;
      if (coupon.discountType === "PERCENTAGE") {
        discountAmount = (orderAmount * coupon.discountValue) / 100;
        if (coupon.maximumDiscount) {
          discountAmount = Math.min(discountAmount, coupon.maximumDiscount);
        }
      } else if (coupon.discountType === "FIXED_AMOUNT") {
        discountAmount = coupon.discountValue;
      }

      discountAmount = Math.min(discountAmount, orderAmount);

      return { isValid: true, coupon, discountAmount };
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
