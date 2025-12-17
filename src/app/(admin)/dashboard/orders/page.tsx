"use client";

import { useState, useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import { Button } from "../../../../components/ui/Button";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  RefreshCw,
  Download,
  Search,
  Filter,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { formatTimestamp } from "@/src/lib/utils";

// --- GraphQL Queries ---
const ORDER_STATS = gql`
  query getOrderStats {
    orderStats {
      totalOrders
      pending
      processing
      delivered
      shipped
      cancelled
    }
  }
`;

const GET_ORDERS = gql`
  query getOrders {
    allOrders {
      id
      firstName
      lastName
      totalAmount
      status
      createdAt
      deliveryDate
    }
  }
`;

// --- Types ---
interface Order {
  id: string;
  firstName: string;
  lastName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  deliveryDate: string;
}

// --- Components ---

// 1. Status Badge Component for consistent styling
const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    PENDING: {
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-500/10",
      icon: Clock,
    },
    PROCESSING: {
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
      icon: Package,
    },
    SHIPPED: {
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10",
      icon: Truck,
    },
    DELIVERED: {
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-500/10",
      icon: CheckCircle,
    },
    CANCELLED: {
      color: "text-destructive",
      bg: "bg-destructive/10",
      icon: XCircle,
    },
    DEFAULT: {
      color: "text-muted-foreground",
      bg: "bg-muted",
      icon: AlertCircle,
    },
  };

  const config = styles[status as keyof typeof styles] || styles.DEFAULT;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-transparent ${config.bg} ${config.color}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
};

// 2. Main Page Component
export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Data Fetching
  const {
    data: ordersData,
    loading: ordersLoading,
    refetch: refetchOrders,
  } = useQuery(GET_ORDERS, { notifyOnNetworkStatusChange: true });

  const {
    data: statsData,
    loading: statsLoading,
    refetch: refetchStats,
  } = useQuery(ORDER_STATS, { notifyOnNetworkStatusChange: true });

  const orderStats = statsData?.orderStats;

  // Handlers
  const handleRefresh = async () => {
    await Promise.all([refetchOrders(), refetchStats()]);
  };

  // Filter Logic
  const filteredOrders = useMemo(() => {
    if (!ordersData?.allOrders) return [];

    return ordersData.allOrders
      .filter((order: Order) => {
        const fullName = `${order.firstName} ${order.lastName}`.toLowerCase();
        const searchLower = searchTerm.toLowerCase();

        const matchesSearch =
          order.id.toLowerCase().includes(searchLower) ||
          fullName.includes(searchLower);

        const matchesStatus =
          statusFilter === "all" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a: Order, b: Order) => Number(b.createdAt) - Number(a.createdAt));
  }, [ordersData, searchTerm, statusFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const isLoading = ordersLoading || statsLoading;

  return (
    <div className="space-y-8 p-1">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-cormorant font-bold text-foreground tracking-tight">
            Order Management
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitor status, track shipments, and manage returns.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="bg-background hover:bg-muted border-border"
            disabled={isLoading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            variant="outline"
            className="bg-background hover:bg-muted border-border"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          {
            label: "Total Orders",
            value: orderStats?.totalOrders,
            color: "text-foreground",
            bg: "bg-card",
          },
          {
            label: "Pending",
            value: orderStats?.pending,
            color: "text-orange-600",
            bg: "bg-orange-500/5",
          },
          {
            label: "Processing",
            value: orderStats?.processing,
            color: "text-blue-600",
            bg: "bg-blue-500/5",
          },
          {
            label: "Shipped",
            value: orderStats?.shipped,
            color: "text-purple-600",
            bg: "bg-purple-500/5",
          },
          {
            label: "Delivered",
            value: orderStats?.delivered,
            color: "text-green-600",
            bg: "bg-green-500/5",
          },
          {
            label: "Cancelled",
            value: orderStats?.cancelled,
            color: "text-destructive",
            bg: "bg-destructive/5",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`rounded-xl p-5 border border-border shadow-sm transition-all hover:shadow-md ${
              stat.bg || "bg-card"
            }`}
          >
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              {stat.label}
            </p>
            {statsLoading ? (
              <div className="h-7 w-12 bg-muted/50 rounded animate-pulse" />
            ) : (
              <p className={`text-2xl font-bold ${stat.color}`}>
                {stat.value ?? 0}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Filters & Controls */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by Order ID or Customer Name..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/70"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative min-w-[180px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-8 py-2 bg-background border border-border rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer text-foreground"
          >
            <option value="all">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                {[
                  "Order ID",
                  "Customer",
                  "Status",
                  "Total",
                  "Ordered Date",
                  "Delivery Date",
                  "Action",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {ordersLoading ? (
                // Loading Skeleton Rows
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-muted/50 rounded animate-pulse w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedOrders.length > 0 ? (
                // Data Rows
                paginatedOrders.map((order: Order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm font-medium text-foreground">
                        #{order.id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">
                          {order.firstName} {order.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ID: {order.id.slice(0, 8)}...
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-foreground">
                        AED {order.totalAmount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatTimestamp(Number(order.createdAt))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {order.deliveryDate ? (
                        <div className="flex items-center gap-2">
                          <Truck className="w-3.5 h-3.5" />
                          {formatTimestamp(Number(order.deliveryDate))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground/50 italic">
                          Not scheduled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:text-primary hover:bg-primary/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                // Empty State
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="bg-muted p-4 rounded-full">
                        <Package className="w-8 h-8 text-muted-foreground/50" />
                      </div>
                      <p className="text-lg font-medium text-foreground">
                        No orders found
                      </p>
                      <p className="text-sm max-w-sm mx-auto">
                        Try adjusting your search terms or filters to find what
                        you're looking for.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchTerm("");
                          setStatusFilter("all");
                        }}
                        className="mt-2"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filteredOrders.length > 0 && (
          <div className="px-6 py-4 bg-muted/10 border-t border-border flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-foreground">
                {Math.min(currentPage * itemsPerPage, filteredOrders.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {filteredOrders.length}
              </span>{" "}
              results
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs bg-background hover:bg-muted border-border"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Simple logic to show first 5 pages, for full pagination logic (1...4 5 6...10) more code is needed
                  let pageNum = i + 1;
                  if (totalPages > 5 && currentPage > 3) {
                    pageNum = currentPage - 2 + i;
                    if (pageNum > totalPages) return null;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "luxury" : "ghost"}
                      size="sm"
                      className={`h-8 w-8 p-0 text-xs ${
                        currentPage === pageNum
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs bg-background hover:bg-muted border-border"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
