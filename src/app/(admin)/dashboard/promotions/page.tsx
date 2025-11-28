"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Trash2,
  Tag,
  Percent,
  Gift,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";

// Mock promotions data
const mockPromotions = [
  {
    id: "1",
    name: "Valentine's Day Special",
    description: "20% off on all premium rose bouquets",
    type: "percentage",
    value: 20,
    code: "VALENTINE20",
    startDate: "2024-02-01",
    endDate: "2024-02-14",
    status: "active",
    usageLimit: 500,
    usageCount: 234,
    minOrderValue: 200,
    categories: ["roses", "premium-bouquets"],
    revenue: 15680,
  },
  {
    id: "2",
    name: "Mother's Day Bundle",
    description: "Buy 2 get 1 free on chocolate collections",
    type: "buy_x_get_y",
    value: 1,
    code: "MOTHERSDAY",
    startDate: "2024-03-15",
    endDate: "2024-03-31",
    status: "scheduled",
    usageLimit: 200,
    usageCount: 0,
    minOrderValue: 150,
    categories: ["chocolates"],
    revenue: 0,
  },
  {
    id: "3",
    name: "First Order Discount",
    description: "AED 50 off for new customers",
    type: "fixed",
    value: 50,
    code: "WELCOME50",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "active",
    usageLimit: 1000,
    usageCount: 456,
    minOrderValue: 100,
    categories: ["all"],
    revenue: 22800,
  },
  {
    id: "4",
    name: "Summer Flash Sale",
    description: "30% off on seasonal arrangements",
    type: "percentage",
    value: 30,
    code: "SUMMER30",
    startDate: "2024-06-01",
    endDate: "2024-06-15",
    status: "expired",
    usageLimit: 300,
    usageCount: 287,
    minOrderValue: 180,
    categories: ["seasonal", "mixed-arrangements"],
    revenue: 18450,
  },
];

export default function PromotionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredPromotions = useMemo(() => {
    return mockPromotions.filter((promotion) => {
      const matchesSearch =
        promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promotion.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promotion.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || promotion.status === statusFilter;
      const matchesType = typeFilter === "all" || promotion.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchTerm, statusFilter, typeFilter]);

  const stats = useMemo(() => {
    return {
      total: mockPromotions.length,
      active: mockPromotions.filter((p) => p.status === "active").length,
      scheduled: mockPromotions.filter((p) => p.status === "scheduled").length,
      expired: mockPromotions.filter((p) => p.status === "expired").length,
      totalRevenue: mockPromotions.reduce((sum, p) => sum + p.revenue, 0),
      totalUsage: mockPromotions.reduce((sum, p) => sum + p.usageCount, 0),
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "expired":
        return "bg-background  text-gray-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-background  text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "scheduled":
        return <Clock className="w-4 h-4" />;
      case "expired":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "percentage":
        return <Percent className="w-4 h-4" />;
      case "fixed":
        return <Tag className="w-4 h-4" />;
      case "buy_x_get_y":
        return <Gift className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  const formatPromotionValue = (type: string, value: number) => {
    switch (type) {
      case "percentage":
        return `${value}% off`;
      case "fixed":
        return `AED ${value} off`;
      case "buy_x_get_y":
        return `Buy 2 get ${value} free`;
      default:
        return `${value}`;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-cormorant font-bold text-foreground ">
            Promotions & Offers
          </h1>
          <p className="text-foreground  mt-2">
            Create and manage discount campaigns
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <Button variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button variant="luxury">
            <Plus className="w-4 h-4 mr-2" />
            Create Promotion
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <motion.div
          className="bg-background rounded-xl p-4 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground ">Total Promotions</p>
              <p className="text-xl font-bold text-foreground ">
                {stats.total}
              </p>
            </div>
            <Tag className="w-6 h-6 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-background rounded-xl p-4 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground ">Active</p>
              <p className="text-xl font-bold text-green-600">{stats.active}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-background rounded-xl p-4 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground ">Scheduled</p>
              <p className="text-xl font-bold text-blue-600">
                {stats.scheduled}
              </p>
            </div>
            <Clock className="w-6 h-6 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-background rounded-xl p-4 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground ">Expired</p>
              <p className="text-xl font-bold text-foreground ">
                {stats.expired}
              </p>
            </div>
            <XCircle className="w-6 h-6 text-foreground " />
          </div>
        </motion.div>

        <motion.div
          className="bg-background rounded-xl p-4 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground ">Total Usage</p>
              <p className="text-xl font-bold text-purple-600">
                {stats.totalUsage}
              </p>
            </div>
            <Users className="w-6 h-6 text-purple-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-background rounded-xl p-4 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground ">Revenue Impact</p>
              <p className="text-xl font-bold text-primary ">
                AED {stats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-6 h-6 text-primary " />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        className="bg-background rounded-xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search promotions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-border  rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="scheduled">Scheduled</option>
            <option value="expired">Expired</option>
            <option value="paused">Paused</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 border border-border  rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
            <option value="buy_x_get_y">Buy X Get Y</option>
          </select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </motion.div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPromotions.map((promotion, index) => (
          <motion.div
            key={promotion.id}
            className="bg-background rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-foreground ">
                  {getTypeIcon(promotion.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground ">
                    {promotion.name}
                  </h3>
                  <p className="text-sm text-foreground  mt-1">
                    {promotion.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    promotion.status
                  )}`}
                >
                  {getStatusIcon(promotion.status)}
                  <span className="ml-1 capitalize">{promotion.status}</span>
                </span>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground ">Discount:</span>
                <span className="font-medium text-primary ">
                  {formatPromotionValue(promotion.type, promotion.value)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground ">Code:</span>
                <span className="font-mono text-sm bg-background  px-2 py-1 rounded">
                  {promotion.code}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground ">Valid Period:</span>
                <span className="text-sm font-medium">
                  {new Date(promotion.startDate).toLocaleDateString()} -{" "}
                  {new Date(promotion.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground ">Min Order:</span>
                <span className="text-sm font-medium">
                  AED {promotion.minOrderValue}
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground ">Usage:</span>
                <span className="text-sm font-medium">
                  {promotion.usageCount} / {promotion.usageLimit}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-foreground 0 rounded-full"
                  style={{
                    width: `${
                      (promotion.usageCount / promotion.usageLimit) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground ">
                  Revenue Impact:
                </span>
                <span className="text-sm font-medium text-green-600">
                  AED {promotion.revenue.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
              <Button variant="ghost" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPromotions.length === 0 && (
        <div className="text-center py-12">
          <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground  mb-2">
            No promotions found
          </h3>
          <p className="text-foreground ">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
