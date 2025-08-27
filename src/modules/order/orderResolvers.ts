import { prisma } from "@/src/lib/db";
import { isAdmin } from "@/src/lib/isAdmin";
import { redis } from "@/src/lib/redis";

export interface OrderItemInput {
  productId: string;
  quantity: number;
  price: number;
}

export interface CreateOrderInput {
  userId: string;

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
          include: {
            items: {
              include: {
                product: true,
              },
            },
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
  },
  Mutation: {
    createOrder: async (_: any, { input }: { input: CreateOrderInput }) => {
      try {
        const order = await prisma.order.create({
          data: {
            ...input,
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
          },
          include: {
            items: true,
          },
        });
        return order;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to create order");
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
