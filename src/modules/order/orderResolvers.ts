import { prisma } from "@/src/lib/db";
// Force TS Re-eval
import { isAdmin } from "@/src/lib/isAdmin";
import { sendPushToAll } from "@/src/lib/notify";
import { hashPassword } from "@/src/lib/password";
import { redis } from "@/src/lib/redis";
import { sendOrderConfirmationEmail } from "@/src/lib/email";
import { randomBytes } from "crypto";
export interface OrderItemInput {
  productId: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
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

  // Gift Card
  hasGiftCard?: boolean;
  giftCardFee?: number;
  giftCardSize?: string;
  giftCardTheme?: string;
  giftRecipient?: string;
  giftSender?: string;
  giftMessage?: string;

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
        const { isGuest, couponCode, items: inputItems, userId: inputUserId, ...orderInput } = input;
        let userId = inputUserId;

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

        // 2 Fetch settings for fees
        const settings = await prisma.storeSettings.findFirst() as any;
        if (!settings) throw new Error("Store settings not found");

        // 3. Fetch Fresh Product Data (Verify existence and price)
        const productIds = inputItems.map((item) => item.productId);
        const dbProducts = await prisma.product.findMany({
          where: { id: { in: productIds } },
        });

        // 4. Validation & Server-side Price Calculation
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
            size: inputItem.size, // Save size
            color: inputItem.color, // Save color
          };
        }) as any[];

        // 4. Coupon Logic
        let discountAmount = 0;
        let couponId = null;
        let promotionId = null;

        if (couponCode) {
          // Try to find a regular coupon first
          let coupon = await prisma.coupon.findUnique({
            where: { code: couponCode.toUpperCase() },
          });

          let isPromotion = false;

          if (!coupon) {
            // Try to find a promotion
            const promotion = await prisma.promotion.findFirst({
              where: {
                promoCode: {
                  equals: couponCode,
                  mode: "insensitive",
                },
              },
            });

            if (promotion) {
              // Map Promotion to Coupon-like structure for the next steps
              coupon = {
                id: promotion.id,
                code: promotion.promoCode,
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
              } as any;
              isPromotion = true;
              promotionId = promotion.id;
            }
          }

          if (!coupon || !coupon.isActive) {
            throw new Error(`Invalid or expired ${isPromotion ? "promotion" : "coupon"}`);
          }

          const now = new Date();
          if (
            now < new Date(coupon.validFrom) ||
            now > new Date(coupon.validUntil)
          ) {
            throw new Error(`${isPromotion ? "Promotion" : "Coupon"} has expired`);
          }

          if (
            coupon.minimumAmount &&
            calculatedSubtotal < coupon.minimumAmount
          ) {
            throw new Error(
              `Minimum order of ${coupon.minimumAmount} AED required`
            );
          }

          if (
            !isPromotion &&
            coupon.usageLimit &&
            coupon.usageCount >= coupon.usageLimit
          ) {
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
          } else if (coupon.discountType === "FIXED_AMOUNT") {
            discountAmount = coupon.discountValue;
          }

          discountAmount = Math.min(discountAmount, calculatedSubtotal);

          if (!isPromotion) {
            couponId = coupon.id;
          }
        }

        // 6. Dynamic Fee Calculation
        let deliveryCost = 0;
        if (input.deliveryType === "EXPRESS") {
          deliveryCost = Number(settings.expressDeliveryFee || 30);
        } else if (input.deliveryType === "SCHEDULED") {
          deliveryCost = Number(settings.scheduledDeliveryFee || 10);
        } else {
          // STANDARD: Flat rate or free if over threshold
          const threshold = settings.freeShippingThreshold ? Number(settings.freeShippingThreshold) : null;
          if (threshold !== null && calculatedSubtotal >= threshold) {
            deliveryCost = 0;
          } else {
            deliveryCost = Number(settings.deliveryFlatRate || 15);
          }
        }

        // Override if coupon gives free shipping
        const couponResult = couponCode ? await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } }) : null;
        if (couponResult?.discountType === "FREE_SHIPPING") {
          deliveryCost = 0;
        }

        const codFee = input.paymentMethod === "COD" ? Number(settings.codFee || 10) : 0;
        const giftCardFee = (input.hasGiftCard && settings.isGiftCardEnabled) ? Number(settings.giftCardFee || 0) : 0;

        // VAT calculation (5%)
        const vatRate = Number(settings.vatRate || 5) / 100;
        const vatAmount = Number(((calculatedSubtotal - discountAmount) * vatRate).toFixed(2));

        const finalTotal = Number((calculatedSubtotal - discountAmount + deliveryCost + codFee + giftCardFee + vatAmount).toFixed(2));



        // 5. Payment Verification (Server-Side)
        // NOTE: For Stripe Checkout flow, payment happens AFTER order creation.
        // So we skip verification here. The Webhook will handle it.
        // Unless we switch to PaymentIntents (Elements) in the future.

        // 6. TRANSACTION: The "Atomic" Operation
        console.time(`OrderTransaction:${input.email}`);
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
              user: userId ? { connect: { id: userId } } : undefined,
              totalAmount: finalTotal, // Use our calculated total
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
              // Force extra fields that Typescript doesn't know about yet
              ...({
                hasGiftCard: !!input.hasGiftCard,
                giftCardFee: giftCardFee,
                deliveryCost: deliveryCost,
                codFee: codFee,
                vatAmount: vatAmount,
                discount: discountAmount,
                deliveryDate: input.deliveryDate ? new Date(input.deliveryDate) : null,
              } as any),
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
              message: `New order received: ${createdOrder.id} (${finalTotal} AED)`,
              orderId: createdOrder.id,
            },
          });

          return createdOrder;
        }, {
          timeout: 20000, // 20 seconds
          isolationLevel: 'Serializable',
        });
        console.timeEnd(`OrderTransaction:${input.email}`);

        // 7. Post-Transaction Tasks (Background)

        // A. Send Email Invoice (ONLY FOR COD)
        // For Stripe, the Webhook should send the email after payment success.
        if (orderInput.paymentMethod === "COD") {
          sendOrderConfirmationEmail(order, { firstName: input.firstName, email: input.email })
            .catch(e => console.error("Email Error:", e));
        }

        // B. Push notifications
        sendPushToAll({
          title: "New Order",
          body: `Order #${order.id} received`,
          url: `/dashboard/orders/${order.id}`,
        }).catch((e) => console.error("Push Error:", e));

        // C. Clear Redis Cache
        const cacheKeys = [
          "allOrders",
          "allProducts",
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
        // Enhance error message for user
        if (error instanceof Error) {
          if (error.message.includes("Insufficient stock")) return new Error(error.message);
          // if (error.message.includes("Payment")) return new Error(error.message);
        }
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
