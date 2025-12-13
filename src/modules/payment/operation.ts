import { gql } from "@apollo/client";

export const GET_PAYMENT_SETTINGS = gql`
  query GetPaymentSettings {
    getPaymentSettings {
      stripeEnabled
      codEnabled
    }
  }
`;

export const UPDATE_PAYMENT_SETTINGS = gql`
  mutation UpdatePaymentSettings(
    $stripeEnabled: Boolean!
    $codEnabled: Boolean!
  ) {
    updatePaymentSettings(
      stripeEnabled: $stripeEnabled
      codEnabled: $codEnabled
    ) {
      stripeEnabled
      codEnabled
    }
  }
`;
