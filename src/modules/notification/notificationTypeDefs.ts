import { gql } from "@apollo/client";

export const notificationTypeDefs = gql`
  type Notification {
    id: ID!
    type: String!
    message: String!
    orderId: String
    read: Boolean!
    createdAt: String!
  }

  type NotificationResponse {
    items: [Notification!]!
    unreadCount: Int!
  }

  extend type Query {
    getNotifications(limit: Int): NotificationResponse!
  }

  extend type Mutation {
    markNotificationAsRead(id: ID!): Notification!
    markAllNotificationsAsRead: Boolean!
  }
`;
