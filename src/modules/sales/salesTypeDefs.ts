import { gql } from "@apollo/client";

export const salesTypeDefs = gql`
  type Sales {
    id: ID!
    createdAt: String!
    updatedAt: String!
    subtotal: Float!
    grandTotal: Float!
    vat: Float!
    discount: Float!
    paymentMethod: SalesPaymentMethod!
    orderItems: [SalesItem!]!
    giftCard: Boolean!
    CashRecived: Float
  }

  type SalesItem {
    id: ID!
    salesId: ID!
    productId: ID!
    quantity: Int!
    sales: Sales!
    product: Product
  }

  enum SalesPaymentMethod {
    CASH
    ONLINE
  }

  # ➤ Query Types
  type Query {
    sales(skip: Float, take: Float): [Sales!]!
    sale(id: ID!): Sales
  }

  # ➤ Mutation Types
  type Mutation {
    createSale(
      subtotal: Float!
      grandTotal: Float!
      vat: Float!
      discount: Float!
      paymentMethod: SalesPaymentMethod!
      giftCard: Boolean
      CashRecived: Float
      items: [CreateSalesItemInput!]!
    ): Sales!
  }

  input CreateSalesItemInput {
    productId: String!
    quantity: Int!
  }
`;
