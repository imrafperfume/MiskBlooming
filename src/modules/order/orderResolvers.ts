import { prisma } from "@/src/lib/db";
import { isAdmin } from "@/src/lib/isAdmin";
import { hashPassword } from "@/src/lib/password";
import { redis } from "@/src/lib/redis";

export interface OrderItemInput {
  productId: string;
  quantity: number;
  price: number;
}

export interface CreateOrderInput {
  userId?: string; // Optional for guest checkout
  isGuest?: boolean; // Flag to identify guest checkout

  // Customer Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Shipping Address
  address: string;
  city: string;
  emirate: string;
  postalCode?: string;

  // Payment Info
  paymentMethod: "COD" | "STRIPE";
  stripePaymentId?: string; // Stripe intent/charge ID
  cardLast4?: string; // Only for STRIPE

  // Delivery Options
  deliveryType: "STANDARD" | "EXPRESS" | "SCHEDULED";
  deliveryDate?: string;
  deliveryTime?: string;
  specialInstructions?: string;

  // Order Items
  items: OrderItemInput[];

  // Coupon
  couponCode?: string;

  // Order Total
  totalAmount: number;
}

type OrderStats = {
  totalOrders: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  revenue: number;
};

type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

interface UpdateOrderStatusArgs {
  id: string;
  status: OrderStatus;
}
export const OrderResolvers = {
  Query: {
    allOrders: async (_: any, __: any, context: { userId: string }) => {
      try {
        const { userId } = context;
        if (!userId) throw new Error("user ID not found");
        const userRole = await isAdmin(userId);
        // 🔹 Admin check
        if (userRole.role !== "ADMIN") throw new Error("Not authorized");
        const orderCache = await redis.get("allOrders");
        if (orderCache) {
          return orderCache;
        }
        const orders = await prisma.order.findMany({
          orderBy: {
            createdAt: "desc",
          },
        });
        if (!orders) throw new Error("Orders not available");
        await redis.set("allOrders", JSON.stringify(orders), { ex: 60 * 5 });
        return orders;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    orderStats: async (_: any, __: any, context: { userId: string }) => {
      try {
        const { userId } = context;
        if (!userId) throw new Error("User not found");
        const userRole = await isAdmin(userId);
        if (userRole.role !== "ADMIN") throw new Error("Unauthorized");

        const cache = await redis.get("orderStats");
        if (cache) {
          return cache;
        }
        const [
          totalOrders,
          pending,
          processing,
          shipped,
          delivered,
          cancelled,
          revenue,
        ] = await Promise.all([
          prisma.order.count(),
          prisma.order.count({ where: { status: "PENDING" } }),
          prisma.order.count({ where: { status: "PROCESSING" } }),
          prisma.order.count({ where: { status: "SHIPPED" } }),
          prisma.order.count({ where: { status: "DELIVERED" } }),
          prisma.order.count({ where: { status: "CANCELLED" } }),
          prisma.order.aggregate({
            _sum: { totalAmount: true },
          }),
        ]);
        const stats: OrderStats = {
          totalOrders,
          pending,
          processing,
          shipped,
          delivered,
          cancelled,
          revenue: revenue._sum.totalAmount || 0,
        };
        await redis.set("orderStats", JSON.stringify(stats), { ex: 60 * 5 });
        return stats;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    orderById: async (_: any, args: { id: string }) => {
      try {
        const { id } = args;
        console.log("🚀 ~ id:", id);
        if (!id) throw new Error("Id not found");
        const cache = await redis.get(`orderById:${id}`);
        if (cache) {
          return cache;
        }
        const order = await prisma.order.findUnique({
          where: {
            id: id,
          },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        });
        if (!order) throw new Error("Order not found");
        await redis.set(`orderById:${id}`, JSON.stringify(order), {
          ex: 60 * 2,
        });
        return order;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    createOrder: async (_: any, { input }: { input: CreateOrderInput }) => {
      try {
        const { isGuest, couponCode, ...orderInput } = input;
        console.log("🚀 ~ couponCode:", couponCode);
        console.log("🚀 ~ orderInput:", orderInput);
        console.log("🚀 ~ isGuest:", isGuest);
        let userId = input.userId;

        // Validate that all products exist before creating the order
        const productIds = input.items.map((item) => item.productId);
        console.log("🚀 ~ productIds:", productIds);
        const existingProducts = await prisma.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true, name: true, status: true },
        });
        console.log("🚀 ~ existingProducts:", existingProducts);

        if (existingProducts.length !== productIds.length) {
          const existingProductIds = existingProducts.map((p) => p.id);
          const missingProductIds = productIds.filter(
            (id) => !existingProductIds.includes(id)
          );
          throw new Error(
            `Products not found: ${missingProductIds.join(", ")}`
          );
        }

        // Check if any products are not active
        const inactiveProducts = existingProducts.filter(
          (p) => p.status !== "active"
        );
        if (inactiveProducts.length > 0) {
          const inactiveProductNames = inactiveProducts
            .map((p) => p.name)
            .join(", ");
          throw new Error(
            `Products are not available: ${inactiveProductNames}`
          );
        }

        // Handle coupon validation and usage
        let couponUsage = null;
        if (couponCode) {
          const coupon = await prisma.coupon.findUnique({
            where: { code: couponCode.toUpperCase() },
          });

          if (!coupon) throw new Error("Invalid coupon code");

          const now = new Date();
          if (
            !coupon.isActive ||
            now < new Date(coupon.validFrom) ||
            now > new Date(coupon.validUntil)
          ) {
            throw new Error("Coupon is not valid or has expired");
          }

          if (
            coupon.minimumAmount &&
            input.totalAmount < coupon.minimumAmount
          ) {
            throw new Error(
              `Minimum order amount of ${coupon.minimumAmount} AED required for this coupon`
            );
          }

          if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
            throw new Error("This coupon has reached its usage limit");
          }

          // Calculate discount
          let discountAmount = 0;
          if (coupon.discountType === "PERCENTAGE") {
            discountAmount = (input.totalAmount * coupon.discountValue) / 100;
            if (
              coupon.maximumDiscount &&
              discountAmount > coupon.maximumDiscount
            ) {
              discountAmount = coupon.maximumDiscount;
            }
          } else if (coupon.discountType === "FIXED_AMOUNT") {
            discountAmount = coupon.discountValue;
          }

          discountAmount = Math.min(discountAmount, input.totalAmount);
          console.log("🚀 ~ discountAmount:", discountAmount);

          couponUsage = {
            couponId: coupon.id,
            discountAmount,
            orderAmount: input.totalAmount,
            userId: userId || null,
            email: input.email,
          };
          console.log("🚀 ~ couponUsage:", couponUsage);
        }

        // If user is not logged in (guest checkout), create a new guest user
        if (isGuest || !userId) {
          const password = Math.random().toString(36).slice(-8);
          const passwordHash = await hashPassword(password);
          const guestUser = await prisma.user.create({
            data: {
              email: input.email,
              firstName: input.firstName,
              lastName: input.lastName,
              phoneNumber: input.phone,
              role: "GUEST",
              isGuest: true,
              passwordHash,
            },
          });
          userId = guestUser.id;
          console.log(`Created guest user with ID: ${userId}`);
        }

        // Build orderData safely (couponCode বাদ দিয়ে)
        const orderData: any = {
          ...orderInput,
          userId,
          deliveryDate: input.deliveryDate
            ? new Date(input.deliveryDate)
            : null,
          items: {
            create: input.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        };

        if (couponUsage) {
          orderData.couponUsage = { create: couponUsage };
        }

        const order = await prisma.order.create({
          data: orderData,
          include: {
            items: { include: { product: true } },
            user: true,
            couponUsage: { include: { coupon: true } },
          },
        });

        // Update coupon usage count
        if (couponUsage) {
          await prisma.coupon.update({
            where: { id: couponUsage.couponId },
            data: { usageCount: { increment: 1 } },
          });
        }

        return order;
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          throw new Error(`Failed to create order: ${error.message}`);
        }
        throw new Error("Failed to create order");
      }
    },

    updateOrderStatus: async (
      _: any,
      args: UpdateOrderStatusArgs,
      context: { userId: string }
    ) => {
      try {
        const { userId } = context;
        if (!userId) throw new Error("User not authenticated");

        // Optional: check if user is admin
        const userRole = await isAdmin(userId);
        if (userRole.role !== "ADMIN") throw new Error("Not authorized");

        const updatedOrder = await prisma.order.update({
          where: { id: args.id },
          data: {
            status: args.status,
          },
          include: {
            user: true,
            items: { include: { product: true } },
          },
        });
        await redis.del("orderStats");
        return updatedOrder;
      } catch (error) {
        console.error("Error updating order status:", error);
        throw new Error("Failed to update order status");
      }
    },
    // updateOrderPayment: async (_: any, { id, payme }: { id: string, input: CreateOrderInput }) => {
    //     try {
    //         const update = await prisma.order.update({
    //             where: { id },
    //             data: {
    //                 ...input,
    //             },
    //         })
    //     } catch (error) {

    //     }
    // }
  },
};
