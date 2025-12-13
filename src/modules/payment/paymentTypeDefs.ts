import { gql } from "@apollo/client";

export const PaymentTypeDefs = gql`
  type PaymentSetting {
    id: ID!
    stripeEnabled: Boolean!
    codEnabled: Boolean!
    updatedAt: String!
  }

  type Query {
    getPaymentSettings: PaymentSetting!
  }

  type Mutation {
    updatePaymentSettings(
      stripeEnabled: Boolean!
      codEnabled: Boolean!
    ): PaymentSetting!
  }
`;
