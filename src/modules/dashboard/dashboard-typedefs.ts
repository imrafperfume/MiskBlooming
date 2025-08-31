import { gql } from "@apollo/client";

export const dashboardTypeDefs = gql`
  type Query {
    dashboardMetrics: DashboardMetrics
  }

  type DashboardMetrics {
    totalRevenue: Float
    revenueGrowth: Float
    totalOrders: Int
    ordersGrowth: Float
    activeProducts: Int
    productsGrowth: Float
    totalCustomers: Int
    customersGrowth: Float
    pendingOrders: Int
    lowStockItems: Int
    newReviews: Int
    completedToday: Int
    recentOrders: [DashboardOrder]
    topProducts: [TopProduct]
  }

  type TopProduct {
    id: ID!
    name: String!
    sales: Int!
    revenue: Float!
    growthPercent: Float!
  }

  type DashboardOrder {
    id: ID!
    orderNumber: String!
    customer: DashboardCustomer!
    total: Float!
    status: String!
    createdAt: String!
    items: [DashboardOrderItem!]!
  }

  type DashboardCustomer {
    id: ID!
    name: String!
  }

  type DashboardOrderItem {
    product: DashboardProduct!
    quantity: Int!
  }

  type DashboardProduct {
    id: ID!
    name: String!
    price: Float!
  }
`;
