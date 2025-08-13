"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Filter,
  Star,
  MessageSquare,
  ThumbsUp,
  Eye,
  Reply,
  Flag,
  TrendingUp,
  Calendar,
  MoreHorizontal,
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "../../../../components/ui/Button"
import { Input } from "../../../../components/ui/Input"

// Mock reviews data
const mockReviews = [
  {
    id: "1",
    customer: {
      name: "Sarah Al-Mansouri",
      email: "sarah@example.com",
      avatar: "SA",
      verified: true,
    },
    product: {
      name: "Premium Red Rose Bouquet",
      id: "MB-ROSE-001",
    },
    rating: 5,
    title: "Absolutely stunning arrangement!",
    content:
      "The roses were fresh and beautifully arranged. Delivery was on time and the presentation was perfect. Will definitely order again!",
    date: "2024-01-15T10:30:00Z",
    status: "published",
    helpful: 12,
    reported: 0,
    response: null,
    images: 2,
  },
  {
    id: "2",
    customer: {
      name: "Ahmed Hassan",
      email: "ahmed@example.com",
      avatar: "AH",
      verified: true,
    },
    product: {
      name: "Luxury Belgian Chocolates",
      id: "MB-CHOC-002",
    },
    rating: 4,
    title: "Great quality chocolates",
    content:
      "The chocolates were delicious and well-packaged. Only minor issue was the delivery was slightly delayed, but customer service was very responsive.",
    date: "2024-01-14T15:45:00Z",
    status: "published",
    helpful: 8,
    reported: 0,
    response: {
      content: "Thank you for your feedback! We apologize for the delay and have improved our delivery process.",
      date: "2024-01-15T09:00:00Z",
    },
    images: 1,
  },
  {
    id: "3",
    customer: {
      name: "Emma Johnson",
      email: "emma@example.com",
      avatar: "EJ",
      verified: false,
    },
    product: {
      name: "Birthday Celebration Package",
      id: "MB-CAKE-003",
    },
    rating: 2,
    title: "Disappointing experience",
    content:
      "The cake arrived damaged and the flowers were wilted. Very disappointed with the quality for the price paid.",
    date: "2024-01-13T09:15:00Z",
    status: "pending",
    helpful: 3,
    reported: 1,
    response: null,
    images: 3,
  },
  {
    id: "4",
    customer: {
      name: "Omar Khalil",
      email: "omar@example.com",
      avatar: "OK",
      verified: true,
    },
    product: {
      name: "Mixed Seasonal Arrangement",
      id: "MB-MIX-004",
    },
    rating: 5,
    title: "Perfect for the occasion",
    content:
      "Beautiful arrangement that perfectly matched what I was looking for. The team was helpful in customizing the colors to match our event theme.",
    date: "2024-01-12T13:20:00Z",
    status: "published",
    helpful: 15,
    reported: 0,
    response: {
      content: "We're so happy you loved the arrangement! Thank you for choosing MiskBlooming for your special event.",
      date: "2024-01-13T10:00:00Z",
    },
    images: 0,
  },
]

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  const filteredReviews = useMemo(() => {
    return mockReviews.filter((review) => {
      const matchesSearch =
        review.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRating = ratingFilter === "all" || review.rating.toString() === ratingFilter
      const matchesStatus = statusFilter === "all" || review.status === statusFilter
      return matchesSearch && matchesRating && matchesStatus
    })
  }, [searchTerm, ratingFilter, statusFilter])

  const stats = useMemo(() => {
    const totalReviews = mockReviews.length
    const averageRating = mockReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    const ratingDistribution = {
      5: mockReviews.filter((r) => r.rating === 5).length,
      4: mockReviews.filter((r) => r.rating === 4).length,
      3: mockReviews.filter((r) => r.rating === 3).length,
      2: mockReviews.filter((r) => r.rating === 2).length,
      1: mockReviews.filter((r) => r.rating === 1).length,
    }
    return {
      total: totalReviews,
      average: averageRating,
      distribution: ratingDistribution,
      pending: mockReviews.filter((r) => r.status === "pending").length,
      published: mockReviews.filter((r) => r.status === "published").length,
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-cormorant font-bold text-charcoal-900">Customer Reviews</h1>
          <p className="text-gray-600 mt-2">Manage customer feedback and testimonials</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <Button variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button variant="luxury">
            <MessageSquare className="w-4 h-4 mr-2" />
            Respond to Reviews
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-charcoal-900">{stats.total}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-charcoal-900 mr-2">{stats.average.toFixed(1)}</p>
                <div className="flex">{renderStars(Math.round(stats.average))}</div>
              </div>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Reviews</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold text-green-600">{stats.published}</p>
            </div>
            <ThumbsUp className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>
      </div>

      {/* Rating Distribution */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-lg font-semibold text-charcoal-900 mb-4">Rating Distribution</h2>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 w-16">
                <span className="text-sm font-medium">{rating}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
              </div>
              <div className="flex-1 h-3 bg-gray-200 rounded-full">
                <div
                  className="h-3 bg-luxury-500 rounded-full"
                  style={{
                    width: `${(stats.distribution[rating as keyof typeof stats.distribution] / stats.total) * 100}%`,
                  }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 w-12">
                {stats.distribution[rating as keyof typeof stats.distribution]}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search reviews, customers, products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </motion.div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.map((review, index) => (
          <motion.div
            key={review.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-luxury-400 to-luxury-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">{review.customer.avatar}</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-charcoal-900">{review.customer.name}</h3>
                    {review.customer.verified && (
                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{review.product.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(review.status)}`}
                >
                  {review.status}
                </span>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-charcoal-900 mb-2">{review.title}</h4>
              <p className="text-gray-700 leading-relaxed">{review.content}</p>
              {review.images > 0 && (
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Eye className="w-4 h-4 mr-1" />
                  {review.images} image{review.images > 1 ? "s" : ""} attached
                </div>
              )}
            </div>

            {review.response && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-luxury-500 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-xs font-medium">MB</span>
                  </div>
                  <span className="font-medium text-charcoal-900">MiskBlooming Response</span>
                  <span className="text-sm text-gray-500 ml-2">
                    {new Date(review.response.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.response.content}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{review.helpful} helpful</span>
                </div>
                {review.reported > 0 && (
                  <div className="flex items-center space-x-1 text-sm text-red-600">
                    <Flag className="w-4 h-4" />
                    <span>{review.reported} reported</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {!review.response && (
                  <Button variant="outline" size="sm">
                    <Reply className="w-4 h-4 mr-2" />
                    Respond
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-charcoal-900 mb-2">No reviews found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}
