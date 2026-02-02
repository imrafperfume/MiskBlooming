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
import { CategoryTypeDefs } from "@/src/modules/category/category-typedefs";
import { CategoryResolvers } from "@/src/modules/category/category-resolvers";
import { ReviewTypeDefs } from "@/src/modules/review/review-typeDefs";
import { ReviewResolvers } from "@/src/modules/review/review-resolvers";
import { PaymentTypeDefs } from "@/src/modules/payment/paymentTypeDefs";
import { paymentResolvers } from "@/src/modules/payment/paymentResolvers";
import { salesResolvers } from "@/src/modules/sales/salesResovers";
import { salesTypeDefs } from "@/src/modules/sales/salesTypeDefs";
import { themeResolvers } from "@/src/modules/theme/systemResolvers";
import { ThemeTypeDefs } from "@/src/modules/theme/systemTypeDefs";
import { settingTypeDefs } from "@/src/modules/system/settingTypeDefs";
import { SettingResolvers } from "@/src/modules/system/settingResolvers";
import { ManagementTypeDefs } from "@/src/modules/contentManagment/managmentTypeDefs";
import { ManagementResolvers } from "@/src/modules/contentManagment/ManagmentResolvers";
import { PromotionResolvers } from "@/src/modules/promotion/promotionResolvers";
import { PromotionTypeDefs } from "@/src/modules/promotion/promotionTypeDefs";
import { notificationTypeDefs } from "@/src/modules/notification/notificationTypeDefs";
import { notificationResolvers } from "@/src/modules/notification/notificationResolvers";
import { membershipTypeDefs } from "@/src/modules/membership/membershipTypeDefs";
import { membershipResolvers } from "@/src/modules/membership/membershipResolvers";
import { footerTypeDefs } from "@/src/modules/content/footerTypeDefs";
import { footerResolvers } from "@/src/modules/content/footerResolvers";
import { SubscribeTypeDefs } from "@/src/modules/subscribe/subscribeTypeDefs";
import { SubscribeResolvers } from "@/src/modules/subscribe/subscribeResolvers";

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
  CategoryTypeDefs,
  ReviewTypeDefs,
  PaymentTypeDefs,
  salesTypeDefs,
  ThemeTypeDefs,
  settingTypeDefs,
  ManagementTypeDefs,
  PromotionTypeDefs,
  notificationTypeDefs,
  membershipTypeDefs,
  footerTypeDefs,
  SubscribeTypeDefs
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
  CategoryResolvers,
  ReviewResolvers,
  paymentResolvers,
  salesResolvers,
  themeResolvers,
  SettingResolvers,
  ManagementResolvers,
  PromotionResolvers,
  notificationResolvers,
  membershipResolvers,
  footerResolvers,
  SubscribeResolvers
]) as IResolvers<any, ContextType & YogaInitialContext>;

const schema = createSchema<ContextType>({
  typeDefs,
  resolvers,
});

const yoga = createYoga<ContextType>({
  schema,
  fetchAPI: { Request, Response },
  context: async ({ request }) => {
    try {
      const userId = await getSessionUserId();
      const ip = request.headers.get("x-forwarded-for") || "unknown";
      const key = `rate:${ip}`;
      const limit = userId ? 150 : 60;

      const allowed = await rateLimit(key, limit, "1 m");
      if (!allowed) {
        throw new Error("Too many requests. Please try again later.");
      }
      return { userId };
    } catch (error: any) {
      console.error("GraphQL Context error:", error.message || error);

      // If it's the rate limit error, propagate it
      if (error.message?.includes("Too many requests")) {
        throw error;
      }

      // Otherwise, log it and return generic error to client
      throw new Error("Internal Server Error");
    }
  },
});

// Use a single default export
export { yoga as GET, yoga as POST };
