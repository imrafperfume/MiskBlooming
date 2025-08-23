import { gql } from "@apollo/client";

// Input types for order items
export const CREATE_ORDER = gql`
mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    userId
    firstName
    lastName
    email
    phone
    address
    city
    emirate
    postalCode

    paymentMethod
    stripePaymentId
    cardLast4

    deliveryType
    deliveryDate
    deliveryTime
    specialInstructions

    totalAmount
    items {
      productId
      quantity
      price
    }
  }
}

`;


export const GET_ORDER_BY_ID = gql`
  query GetOrderById($id: String!) {
    orderById(id: $id) {
      id
      userId
      firstName
      lastName
      email
      phone
      address
      city
      emirate
      postalCode
      paymentMethod
      paymentStatus
      stripePaymentId
      cardLast4
      deliveryType
      deliveryDate
      deliveryTime
      specialInstructions
      status
      totalAmount
      createdAt
      updatedAt
      items {
        id
        productId
        quantity
        price
        product {
          id
          name
          slug
          price
        }
      }
    }
  }
`;

export const GET_ORDERS_BY_USER = gql`
  query GetOrdersByUser($userId: String!) {
    ordersByUser(userId: $userId) {
      id
      totalAmount
      status
      createdAt
      items {
        id
        productId
        quantity
        price
        product {
          id
          name
          slug
          price
        }
      }
    }
  }
`;
