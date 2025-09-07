import { getSessionUserId } from "@/src/lib/session";
import { createSchema, createYoga } from "graphql-yoga";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { ProductResolvers } from "@/src/modules/product/productResolvers";
import { ProductTypeDefs } from "@/src/modules/product/product-typedefs";
import { IResolvers } from "@graphql-tools/utils";
import { YogaInitialContext } from "graphql-yoga";
import { rateLimit } from "@/src/lib/ratelimit";
import { OrderTypeDefs } from "@/src/modules/order/order-typedefs";
import { OrderResolvers } from "@/src/modules/order/orderResolvers";
import { UserTypeDefs } from "@/src/modules/user/user-typeDefs";
import { UserResolvers } from "@/src/modules/user/userResolvers";
import { dashboardTypeDefs } from "@/src/modules/dashboard/dashboard-typedefs";
import { DashboardResolvers } from "@/src/modules/dashboard/dasboardResolvers";
import { couponTypeDefs } from "@/src/modules/coupon/coupon-typedefs";
import { CouponResolvers } from "@/src/modules/coupon/couponResolvers";

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
  UserTypeDefs,
  dashboardTypeDefs,
  couponTypeDefs,
]);

interface ContextType {
  userId: string | null;
}

const resolvers = mergeResolvers([
  ProductResolvers,
  OrderResolvers,
  UserResolvers,
  DashboardResolvers,
  CouponResolvers,
]) as IResolvers<any, ContextType & YogaInitialContext>;

const schema = createSchema<ContextType>({
  typeDefs,
  resolvers,
});

const yoga = createYoga<ContextType>({
  schema,
  context: async ({ request }) => {
    try {
      const userId = await getSessionUserId();
      console.log("yoga ID", userId);
      const ip = request.headers.get("x-forwarded-for") || "unknown";
      const key = `rate:${ip}`;
      const limit = userId ? 150 : 60;
      const allowed = await rateLimit(key, limit, "1 m"); // 150 req / min if user login
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

// Use a single default export
export { yoga as GET, yoga as POST };