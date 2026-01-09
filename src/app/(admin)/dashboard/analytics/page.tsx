"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  Users,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Button } from "../../../../components/ui/button";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const [chartType, setChartType] = useState("revenue");

  const analyticsData = {
    revenue: {
      current: 45231,
      previous: 38945,
      change: 16.1,
      trend: "up",
    },
    orders: {
      current: 1234,
      previous: 1089,
      change: 13.3,
      trend: "up",
    },
    customers: {
      current: 2847,
      previous: 2654,
      change: 7.3,
      trend: "up",
    },
    conversion: {
      current: 3.2,
      previous: 2.8,
      change: 14.3,
      trend: "up",
    },
  };

  const topCategories = [
    { name: "Premium Roses", revenue: 18500, orders: 245, percentage: 41 },
    { name: "Luxury Chocolates", revenue: 12300, orders: 189, percentage: 27 },
    { name: "Fresh Cakes", revenue: 8900, orders: 156, percentage: 20 },
    { name: "Mixed Arrangements", revenue: 5531, orders: 98, percentage: 12 },
  ];

  const customerSegments = [
    { segment: "VIP Customers", count: 156, revenue: 28500, percentage: 63 },
    {
      segment: "Regular Customers",
      count: 892,
      revenue: 14200,
      percentage: 31,
    },
    { segment: "New Customers", count: 1799, revenue: 2531, percentage: 6 },
  ];

  const monthlyData = [
    { month: "Jan", revenue: 32000, orders: 890, customers: 2100 },
    { month: "Feb", revenue: 35000, orders: 950, customers: 2250 },
    { month: "Mar", revenue: 38000, orders: 1020, customers: 2400 },
    { month: "Apr", revenue: 42000, orders: 1150, customers: 2600 },
    { month: "May", revenue: 45231, orders: 1234, customers: 2847 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-cormorant font-bold text-foreground ">
            Business Analytics
          </h1>
          <p className="text-foreground  mt-2">
            Comprehensive insights into your business performance
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-border  rounded-lg px-4 py-2 focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="luxury">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(analyticsData).map(([key, data], index) => (
          <motion.div
            key={key}
            className="bg-background rounded-2xl p-6 shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-foreground ">
                {key === "revenue" && (
                  <DollarSign className="w-6 h-6 text-primary " />
                )}
                {key === "orders" && (
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                )}
                {key === "customers" && (
                  <Users className="w-6 h-6 text-green-600" />
                )}
                {key === "conversion" && (
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                )}
              </div>
              <div className="flex items-center">
                {data.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span
                  className={`text-sm font-medium ${
                    data.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  +{data.change}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground  mb-1">
                {key === "revenue"
                  ? `AED ${data.current.toLocaleString()}`
                  : key === "conversion"
                  ? `${data.current}%`
                  : data.current.toLocaleString()}
              </p>
              <p className="text-sm text-foreground  capitalize">
                {key.replace("_", " ")}
              </p>
              <p className="text-xs text-foreground mt-1">vs previous period</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <motion.div
          className="bg-background rounded-2xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground ">
              Revenue Trend
            </h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <PieChart className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-background rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-foreground ">Revenue chart visualization</p>
              <p className="text-sm text-gray-400">
                Chart component would be integrated here
              </p>
            </div>
          </div>
        </motion.div>

        {/* Top Categories */}
        <motion.div
          className="bg-background rounded-2xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-foreground  mb-6">
            Top Categories
          </h2>
          <div className="space-y-4">
            {topCategories.map((category, index) => (
              <div
                key={category.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-luxury-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-medium text-luxury-700">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground ">
                      {category.name}
                    </p>
                    <p className="text-sm text-foreground ">
                      {category.orders} orders
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground ">
                    AED {category.revenue.toLocaleString()}
                  </p>
                  <div className="flex items-center">
                    <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                      <div
                        className="h-2 bg-foreground 0 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-foreground ">
                      {category.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Customer Segments & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Segments */}
        <motion.div
          className="bg-background rounded-2xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-xl font-semibold text-foreground  mb-6">
            Customer Segments
          </h2>
          <div className="space-y-4">
            {customerSegments.map((segment, index) => (
              <div
                key={segment.segment}
                className="p-4 rounded-xl bg-background"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-foreground ">
                    {segment.segment}
                  </h3>
                  <span className="text-sm font-medium text-primary ">
                    {segment.percentage}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-foreground ">
                  <span>{segment.count} customers</span>
                  <span className="font-medium">
                    AED {segment.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                  <div
                    className="h-2 bg-foreground 0 rounded-full"
                    style={{ width: `${segment.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Monthly Performance */}
        <motion.div
          className="bg-background rounded-2xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h2 className="text-xl font-semibold text-foreground  mb-6">
            Monthly Performance
          </h2>
          <div className="space-y-4">
            {monthlyData.map((month, index) => (
              <div
                key={month.month}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-background"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-700">
                      {month.month}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground ">
                      AED {month.revenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-foreground ">
                      {month.orders} orders • {month.customers} customers
                    </p>
                  </div>
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Insights & Recommendations */}
      <motion.div
        className="bg-background rounded-2xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h2 className="text-xl font-semibold text-foreground  mb-6">
          Business Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-green-50 border border-green-200">
            <div className="flex items-center mb-3">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="font-medium text-green-900">Growth Opportunity</h3>
            </div>
            <p className="text-sm text-green-800">
              Premium roses category showing 41% revenue share. Consider
              expanding luxury flower collections.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <div className="flex items-center mb-3">
              <Users className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-medium text-blue-900">Customer Focus</h3>
            </div>
            <p className="text-sm text-blue-800">
              VIP customers generate 63% of revenue. Implement loyalty programs
              to retain high-value customers.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
            <div className="flex items-center mb-3">
              <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="font-medium text-purple-900">Performance</h3>
            </div>
            <p className="text-sm text-purple-800">
              Conversion rate improved by 14.3%. Continue optimizing the
              customer journey and checkout process.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
