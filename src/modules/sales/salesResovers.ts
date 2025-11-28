import { prisma } from "@/src/lib/db";
import { isAdmin, validateAdmin } from "@/src/lib/isAdmin";
import { redis } from "@/src/lib/redis";
import { GraphQLError } from "graphql";

// --- Types ---
interface Context {
  userId: string;
}

interface SaleItemInput {
  productId: string;
  quantity: number;
}

interface CreateSaleArgs {
  subtotal: number;
  grandTotal: number;
  vat: number;
  discount: number;
  paymentMethod: "CASH" | "ONLINE";
  giftCard?: boolean;
  CashRecived?: number; // DB Schema typo preserved
  items: SaleItemInput[];
}

interface SalesQueryArgs {
  skip?: number;
  take?: number;
}

export const salesResolvers = {
  Query: {
    sales: async (
      _: unknown,
      { skip = 0, take = 50 }: SalesQueryArgs,
      context: Context
    ) => {
      await validateAdmin(context.userId);

      const cacheKey = `sales:${skip}:${take}`;

      try {
        // 1. Cache Strategy: Cache specific pages
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
          return cachedData;
        }

        // 2. Fetch Data with Pagination
        const [sales, totalCount] = await Promise.all([
          prisma.sales.findMany({
            skip,
            take,
            orderBy: { createdAt: "desc" },
            include: {
              orderItems: {
                include: {
                  product: {
                    select: { id: true, name: true, price: true, sku: true },
                  },
                },
              },
            },
          }),
          prisma.sales.count(),
        ]);

        const result = { sales, totalCount };

        // 3. Set Cache (Short TTL is safer for volatile sales data)
        await redis.set(cacheKey, JSON.stringify(result), { ex: 30 });

        // If strict on returning array only, just return `sales`.
        return sales;
      } catch (error) {
        console.error("Query.sales failed:", error);
        throw new GraphQLError("Failed to fetch sales history");
      }
    },
    sale: async (_: unknown, args: { id: string }, context: Context) => {
      await validateAdmin(context.userId);

      try {
        const sale = await prisma.sales.findUnique({
          where: { id: args.id },
          include: {
            orderItems: {
              include: {
                product: {
                  select: { id: true, name: true, price: true, sku: true },
                },
              },
            },
          },
        });
        return sale;
      } catch (error) {
        throw new GraphQLError("Failed to fetch sale details");
      }
    },
  },

  Mutation: {
    createSale: async (_: unknown, args: CreateSaleArgs, context: Context) => {
      await validateAdmin(context.userId);

      const { items, ...financials } = args;

      // 1. Validate Input Structure
      if (!items || items.length === 0) {
        throw new GraphQLError("Order must contain at least one item.", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      // 2. Transaction: quantity Check -> Create Sale -> Update quantity
      try {
        const result = await prisma.$transaction(async (tx) => {
          // A. Fetch current quantity for all items
          const productIds = items.map((i) => i.productId);
          console.log("🚀 ~ productIds:", productIds);
          const productsInDb = await tx.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, name: true, price: true, quantity: true },
          });
          console.log("🚀 ~ productsInDb:", productsInDb);

          // B. Server-Side Validation (quantity & Math)
          let calculatedSubtotal = 0;

          for (const item of items) {
            const product = productsInDb.find((p) => p.id === item.productId);

            if (!product) {
              throw new Error(`Product ID ${item.productId} not found.`);
            }

            // Check quantity
            if (product.quantity < item.quantity) {
              throw new Error(
                `Insufficient quantity for ${product.name}. Available: ${product.quantity}`
              );
            }

            calculatedSubtotal += product.price * item.quantity;
          }

          // Optional: Verify client totals match server totals (tolerance of 0.1 for floating point)
          // const expectedTotal = calculatedSubtotal - financials.discount + financials.vat;
          // if (Math.abs(expectedTotal - financials.grandTotal) > 0.1) {
          //    throw new Error("Price mismatch detected. Please refresh.");
          // }

          // C. Create the Sale
          const newSale = await tx.sales.create({
            data: {
              subtotal: financials.subtotal,
              grandTotal: financials.grandTotal,
              vat: financials.vat,
              discount: financials.discount,
              paymentMethod: financials.paymentMethod,
              giftCard: financials.giftCard || false,
              CashRecived: financials.CashRecived || null,
              orderItems: {
                create: items.map((item) => ({
                  productId: item.productId,
                  quantity: item.quantity,
                })),
              },
            },
            include: {
              orderItems: true,
            },
          });

          // D. Decrement quantity (Atomic Update)
          await Promise.all(
            items.map((item) =>
              tx.product.update({
                where: { id: item.productId },
                data: {
                  quantity: { decrement: item.quantity },
                },
              })
            )
          );
          console.log("🚀 ~ newSale:", newSale);

          return newSale;
        });

        // 3. Cache Invalidation
        const keys = await redis.keys("sales:*");
        if (keys.length > 0) await redis.del(...keys);
        await redis.del("products:all");

        return result;
      } catch (error: any) {
        // Log the actual error for dev/ops
        console.error("CreateSale Transaction Failed:", error);

        // Return a clean error to the client
        if (error.message.includes("Insufficient quantity")) {
          throw new GraphQLError(error.message, {
            extensions: { code: "INSUFFICIENT_quantity" },
          });
        }

        throw new GraphQLError("Transaction failed. Order not processed.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            originalError: error.message,
          },
        });
      }
    },
  },
};
