"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  Download,
  RefreshCw,
  MoreHorizontal,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";

// Mock payments data
const mockPayments = [
  {
    id: "PAY-001234",
    orderId: "ORD-001234",
    customer: "Sarah Al-Mansouri",
    amount: 499,
    method: "credit_card",
    provider: "Visa",
    status: "completed",
    transactionId: "TXN-ABC123456",
    date: "2024-01-15T10:30:00Z",
    fee: 14.97,
    currency: "AED",
    refunded: 0,
  },
  {
    id: "PAY-001235",
    orderId: "ORD-001235",
    customer: "Ahmed Hassan",
    amount: 398,
    method: "digital_wallet",
    provider: "Apple Pay",
    status: "completed",
    transactionId: "TXN-DEF789012",
    date: "2024-01-14T15:45:00Z",
    fee: 11.94,
    currency: "AED",
    refunded: 0,
  },
  {
    id: "PAY-001236",
    orderId: "ORD-001236",
    customer: "Emma Johnson",
    amount: 599,
    method: "bank_transfer",
    provider: "Emirates NBD",
    status: "pending",
    transactionId: "TXN-GHI345678",
    date: "2024-01-13T09:15:00Z",
    fee: 0,
    currency: "AED",
    refunded: 0,
  },
  {
    id: "PAY-001237",
    orderId: "ORD-001237",
    customer: "Omar Khalil",
    amount: 424,
    method: "credit_card",
    provider: "Mastercard",
    status: "failed",
    transactionId: "TXN-JKL901234",
    date: "2024-01-12T13:20:00Z",
    fee: 0,
    currency: "AED",
    refunded: 0,
  },
  {
    id: "PAY-001238",
    orderId: "ORD-001238",
    customer: "Fatima Al-Zahra",
    amount: 320,
    method: "cash_on_delivery",
    provider: "COD",
    status: "completed",
    transactionId: "TXN-MNO567890",
    date: "2024-01-11T11:10:00Z",
    fee: 0,
    currency: "AED",
    refunded: 150,
  },
];

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [dateRange, setDateRange] = useState("7d");

  const filteredPayments = useMemo(() => {
    return mockPayments.filter((payment) => {
      const matchesSearch =
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || payment.status === statusFilter;
      const matchesMethod =
        methodFilter === "all" || payment.method === methodFilter;
      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [searchTerm, statusFilter, methodFilter]);

  const stats = useMemo(() => {
    const totalRevenue = mockPayments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);
    const totalFees = mockPayments.reduce((sum, p) => sum + p.fee, 0);
    const totalRefunds = mockPayments.reduce((sum, p) => sum + p.refunded, 0);

    return {
      total: mockPayments.length,
      completed: mockPayments.filter((p) => p.status === "completed").length,
      pending: mockPayments.filter((p) => p.status === "pending").length,
      failed: mockPayments.filter((p) => p.status === "failed").length,
      totalRevenue,
      totalFees,
      totalRefunds,
      netRevenue: totalRevenue - totalFees - totalRefunds,
    };
  }, []);

  const paymentMethods = Array.from(new Set(mockPayments.map((p) => p.method)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-background  text-gray-800";
      default:
        return "bg-background  text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "failed":
        return <XCircle className="w-4 h-4" />;
      case "refunded":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "credit_card":
        return <CreditCard className="w-4 h-4" />;
      case "digital_wallet":
        return <DollarSign className="w-4 h-4" />;
      case "bank_transfer":
        return <TrendingUp className="w-4 h-4" />;
      case "cash_on_delivery":
        return <DollarSign className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-cormorant font-bold text-foreground ">
            Payment Management
          </h1>
          <p className="text-foreground  mt-2">
            Track and manage payment transactions
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          className="bg-background rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground ">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground ">
                AED {stats.totalRevenue.toLocaleString()}
              </p>
              <p className="text-xs text-green-600 mt-1">
                +12.5% vs last period
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-50">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-background rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground ">Net Revenue</p>
              <p className="text-2xl font-bold text-primary ">
                AED {stats.netRevenue.toLocaleString()}
              </p>
              <p className="text-xs text-foreground mt-1">
                After fees & refunds
              </p>
            </div>
            <div className="p-3 rounded-xl bg-foreground ">
              <TrendingUp className="w-6 h-6 text-primary " />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-background rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground ">Transaction Fees</p>
              <p className="text-2xl font-bold text-orange-600">
                AED {stats.totalFees.toLocaleString()}
              </p>
              <p className="text-xs text-foreground mt-1">
                {((stats.totalFees / stats.totalRevenue) * 100).toFixed(1)}% of
                revenue
              </p>
            </div>
            <div className="p-3 rounded-xl bg-orange-50">
              <CreditCard className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-background rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground ">Total Refunds</p>
              <p className="text-2xl font-bold text-red-600">
                AED {stats.totalRefunds.toLocaleString()}
              </p>
              <p className="text-xs text-foreground mt-1">
                {((stats.totalRefunds / stats.totalRevenue) * 100).toFixed(1)}%
                of revenue
              </p>
            </div>
            <div className="p-3 rounded-xl bg-red-50">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          className="bg-background rounded-xl p-4 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground ">Completed</p>
              <p className="text-xl font-bold text-green-600">
                {stats.completed}
              </p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
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
              <p className="text-sm text-foreground ">Pending</p>
              <p className="text-xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </div>
            <Clock className="w-6 h-6 text-yellow-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-background rounded-xl p-4 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground ">Failed</p>
              <p className="text-xl font-bold text-red-600">{stats.failed}</p>
            </div>
            <XCircle className="w-6 h-6 text-red-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-background rounded-xl p-4 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground ">Success Rate</p>
              <p className="text-xl font-bold text-blue-600">
                {((stats.completed / stats.total) * 100).toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="w-6 h-6 text-blue-500" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        className="bg-background rounded-xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search payments, orders, customers..."
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
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
          >
            <option value="all">All Methods</option>
            <option value="credit_card">Credit Card</option>
            <option value="digital_wallet">Digital Wallet</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="cash_on_delivery">Cash on Delivery</option>
          </select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </motion.div>

      {/* Payments Table */}
      <motion.div
        className="bg-background rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-foreground ">
            Payment Transactions ({filteredPayments.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Payment ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-gray-200">
              {filteredPayments.map((payment, index) => (
                <motion.tr
                  key={payment.id}
                  className="hover:bg-background transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium text-foreground ">
                        {payment.id}
                      </p>
                      <p className="text-sm text-foreground ">
                        Order: {payment.orderId}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">
                        {payment.transactionId}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-medium text-foreground ">
                      {payment.customer}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium text-foreground ">
                        {payment.currency} {payment.amount.toLocaleString()}
                      </p>
                      {payment.fee > 0 && (
                        <p className="text-sm text-foreground ">
                          Fee: {payment.currency} {payment.fee.toFixed(2)}
                        </p>
                      )}
                      {payment.refunded > 0 && (
                        <p className="text-sm text-red-600">
                          Refunded: {payment.currency} {payment.refunded}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getMethodIcon(payment.method)}
                      <div className="ml-2">
                        <p className="text-sm font-medium text-foreground  capitalize">
                          {payment.method.replace("_", " ")}
                        </p>
                        <p className="text-xs text-foreground ">
                          {payment.provider}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      {getStatusIcon(payment.status)}
                      <span className="ml-1 capitalize">{payment.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-foreground ">
                        {new Date(payment.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-foreground ">
                        {new Date(payment.date).toLocaleTimeString()}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground  mb-2">
              No payments found
            </h3>
            <p className="text-foreground ">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
