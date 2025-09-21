"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Eye,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useQuery } from "@apollo/client";
import { DASHBOARD_METRICS } from "@/src/modules/dashboard/oprations";
import Loading from "@/src/components/layout/Loading";
import { useNotifications } from "@/src/hooks/useNotifications";

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState(7);

  const { data, loading, error } = useQuery(DASHBOARD_METRICS, {
    fetchPolicy: "cache-and-network",
    variables: { days: timeRange },
  });

  if (loading) {
    return <Loading />;
  }

  const recentOrders = data?.dashboardMetrics.recentOrders;
  // console.log("🚀 ~ AdminDashboard ~ recentOrders:", recentOrders);
  const topProducts = data?.dashboardMetrics.topProducts;
  // console.log("🚀 ~ AdminDashboard ~ topProducts:", topProducts);

  const stats = [
    {
      name: "Total Revenue",
      value: data?.dashboardMetrics?.totalRevenue.toLocaleString(),
      change: `${data?.dashboardMetrics?.revenueGrowth.toFixed(1)}%`,
      changeType:
        data?.dashboardMetrics?.revenueGrowth >= 0 ? "increase" : "decrease",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "vs last period",
    },
    {
      name: "Orders",
      value: data?.dashboardMetrics?.totalOrders.toLocaleString(),
      change: `${data?.dashboardMetrics?.ordersGrowth.toFixed(1)}%`,
      changeType:
        data?.dashboardMetrics?.ordersGrowth >= 0 ? "increase" : "decrease",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "total orders",
    },
    {
      name: "Products",
      value: data?.dashboardMetrics?.activeProducts.toLocaleString(),
      change: `${data?.dashboardMetrics?.productsGrowth.toFixed(1)}%`,
      changeType:
        data?.dashboardMetrics?.productsGrowth >= 0 ? "increase" : "decrease",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "active products",
    },
    {
      name: "Customers",
      value: data?.dashboardMetrics?.totalCustomers.toLocaleString(),
      change: `${data?.dashboardMetrics?.customersGrowth.toFixed(1)}%`,
      changeType:
        data?.dashboardMetrics?.customersGrowth >= 0 ? "increase" : "decrease",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "registered users",
    },
  ];

  const quickStats = [
    {
      label: "Pending Orders",
      value: data?.dashboardMetrics?.pendingOrders?.toLocaleString() || "0",
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      label: "Low Stock Items",
      value: data?.dashboardMetrics?.lowStockItems?.toLocaleString() || "0",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      label: "New Reviews",
      value: data?.dashboardMetrics?.newReviews?.toLocaleString() || "0",
      icon: Star,
      color: "text-blue-600",
    },
    {
      label: "Completed Today",
      value: data?.dashboardMetrics?.completedToday?.toLocaleString() || "0",
      icon: CheckCircle,
      color: "text-green-600",
    },
  ];
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  // Handle report download
  const downloadReport = async () => {
    const res = await fetch(`/api/dashboard-report?days=${timeRange}`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dashboard-report-${timeRange}-days.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  };
  return (
    <div className="space-y-8 overflow-x-hidden w-full">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Admin Panel</h1>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-cormorant font-bold text-charcoal-900">
            Welcome back, Admin!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your flower shop today.
          </p>
        </div>

        <div className="flex sm:flex-row flex-col sm:space-y-0 space-y-2 sm:items-center sm:space-x-4 mt-4 lg:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(parseInt(e.target.value))}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <Button onClick={downloadReport} variant="luxury">
            <Calendar className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="flex items-center">
                {stat.changeType === "increase" ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === "increase"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal-900 mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600">{stat.name}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {quickStats.map((stat, index) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-charcoal-900">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-charcoal-900">
                Recent Orders
              </h2>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders?.map((order: any, index: any) => (
                <motion.div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-luxury-400 to-luxury-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {order.avatar}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-charcoal-900">
                        #{order.id}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.customer.name}
                      </p>
                      <p className="text-xs text-gray-500">{order.product}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-charcoal-900">
                      {order.amount}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-100"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-charcoal-900">
              Top Products
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts?.map((product: any, index: any) => (
                <motion.div
                  key={product.name}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-luxury-100 rounded-lg flex items-center justify-center">
                      <span className="text-luxury-700 font-medium text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-charcoal-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {product.sales} sales
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-charcoal-900">
                      {product.revenue}
                    </p>
                    <div className="flex items-center">
                      {product?.growthPercent > 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                      )}
                      <span
                        className={`text-xs ${
                          product.growthPercent > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {product.growthPercent > 0 ? "+" : ""}
                        {product.growthPercent}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <h2 className="text-xl font-semibold text-charcoal-900 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 overflow-hidden md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="justify-start h-auto p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200"
          >
            <Package className="w-6 h-6 mr-4 text-blue-600" />
            <div className="text-left overflow-hidden">
              <p className="font-medium text-charcoal-900">Add New Product</p>
              <p className="text-sm text-gray-600">
                Create a new flower arrangement
              </p>
            </div>
          </Button>
          <Button
            variant="outline"
            className="justify-start h-auto p-6 bg-gradient-to-r from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-200"
          >
            <ShoppingCart className="w-6 h-6 mr-4 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-charcoal-900">Process Orders</p>
              <p className="text-sm text-gray-600">Review pending orders</p>
            </div>
          </Button>
          <Button
            variant="outline"
            className="justify-start h-auto p-6 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-200"
          >
            <TrendingUp className="w-6 h-6 mr-4 text-purple-600" />
            <div className="text-left">
              <p className="font-medium text-charcoal-900">View Analytics</p>
              <p className="text-sm text-gray-600">Check performance metrics</p>
            </div>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
