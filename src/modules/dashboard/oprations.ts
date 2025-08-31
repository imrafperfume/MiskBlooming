import { gql } from "@apollo/client";

export const DASHBOARD_METRICS = gql`
  query GetDashboard {
    dashboardMetrics {
      totalRevenue
      revenueGrowth
      totalOrders
      ordersGrowth
      activeProducts
      productsGrowth
      totalCustomers
      customersGrowth
      pendingOrders
      lowStockItems
      newReviews
      completedToday
      recentOrders {
        id
        orderNumber
        total
        status
        createdAt
        customer {
          id
          name
        }
        items {
          quantity
          product {
            id
            name
            price
          }
        }
      }
      topProducts {
        id
        name
        sales
        revenue
        growthPercent
      }
    }
  }
`;
