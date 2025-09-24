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
        const { isGuest, couponCode, ...orderInput } = input;
        console.log("🚀 ~ couponCode:", couponCode);
        let userId = input.userId;

        // Guest user creation or find
        if (isGuest && !userId) {
          const password = randomBytes(4).toString("hex");
          const passwordHash = await hashPassword(password);

          const user = await prisma.user.upsert({
            where: { email: input.email },
            update: {},
            create: {
              firstName: input.firstName,
              lastName: input.lastName,
              phoneNumber: input.phone,
              email: input.email,
              passwordHash,
              isGuest: true,
            },
          });

          userId = user.id;
        }

        // Validate products
        const productIds = input.items.map((item) => item.productId);
        const existingProducts = await prisma.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true, name: true, status: true, quantity: true },
        });

        const missingProductIds = productIds.filter(
          (id) => !existingProducts.find((p) => p.id === id)
        );
        if (missingProductIds.length > 0)
          throw new Error(
            `Products not found: ${missingProductIds.join(", ")}`
          );

        const inactiveProducts = existingProducts.filter(
          (p) => p.status !== "active"
        );
        if (inactiveProducts.length > 0)
          throw new Error(
            `Products are not available: ${inactiveProducts
              .map((p) => p.name)
              .join(", ")}`
          );

        // Coupon validation
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

          if (coupon.minimumAmount && input.totalAmount < coupon.minimumAmount)
            throw new Error(
              `Minimum order amount of ${coupon.minimumAmount} AED required for this coupon`
            );

          if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit)
            throw new Error("This coupon has reached its usage limit");

          // Discount calculation
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

          couponUsage = {
            couponId: coupon.id,
            discountAmount,
            orderAmount: input.totalAmount,
            userId: userId,
            email: input.email,
          };
        }

        // Build orderData
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
          couponUsage: couponUsage ? { create: { ...couponUsage } } : undefined,
        };

        console.log("orderData", orderData);

        // Transaction: create order, update stock, send notification
        const order = await prisma.$transaction(async (tx) => {
          const createdOrder = await tx.order.create({
            data: orderData,
            include: {
              items: { include: { product: true } },
              user: true,
              couponUsage: { include: { coupon: true } },
            },
          });

          console.log("🚀 ~ createdOrder:", createdOrder);

          // Stock update
          await Promise.all(
            createdOrder.items.map(async (item) => {
              const product = existingProducts.find(
                (p) => p.id === item.productId
              );
              if (!product)
                throw new Error(`Product not found: ${item.productId}`);
              if (product.quantity < item.quantity)
                throw new Error(`Insufficient stock for ${product.name}`);

              await tx.product.update({
                where: { id: item.productId },
                data: { quantity: { decrement: item.quantity } },
              });
            })
          );

          // Notification
          const notification = await tx.notification.create({
            data: {
              type: "order_created",
              message: `New order received: ${createdOrder.id}`,
              orderId: createdOrder.id,
            },
          });

          // Push notification (background)
          sendPushToAll({
            title: "New Order",
            body: notification.message,
            url: `/dashboard/orders/${createdOrder.id}`,
          }).catch((e) => console.error("sendPushToAll error:", e));

          return createdOrder;
        });

        // Clear Redis caches
        await redis.del("allOrders");
        await redis.del("orderStats");
        await redis.del(`orderById:${order.id}`);
        await redis.del("featured-products");
        await Promise.all(
          order.items.map((i) => redis.del(`product:${i.product.slug}`))
        );
        if (userId) await redis.del(`ordersByUser:${userId}`);

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
        if (error instanceof Error)
          throw new Error(`Failed to create order: ${error.message}`);
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
