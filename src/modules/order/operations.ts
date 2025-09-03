import { gql } from "@apollo/client";

// Input types for order items
export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
    }
  }
`;
export const GET_ORDER_BY_ID = gql`
  query getOrderById($id: ID!) {
    orderById(id: $id) {
      id
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
      cardLast4
      deliveryType
      deliveryDate
      deliveryTime
      specialInstructions
      status
      totalAmount
      createdAt
      items {
        id
        quantity
        price
        product {
          name
        }
      }
    }
  }
`;
// export const GET_ORDER_BY_ID = gql`
//   query GetOrderById($id: ID!) {
//     orderById(id: $id) {
//       id
//       userId
//       firstName
//       lastName
//       email
//       phone
//       address
//       city
//       emirate
//       postalCode
//       paymentMethod
//       paymentStatus
//       stripePaymentId
//       cardLast4
//       deliveryType
//       deliveryDate
//       deliveryTime
//       specialInstructions
//       status
//       totalAmount
//       createdAt
//       updatedAt
//       items {
//         id
//         quantity
//         price
//         product {
//           name
//         }
//       }
//     }
//   }
// `;

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

//  userId
//     firstName
//     lastName
//     email
//     phone
//     address
//     city
//     emirate
//     postalCode

//     paymentMethod
//     stripePaymentId
//     cardLast4

//     deliveryType
//     deliveryDate
//     deliveryTime
//     specialInstructions

//     totalAmount
//     items {
//       productId
//       quantity
//       price
//     }
