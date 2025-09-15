import { gql } from "@apollo/client";

export const couponTypeDefs = gql`
  type Coupon {
    id: ID!
    code: String!
    name: String!
    description: String
    discountType: DiscountType!
    discountValue: Float!
    minimumAmount: Float
    maximumDiscount: Float
    usageLimit: Int
    usageCount: Int!
    userUsageLimit: Int
    validFrom: String!
    validUntil: String!
    isActive: Boolean!
    applicableProducts: [String!]!
    applicableCategories: [String!]!
    applicableUsers: [String!]!
    newUsersOnly: Boolean!
    createdAt: String!
    updatedAt: String!
    createdBy: String
  }

  type CouponUsage {
    id: ID!
    couponId: String!
    orderId: String!
    userId: String
    email: String
    discountAmount: Float!
    orderAmount: Float!
    usedAt: String!
    coupon: Coupon!
  }

  type CouponValidationResult {
    isValid: Boolean!
    coupon: Coupon
    discountAmount: Float
    error: String
  }

  type CouponStats {
    totalCoupons: Int!
    activeCoupons: Int!
    expiredCoupons: Int!
    totalUsage: Int!
    totalDiscountGiven: Float!
    topCoupons: [TopCoupon!]!
  }

  type TopCoupon {
    code: String!
    name: String!
    usageCount: Int!
    totalDiscount: Float!
  }

  enum DiscountType {
    PERCENTAGE
    FIXED_AMOUNT
    FREE_SHIPPING
  }

  input CreateCouponInput {
    code: String!
    name: String!
    description: String
    discountType: DiscountType!
    discountValue: Float!
    minimumAmount: Float
    maximumDiscount: Float
    usageLimit: Int
    userUsageLimit: Int
    validFrom: String!
    validUntil: String!
    applicableProducts: [String!]
    applicableCategories: [String!]
    applicableUsers: [String!]
    newUsersOnly: Boolean
  }

  input UpdateCouponInput {
    id: ID!
    name: String
    description: String
    discountValue: Float
    minimumAmount: Float
    maximumDiscount: Float
    usageLimit: Int
    userUsageLimit: Int
    validFrom: String
    validUntil: String
    isActive: Boolean
    applicableProducts: [String!]
    applicableCategories: [String!]
    applicableUsers: [String!]
    newUsersOnly: Boolean
  }

  extend type Query {
    # Admin queries
    allCoupons: [Coupon!]!
    couponById(id: ID!): Coupon
    couponByCode(code: String!): Coupon
    couponStats: CouponStats!
    couponUsages(couponId: ID!): [CouponUsage!]!

    # Public queries
    validateCoupon(
      code: String!
      orderAmount: Float!
      userId: String!
    ): CouponValidationResult!
  }

  extend type Mutation {
    # Admin mutations
    createCoupon(input: CreateCouponInput!): Coupon!
    updateCoupon(input: UpdateCouponInput!): Coupon!
    deleteCoupon(id: ID!): Boolean!
    toggleCouponStatus(id: ID!): Coupon!
  }
`;
