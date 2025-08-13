"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  MapPin,
  Star,
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  Calendar,
  MoreHorizontal,
  MessageSquare,
  Gift,
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "../../../../components/ui/Button"
import { Input } from "../../../../components/ui/Input"

// Mock customers data
const mockCustomers = [
  {
    id: "1",
    name: "Sarah Al-Mansouri",
    email: "sarah.almansouri@email.com",
    phone: "+971 50 123 4567",
    location: "Dubai Marina",
    joinDate: "2023-08-15",
    totalOrders: 12,
    totalSpent: 4250,
    averageOrderValue: 354,
    lastOrder: "2024-01-15",
    status: "vip",
    avatar: "SA",
    loyaltyPoints: 850,
    preferredCategory: "Premium Roses",
  },
  {
    id: "2",
    name: "Ahmed Hassan",
    email: "ahmed.hassan@email.com",
    phone: "+971 55 987 6543",
    location: "Business Bay",
    joinDate: "2023-11-22",
    totalOrders: 8,
    totalSpent: 2840,
    averageOrderValue: 355,
    lastOrder: "2024-01-14",
    status: "regular",
    avatar: "AH",
    loyaltyPoints: 420,
    preferredCategory: "Mixed Arrangements",
  },
  {
    id: "3",
    name: "Emma Johnson",
    email: "emma.johnson@email.com",
    phone: "+971 52 456 7890",
    location: "JBR",
    joinDate: "2023-06-10",
    totalOrders: 15,
    totalSpent: 5680,
    averageOrderValue: 379,
    lastOrder: "2024-01-13",
    status: "vip",
    avatar: "EJ",
    loyaltyPoints: 1120,
    preferredCategory: "Luxury Chocolates",
  },
  {
    id: "4",
    name: "Fatima Al-Zahra",
    email: "fatima.alzahra@email.com",
    phone: "+971 56 234 5678",
    location: "Downtown Dubai",
    joinDate: "2024-01-05",
    totalOrders: 2,
    totalSpent: 620,
    averageOrderValue: 310,
    lastOrder: "2024-01-12",
    status: "new",
    avatar: "FA",
    loyaltyPoints: 62,
    preferredCategory: "Indoor Plants",
  },
]

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  const filteredCustomers = useMemo(() => {
    return mockCustomers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || customer.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [searchTerm, statusFilter])

  const stats = useMemo(() => {
    return {
      total: mockCustomers.length,
      vip: mockCustomers.filter((c) => c.status === "vip").length,
      regular: mockCustomers.filter((c) => c.status === "regular").length,
      new: mockCustomers.filter((c) => c.status === "new").length,
      averageOrderValue: Math.round(
        mockCustomers.reduce((sum, c) => sum + c.averageOrderValue, 0) / mockCustomers.length,
      ),
      totalRevenue: mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0),
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vip":
        return "bg-purple-100 text-purple-800"
      case "regular":
        return "bg-blue-100 text-blue-800"
      case "new":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "vip":
        return <Star className="w-4 h-4" />
      case "regular":
        return <ShoppingBag className="w-4 h-4" />
      case "new":
        return <TrendingUp className="w-4 h-4" />
      default:
        return <Users className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-cormorant font-bold text-charcoal-900">Customer Management</h1>
          <p className="text-gray-600 mt-2">Manage customer relationships and insights</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <Button variant="outline">
            <MessageSquare className="w-4 h-4 mr-2" />
            Send Newsletter
          </Button>
          <Button variant="luxury">
            <Gift className="w-4 h-4 mr-2" />
            Create Campaign
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
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-xl font-bold text-charcoal-900">{stats.total}</p>
            </div>
            <Users className="w-6 h-6 text-blue-500" />
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
              <p className="text-sm text-gray-600">VIP Customers</p>
              <p className="text-xl font-bold text-purple-600">{stats.vip}</p>
            </div>
            <Star className="w-6 h-6 text-purple-500" />
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
              <p className="text-sm text-gray-600">Regular</p>
              <p className="text-xl font-bold text-blue-600">{stats.regular}</p>
            </div>
            <ShoppingBag className="w-6 h-6 text-blue-500" />
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
              <p className="text-sm text-gray-600">New This Month</p>
              <p className="text-xl font-bold text-green-600">{stats.new}</p>
            </div>
            <TrendingUp className="w-6 h-6 text-green-500" />
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
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <p className="text-xl font-bold text-luxury-600">AED {stats.averageOrderValue}</p>
            </div>
            <DollarSign className="w-6 h-6 text-luxury-500" />
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
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-xl font-bold text-green-600">AED {stats.totalRevenue.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-6 h-6 text-green-500" />
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
                placeholder="Search customers..."
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
            <option value="all">All Customers</option>
            <option value="vip">VIP Customers</option>
            <option value="regular">Regular Customers</option>
            <option value="new">New Customers</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
          >
            <option value="name">Sort by Name</option>
            <option value="totalSpent">Sort by Total Spent</option>
            <option value="totalOrders">Sort by Orders</option>
            <option value="joinDate">Sort by Join Date</option>
          </select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </motion.div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCustomers.map((customer, index) => (
          <motion.div
            key={customer.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-luxury-400 to-luxury-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">{customer.avatar}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal-900">{customer.name}</h3>
                  <p className="text-sm text-gray-600">{customer.email}</p>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}
              >
                {getStatusIcon(customer.status)}
                <span className="ml-1 capitalize">{customer.status}</span>
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {customer.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {customer.location}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                Joined {new Date(customer.joinDate).toLocaleDateString()}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-charcoal-900">{customer.totalOrders}</p>
                <p className="text-xs text-gray-600">Total Orders</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-luxury-600">AED {customer.totalSpent.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Total Spent</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg Order Value:</span>
                <span className="font-medium">AED {customer.averageOrderValue}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Loyalty Points:</span>
                <span className="font-medium text-luxury-600">{customer.loyaltyPoints} pts</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Preferred Category:</span>
                <span className="font-medium">{customer.preferredCategory}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Order:</span>
                <span className="font-medium">{new Date(customer.lastOrder).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Eye className="w-4 h-4 mr-2" />
                View Profile
              </Button>
              <Button variant="ghost" size="sm">
                <Mail className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-charcoal-900 mb-2">No customers found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Pagination */}
      {filteredCustomers.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredCustomers.length} of {mockCustomers.length} customers
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
