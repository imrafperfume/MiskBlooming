import { getSessionUserId } from "@/src/lib/session"
import { createSchema, createYoga } from "graphql-yoga"
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { ProductResolvers } from "@/src/modules/product/productResolvers";
import { ProductTypeDefs } from "@/src/modules/product/product-typedefs";
import { IResolvers } from "@graphql-tools/utils";
import { YogaInitialContext } from "graphql-yoga";
import { rateLimit } from "@/src/lib/ratelimit";
import { OrderTypeDefs } from "@/src/modules/order/order-typedefs";
import { OrderResolvers } from "@/src/modules/order/orderResolvers";
const typeDefs = mergeTypeDefs([
    `
    type Query {
      _empty: String
    }
    type Mutation {
      _empty: String
    }
  `,
    ProductTypeDefs,
    OrderTypeDefs,
]);

// const resolvers = mergeResolvers([ProductResolvers]);

interface ContextType {
    userId: string | null;
}

const resolvers = mergeResolvers([ProductResolvers, OrderResolvers]) as IResolvers<any, ContextType & YogaInitialContext>;

const schema = createSchema<ContextType>({
    typeDefs,
    resolvers,
});

const yoga = createYoga<ContextType>({
    schema,
    context: async ({ request }) => {
        console.log("Context called");


        try {
            const userId = await getSessionUserId();
            console.log("yoga ID", userId);
            const ip = request.headers.get("x-forwarded-for") || "unknown";
            const key = `rate:${ip}`;
            const limit = userId ? 150 : 60;
            const allowed = await rateLimit(key, limit, "1 m"); // 20 req / min if user login
            if (!allowed) {
                throw new Error("Too many requests. Please try again later.");
            }
            return { userId };
        } catch (error: any) {
            console.error(error);
            throw new Error("Internal Server Error");
        }
    },
    graphiql: true,
});

export const GET = yoga;
export const POST = yoga;
