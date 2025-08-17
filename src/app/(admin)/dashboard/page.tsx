"use client"

import { useState } from "react"
import { motion } from "framer-motion"
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
} from "lucide-react"
import { Button } from "../../../components/ui/Button"

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("7d")

  const stats = [
    {
      name: "Total Revenue",
      value: "AED 45,231",
      change: "+12.5%",
      changeType: "increase" as const,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "vs last period",
    },
    {
      name: "Orders",
      value: "1,234",
      change: "+8.2%",
      changeType: "increase" as const,
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "total orders",
    },
    {
      name: "Products",
      value: "156",
      change: "+2.1%",
      changeType: "increase" as const,
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "active products",
    },
    {
      name: "Customers",
      value: "2,847",
      change: "-1.2%",
      changeType: "decrease" as const,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "registered users",
    },
  ]

  const recentOrders = [
    {
      id: "MBF001234",
      customer: "Sarah Al-Mansouri",
      product: "Premium Red Rose Bouquet",
      amount: "AED 350",
      status: "delivered",
      date: "2024-01-15",
      avatar: "SA",
    },
    {
      id: "MBF001235",
      customer: "Ahmed Hassan",
      product: "Chocolate Birthday Cake",
      amount: "AED 280",
      status: "processing",
      date: "2024-01-15",
      avatar: "AH",
    },
    {
      id: "MBF001236",
      customer: "Emma Johnson",
      product: "Luxury Gift Hamper",
      amount: "AED 650",
      status: "shipped",
      date: "2024-01-14",
      avatar: "EJ",
    },
    {
      id: "MBF001237",
      customer: "Fatima Al-Zahra",
      product: "Indoor Plant Trio",
      amount: "AED 320",
      status: "pending",
      date: "2024-01-14",
      avatar: "FA",
    },
  ]

  const topProducts = [
    {
      name: "Premium Red Rose Bouquet",
      sales: 89,
      revenue: "AED 31,150",
      image: "/placeholder.svg?height=40&width=40&text=Rose",
      growth: 12.5,
    },
    {
      name: "Luxury Belgian Chocolates",
      sales: 67,
      revenue: "AED 12,060",
      image: "/placeholder.svg?height=40&width=40&text=Choc",
      growth: 8.3,
    },
    {
      name: "Chocolate Birthday Cake",
      sales: 45,
      revenue: "AED 12,600",
      image: "/placeholder.svg?height=40&width=40&text=Cake",
      growth: -2.1,
    },
    {
      name: "Seasonal Mixed Arrangement",
      sales: 38,
      revenue: "AED 8,360",
      image: "/placeholder.svg?height=40&width=40&text=Mix",
      growth: 15.7,
    },
  ]

  const quickStats = [
    { label: "Pending Orders", value: "23", icon: Clock, color: "text-yellow-600" },
    { label: "Low Stock Items", value: "8", icon: AlertTriangle, color: "text-red-600" },
    { label: "New Reviews", value: "12", icon: Star, color: "text-blue-600" },
    { label: "Completed Today", value: "45", icon: CheckCircle, color: "text-green-600" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-8 overflow-x-hidden w-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-cormorant font-bold text-charcoal-900">Welcome back, Admin!</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your flower shop today.</p>
        </div>

        <div className="flex sm:flex-row flex-col sm:space-y-0 space-y-2 sm:items-center sm:space-x-4 mt-4 lg:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button variant="luxury">
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
                    stat.changeType === "increase" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal-900 mb-1">{stat.value}</p>
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
          <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-charcoal-900">{stat.value}</p>
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
              <h2 className="text-xl font-semibold text-charcoal-900">Recent Orders</h2>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-luxury-400 to-luxury-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">{order.avatar}</span>
                    </div>
                    <div>
                      <p className="font-medium text-charcoal-900">#{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                      <p className="text-xs text-gray-500">{order.product}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-charcoal-900">{order.amount}</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}
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
            <h2 className="text-xl font-semibold text-charcoal-900">Top Products</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <motion.div
                  key={product.name}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-luxury-100 rounded-lg flex items-center justify-center">
                      <span className="text-luxury-700 font-medium text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-charcoal-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-charcoal-900">{product.revenue}</p>
                    <div className="flex items-center">
                      {product.growth > 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                      )}
                      <span className={`text-xs ${product.growth > 0 ? "text-green-600" : "text-red-600"}`}>
                        {product.growth > 0 ? "+" : ""}
                        {product.growth}%
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
        <h2 className="text-xl font-semibold text-charcoal-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 overflow-hidden md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="justify-start h-auto p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200"
          >
            <Package className="w-6 h-6 mr-4 text-blue-600" />
            <div className="text-left overflow-hidden">
              <p className="font-medium text-charcoal-900">Add New Product</p>
              <p className="text-sm text-gray-600">Create a new flower arrangement</p>
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
  )
}
