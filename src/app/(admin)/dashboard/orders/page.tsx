"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Filter,
  Eye,
  MoreHorizontal,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Download,
  RefreshCw,
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "../../../../components/ui/Button"
import { Input } from "../../../../components/ui/Input"

// Mock orders data
const mockOrders = [
  {
    id: "ORD-001234",
    customer: {
      name: "Sarah Al-Mansouri",
      email: "sarah@example.com",
      phone: "+971 50 123 4567",
      avatar: "SA",
    },
    items: [
      { name: "Premium Red Rose Bouquet", quantity: 1, price: 350 },
      { name: "Luxury Chocolate Box", quantity: 1, price: 149 },
    ],
    total: 499,
    status: "delivered",
    paymentStatus: "paid",
    deliveryAddress: "Downtown Dubai, Burj Khalifa District",
    orderDate: "2024-01-15T10:30:00Z",
    deliveryDate: "2024-01-16T14:00:00Z",
    priority: "high",
  },
  {
    id: "ORD-001235",
    customer: {
      name: "Ahmed Hassan",
      email: "ahmed@example.com",
      phone: "+971 55 987 6543",
      avatar: "AH",
    },
    items: [{ name: "Mixed Seasonal Arrangement", quantity: 2, price: 199 }],
    total: 398,
    status: "processing",
    paymentStatus: "paid",
    deliveryAddress: "Jumeirah Beach Road, Dubai Marina",
    orderDate: "2024-01-14T15:45:00Z",
    deliveryDate: "2024-01-17T11:00:00Z",
    priority: "medium",
  },
  {
    id: "ORD-001236",
    customer: {
      name: "Emma Johnson",
      email: "emma@example.com",
      phone: "+971 52 456 7890",
      avatar: "EJ",
    },
    items: [{ name: "Birthday Celebration Package", quantity: 1, price: 599 }],
    total: 599,
    status: "shipped",
    paymentStatus: "paid",
    deliveryAddress: "Business Bay, Executive Tower",
    orderDate: "2024-01-13T09:15:00Z",
    deliveryDate: "2024-01-15T16:30:00Z",
    priority: "high",
  },
  {
    id: "ORD-001237",
    customer: {
      name: "Omar Khalil",
      email: "omar@example.com",
      phone: "+971 56 234 5678",
      avatar: "OK",
    },
    items: [{ name: "Sympathy Wreath", quantity: 1, price: 399 }],
    total: 399,
    status: "pending",
    paymentStatus: "pending",
    deliveryAddress: "Palm Jumeirah, Atlantis Resort",
    orderDate: "2024-01-12T13:20:00Z",
    deliveryDate: "2024-01-18T10:00:00Z",
    priority: "low",
  },
]

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [dateRange, setDateRange] = useState("7d")

  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || order.status === statusFilter
      const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter
      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [searchTerm, statusFilter, priorityFilter])

  const stats = useMemo(() => {
    return {
      total: mockOrders.length,
      pending: mockOrders.filter((o) => o.status === "pending").length,
      processing: mockOrders.filter((o) => o.status === "processing").length,
      shipped: mockOrders.filter((o) => o.status === "shipped").length,
      delivered: mockOrders.filter((o) => o.status === "delivered").length,
      totalRevenue: mockOrders.reduce((sum, o) => sum + o.total, 0),
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "processing":
        return <Package className="w-4 h-4" />
      case "shipped":
        return <Truck className="w-4 h-4" />
      case "delivered":
        return <CheckCircle className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-cormorant font-bold text-charcoal-900">Order Management</h1>
          <p className="text-gray-600 mt-2">Track and manage customer orders</p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap sm:items-center gap-4 sm:gap-0 sm:space-x-4 mt-4 lg:mt-0">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="luxury">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Delivery
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <motion.div
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-xl font-bold text-charcoal-900">{stats.total}</p>
            </div>
            <Package className="w-6 h-6 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="w-6 h-6 text-yellow-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-xl font-bold text-blue-600">{stats.processing}</p>
            </div>
            <Package className="w-6 h-6 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Shipped</p>
              <p className="text-xl font-bold text-purple-600">{stats.shipped}</p>
            </div>
            <Truck className="w-6 h-6 text-purple-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-xl font-bold text-green-600">{stats.delivered}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-xl font-bold text-luxury-600">AED {stats.totalRevenue.toLocaleString()}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-luxury-500" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search orders, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
          >
            <option value="all">All Priority</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </motion.div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order, index) => (
          <motion.div
            key={order.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex flex-wrap sm:flex-nowrap sm:gap-0 gap-3 items-center justify-between mb-4">
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-0 sm:space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-luxury-400 to-luxury-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">{order.customer.avatar}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal-900">#{order.id}</h3>
                  <p className="text-sm text-gray-600">{order.customer.name}</p>
                </div>
                <div className="sm:flex gap-3 items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}
                  >
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status}</span>
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(order.priority)}`}
                  >
                    {order.priority} priority
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Customer Info */}
              <div>
                <h4 className="font-medium text-charcoal-900 mb-3">Customer Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {order.customer.email}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {order.customer.phone}
                  </div>
                  <div className="flex items-start text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{order.deliveryAddress}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-medium text-charcoal-900 mb-3">Order Items</h4>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-medium">AED {item.price}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-luxury-600">AED {order.total}</span>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div>
                <h4 className="font-medium text-charcoal-900 mb-3">Order Timeline</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <div>
                      <p className="font-medium">Order Date</p>
                      <p>{new Date(order.orderDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Truck className="w-4 h-4 mr-2" />
                    <div>
                      <p className="font-medium">Delivery Date</p>
                      <p>{new Date(order.deliveryDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        order.paymentStatus === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      Payment {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-charcoal-900 mb-2">No orders found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredOrders.length} of {mockOrders.length} orders
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="bg-luxury-500 text-white">
              1
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
