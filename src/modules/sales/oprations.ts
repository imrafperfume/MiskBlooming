import { gql } from "@apollo/client";

export const CREATE_SALE = gql`
  mutation CreateSale(
    $subtotal: Float!
    $grandTotal: Float!
    $vat: Float!
    $discount: Float!
    $paymentMethod: SalesPaymentMethod!
    $giftCard: Boolean
    $CashRecived: Float
    $items: [CreateSalesItemInput!]!
  ) {
    createSale(
      subtotal: $subtotal
      grandTotal: $grandTotal
      vat: $vat
      discount: $discount
      paymentMethod: $paymentMethod
      giftCard: $giftCard
      CashRecived: $CashRecived
      items: $items
    ) {
      id
      createdAt
      updatedAt
      subtotal
      grandTotal
      vat
      discount
      paymentMethod
      giftCard
      CashRecived
      orderItems {
        id
        salesId
        productId
        quantity
        product {
          id
          name
          price
        }
      }
    }
  }
`;
