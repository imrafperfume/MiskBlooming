import { gql } from "@apollo/client";

export const PromotionTypeDefs = gql`
  enum PromotionScope {
    ALL
    CATEGORY
    PRODUCT
  }

  enum DiscountType {
    PERCENTAGE
    FIXED
  }

  enum PromotionStatus {
    ACTIVE
    EXPIRED
    PAUSED
    DRAFT
  }

  type Promotion {
    id: ID!
    name: String!
    discountType: DiscountType!
    discountValue: Float!
    startDate: String!
    endDate: String!
    isActive: Boolean!
    imageUrl: String
    scope: PromotionScope!
    promoCode: String!
    status: PromotionStatus!
    categories: [String!]!
    products: [String!]!
    createdAt: String!
    updatedAt: String!
  }

  input CreatePromotionInput {
    name: String!
    discountType: DiscountType!
    discountValue: Float!
    startDate: String!
    endDate: String!
    imageUrl: String
    scope: PromotionScope!
    promoCode: String!
    categories: [String!]
    products: [String!]
    status: PromotionStatus!
    isActive: Boolean!
  }

  input UpdatePromotionInput {
    name: String
    discountType: DiscountType
    discountValue: Float
    startDate: String
    endDate: String
    isActive: Boolean
    imageUrl: String
    scope: PromotionScope
    promoCode: String
    status: PromotionStatus
    categories: [String!]
    products: [String!]
  }

  type Query {
    getPromotions: [Promotion!]!
    getPromotionById(id: ID!): Promotion
  }
  type Mutation {
    createPromotion(input: CreatePromotionInput!): Promotion!
    updatePromotion(id: ID!, input: UpdatePromotionInput!): Promotion!
    deletePromotion(id: ID!): Boolean!
  }
`;
