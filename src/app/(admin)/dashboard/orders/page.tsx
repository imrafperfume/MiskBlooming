"use client";

import { useState, useMemo, useEffect } from "react";
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
} from "lucide-react";
import { formatDate, formatTimestamp } from "@/src/lib/utils";

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

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [refetch, setRefetch] = useState(false);
  const itemsPerPage = 10;
  // const { data: orderUpdates } = useSubscription(GET_ORDERS);

  const { data: ordersData, loading: orderLoading } = useQuery(GET_ORDERS);
  const {
    data: statsData,
    loading: orderStatsLoading,
    refetch: refetchStats,
  } = useQuery(ORDER_STATS);

  const orderStats = statsData?.orderStats;
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "PROCESSING":
        return <Package className="w-4 h-4" />;
      case "SHIPPED":
        return <Truck className="w-4 h-4" />;
      case "DELIVERED":
        return <CheckCircle className="w-4 h-4" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  // Filter orders
  const filteredOrders = useMemo(() => {
    return ordersData?.allOrders
      .filter((order: any) => {
        const matchesSearch =
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.lastName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === "all" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [refetch, orderLoading, searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders?.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders?.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  useEffect(() => {
    refetchStats();
  }, [refetch]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-cormorant font-bold text-charcoal-900">
            Order Management
          </h1>
          <p className="text-gray-600 mt-2">Track and manage customer orders</p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap sm:items-center gap-4 sm:gap-0 sm:space-x-4 mt-4 lg:mt-0">
          <Button variant="outline" onClick={() => setRefetch((prev) => !prev)}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-xl font-bold text-charcoal-900">
            {orderStats?.totalOrders}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-xl font-bold text-yellow-600">
            {orderStats?.pending}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Processing</p>
          <p className="text-xl font-bold text-blue-600">
            {orderStats?.processing}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Shipped</p>
          <p className="text-xl font-bold text-purple-600">
            {orderStats?.shipped}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Delivered</p>
          <p className="text-xl font-bold text-green-600">
            {orderStats?.delivered}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">CANCELLED</p>
          <p className="text-xl font-bold text-red-600">
            {orderStats?.cancelled}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap sm:flex-nowrap gap-4">
        <input
          type="text"
          placeholder="Search orders..."
          className="border px-3 py-2 rounded-lg flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr className="text-sm font-normal">
              <th className="px-2 py-2 text-left">Order ID</th>
              <th className="px-2 py-2 text-left">Customer</th>
              <th className="px-2 py-2 text-left">Status</th>
              <th className="px-2 py-2 text-left">Total</th>
              <th className="px-2 py-2 text-left">Created At</th>
              <th className="px-2 py-2 text-left">Delivery Date</th>
              <th className="px-2 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className=" text-sm">
            {paginatedOrders?.map((order: any) => (
              <tr key={order.id} className="border-t">
                <td className="px-2 py-2 font-medium">{order?.id}</td>
                <td className="px-2 py-2">
                  {order?.firstName} {order.lastName}
                </td>
                <td
                  className={`px-2 py-2 inline-flex items-center gap-1 ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusIcon(order.status)}
                  {order.status}
                </td>
                <td className="px-2 py-2">AED {order.totalAmount}</td>
                <td className="px-2 py-2">
                  {formatTimestamp(Number(order?.createdAt))}
                </td>
                <td className="px-2 py-2">
                  {order?.deliveryDate
                    ? formatTimestamp(Number(order?.deliveryDate))
                    : "Not Scheduled"}
                </td>
                <td className="px-2 py-2">
                  <Link href={`/dashboard/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredOrders?.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, filteredOrders?.length)} of{" "}
            {filteredOrders?.length} orders
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "luxury" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
