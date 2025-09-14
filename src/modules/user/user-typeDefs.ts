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
    role: Role!
    address: String
    emailVerified: Boolean!
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
  enum Role {
    USER
    ADMIN
    GUEST
  }
  type Query {
    userById(id: ID!): User
    users: [User!]!
    adminUsers: [User!]!
  }
  type Mutation {
    updateUser(
      id: ID!
      firstName: String
      lastName: String
      email: String
      phoneNumber: String
      address: String
    ): User
    updateUserRole(id: ID!, role: Role!): User
    deleteUser(id: ID!): Boolean
  }
`;
