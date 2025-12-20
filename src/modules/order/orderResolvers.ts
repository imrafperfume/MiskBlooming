import { prisma } from "@/src/lib/db";
import { isAdmin } from "@/src/lib/isAdmin";
import { sendPushToAll } from "@/src/lib/notify";
import { hashPassword } from "@/src/lib/password";
import { redis } from "@/src/lib/redis";
import { randomBytes } from "crypto";
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
    ordersByUser: async (
      _: any,
      args: { userId: string },
      context: { userId: string }
    ) => {
      try {
        const { userId } = args;
        console.log("🚀 ~ userId:", userId);
        if (!userId) throw new Error("User ID is required");
        // const cache = await redis.get(`ordersByUser:${userId}`);
        // if (cache) {
        //   return cache;
        // }
        const orders = await prisma.order.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        });
        console.log("🚀 ~ orders:", orders);
        if (!orders) throw new Error("No orders found for this user");
        await redis.set(`ordersByUser:${userId}`, JSON.stringify(orders), {
          ex: 60 * 2,
        });
        return orders;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    },
  },
  Mutation: {
    createOrder: async (_: any, { input }: { input: CreateOrderInput }) => {
      try {
        const { isGuest, couponCode, items: inputItems, ...orderInput } = input;
        let userId = input.userId;

        // 1. Guest User Logic
        if (isGuest && !userId) {
          const password = randomBytes(4).toString("hex");
          const passwordHash = await hashPassword(password);

          const user = await prisma.user.upsert({
            where: { email: input.email.toLowerCase() },
            update: {}, // Don't overwrite existing user data if they already exist
            create: {
              firstName: input.firstName,
              lastName: input.lastName,
              phoneNumber: input.phone,
              email: input.email.toLowerCase(),
              passwordHash,
              isGuest: true,
            },
          });
          userId = user.id;
        }

        // 2. Fetch Fresh Product Data (Verify existence and price)
        const productIds = inputItems.map((item) => item.productId);
        const dbProducts = await prisma.product.findMany({
          where: { id: { in: productIds } },
        });

        // 3. Validation & Server-side Price Calculation
        let calculatedSubtotal = 0;
        const itemsToCreate = inputItems.map((inputItem) => {
          const product = dbProducts.find((p) => p.id === inputItem.productId);

          if (!product)
            throw new Error(`Product ${inputItem.productId} not found`);
          if (product.status !== "active")
            throw new Error(`${product.name} is no longer available`);

          // CRITICAL: Use product.price from DB, NOT input.price from frontend
          calculatedSubtotal += product.price * inputItem.quantity;

          return {
            productId: product.id,
            quantity: inputItem.quantity,
            price: product.price, // Use DB price
          };
        });

        // 4. Coupon Logic
        let discountAmount = 0;
        let couponId = null;

        if (couponCode) {
          const coupon = await prisma.coupon.findUnique({
            where: { code: couponCode.toUpperCase() },
          });

          if (!coupon || !coupon.isActive)
            throw new Error("Invalid or expired coupon");

          const now = new Date();
          if (
            now < new Date(coupon.validFrom) ||
            now > new Date(coupon.validUntil)
          ) {
            throw new Error("Coupon has expired");
          }

          if (
            coupon.minimumAmount &&
            calculatedSubtotal < coupon.minimumAmount
          ) {
            throw new Error(
              `Minimum order of ${coupon.minimumAmount} AED required`
            );
          }

          if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
            throw new Error("Coupon usage limit reached");
          }

          // Calculate Discount
          if (coupon.discountType === "PERCENTAGE") {
            discountAmount = (calculatedSubtotal * coupon.discountValue) / 100;
            if (
              coupon.maximumDiscount &&
              discountAmount > coupon.maximumDiscount
            ) {
              discountAmount = coupon.maximumDiscount;
            }
          } else {
            discountAmount = coupon.discountValue;
          }

          discountAmount = Math.min(discountAmount, calculatedSubtotal);
          couponId = coupon.id;
        }

        const finalTotal = calculatedSubtotal - discountAmount;

        // 5. TRANSACTION: The "Atomic" Operation
        const order = await prisma.$transaction(async (tx) => {
          // A. Update Stock and verify availability (Atomic Check)
          for (const item of itemsToCreate) {
            const updatedProduct = await tx.product.updateMany({
              where: {
                id: item.productId,
                quantity: { gte: item.quantity }, // Only update if enough stock exists
              },
              data: {
                quantity: { decrement: item.quantity },
              },
            });

            if (updatedProduct.count === 0) {
              const p = dbProducts.find((x) => x.id === item.productId);
              throw new Error(`Insufficient stock for ${p?.name || "product"}`);
            }
          }

          // B. Increment Coupon Count
          if (couponId) {
            await tx.coupon.update({
              where: { id: couponId },
              data: { usageCount: { increment: 1 } },
            });
          }

          // C. Create Order
          const createdOrder = await tx.order.create({
            data: {
              ...orderInput,
              userId,
              totalAmount: finalTotal, // Use our calculated total
              deliveryDate: input.deliveryDate
                ? new Date(input.deliveryDate)
                : null,
              items: {
                create: itemsToCreate,
              },
              couponUsage: couponId
                ? {
                    create: {
                      couponId,
                      discountAmount,
                      orderAmount: finalTotal,
                      userId: userId!,
                      email: input.email,
                    },
                  }
                : undefined,
            },
            include: {
              items: { include: { product: true } },
              user: true,
              couponUsage: { include: { coupon: true } },
            },
          });

          // D. Create Internal Notification
          await tx.notification.create({
            data: {
              type: "order_created",
              message: `New order received: ${createdOrder.id}`,
              orderId: createdOrder.id,
            },
          });

          return createdOrder;
        });

        // 6. Post-Transaction Tasks (Background)
        // Push notifications
        sendPushToAll({
          title: "New Order",
          body: `Order #${order.id} received`,
          url: `/dashboard/orders/${order.id}`,
        }).catch((e) => console.error("Push Error:", e));

        // Clear Redis Cache
        const cacheKeys = [
          "allOrders",
          "orderStats",
          "featured-products",
          ...(userId ? [`ordersByUser:${userId}`] : []),
          ...(Array.isArray((order as any).items)
            ? (order as any).items.map((i: any) => `product:${i.product.slug}`)
            : []),
        ];
        console.log("🚀 ~ cacheKeys:", cacheKeys);

        await Promise.all(cacheKeys.map((key) => redis.del(key)));

        return order;
      } catch (error) {
        console.error("Order Creation Error:", error);
        if (error instanceof Error) throw error;
        throw new Error(
          "An unexpected error occurred while processing your order."
        );
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
