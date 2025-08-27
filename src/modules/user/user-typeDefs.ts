import { gql } from "@apollo/client";

export const UserTypeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String!
    createdAt: String!
    stats: UserStats!
    lastOrder: Order
    status: String!
  }

  type UserStats {
    totalOrders: Int!
    totalSpent: Float!
  }

  type Order {
    id: ID!
    totalAmount: Float!
    createdAt: String!
    status: OrderStatus!
  }

  enum OrderStatus {
    PENDING
    SHIPPED
    DELIVERED
    CANCELLED
  }
  type Query {
    userById(id: ID!): User
    users: [User!]!
  }
`;
