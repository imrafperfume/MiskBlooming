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
  Download,
  ChevronRight,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useQuery } from "@apollo/client";
import { DASHBOARD_METRICS } from "@/src/modules/dashboard/oprations";
import Loading from "@/src/components/layout/Loading";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

// --- Types ---
interface DashboardMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  ordersGrowth: number;
  activeProducts: number;
  productsGrowth: number;
  totalCustomers: number;
  customersGrowth: number;
  pendingOrders: number;
  lowStockItems: number;
  newReviews: number;
  completedToday: number;
  recentOrders: any[];
  topProducts: any[];
}

// --- Helper: Status Badges (Theme Compliant) ---
const StatusBadge = ({ status }: { status: string }) => {
  const s = status.toLowerCase();
  let styles = "bg-muted text-muted-foreground"; // Default

  if (s === "delivered" || s === "completed") {
    styles = "bg-primary/10 text-primary border-primary/20";
  } else if (s === "processing" || s === "shipped") {
    styles = "bg-blue-500/10 text-blue-600 border-blue-500/20"; // kept subtle blue for distinction
  } else if (s === "pending") {
    styles = "bg-orange-500/10 text-orange-600 border-orange-500/20";
  } else if (s === "cancelled") {
    styles = "bg-destructive/10 text-destructive border-destructive/20";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles} capitalize`}
    >
      {status}
    </span>
  );
};

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState(7);
  const router = useRouter();

  const { data, loading, error } = useQuery(DASHBOARD_METRICS, {
    fetchPolicy: "cache-and-network",
    variables: { timeRange },
    onError: (err) => toast.error("Failed to load dashboard data"),
  });

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
        <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold text-foreground">
          Failed to load dashboard
        </h2>
        <p className="text-muted-foreground mb-4">
          There was an issue fetching the latest metrics.
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  const metrics: DashboardMetrics = data?.dashboardMetrics || {};
  const recentOrders = metrics.recentOrders || [];
  const topProducts = metrics.topProducts || [];

  // --- Stats Configuration ---
  const stats = [
    {
      name: "Total Revenue",
      value: `AED ${metrics.totalRevenue?.toLocaleString() ?? "0"}`,
      change: metrics.revenueGrowth ?? 0,
      icon: DollarSign,
      description: "vs last period",
    },
    {
      name: "Total Orders",
      value: metrics.totalOrders?.toLocaleString() ?? "0",
      change: metrics.ordersGrowth ?? 0,
      icon: ShoppingCart,
      description: "orders placed",
    },
    {
      name: "Active Products",
      value: metrics.activeProducts?.toLocaleString() ?? "0",
      change: metrics.productsGrowth ?? 0,
      icon: Package,
      description: "in inventory",
    },
    {
      name: "Total Customers",
      value: metrics.totalCustomers?.toLocaleString() ?? "0",
      change: metrics.customersGrowth ?? 0,
      icon: Users,
      description: "registered users",
    },
  ];

  const quickStats = [
    {
      label: "Pending Orders",
      value: metrics.pendingOrders,
      icon: Clock,
      alert: metrics.pendingOrders > 10,
    },
    {
      label: "Low Stock Items",
      value: metrics.lowStockItems,
      icon: AlertTriangle,
      alert: metrics.lowStockItems > 0,
    },
    {
      label: "New Reviews",
      value: metrics.newReviews,
      icon: Star,
      alert: false,
    },
    {
      label: "Completed Today",
      value: metrics.completedToday,
      icon: CheckCircle,
      alert: false,
    },
  ];

  const downloadReport = async () => {
    try {
      const res = await fetch(`/api/dashboard-report?days=${timeRange}`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${timeRange}d-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Report downloaded successfully");
    } catch (e) {
      toast.error("Could not download report");
    }
  };

  return (
    <div className="space-y-8 w-full pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-cormorant font-bold text-foreground tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Track performance, manage orders, and analyze trends.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(parseInt(e.target.value))}
              className="appearance-none bg-background border border-border text-foreground text-sm rounded-lg pl-4 pr-10 py-2.5 focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>

          <Button
            onClick={downloadReport}
            variant="outline"
            className="h-10 border-border bg-background hover:bg-muted"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const isPositive = stat.change >= 0;
          return (
            <motion.div
              key={stat.name}
              className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div
                  className={`flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                    isPositive
                      ? "bg-primary/10 text-primary"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(stat.change).toFixed(1)}%
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-1 tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Status Bar */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {quickStats.map((stat, index) => (
          <div
            key={stat.label}
            className="group flex items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm hover:border-primary/50 transition-colors"
          >
            <div>
              <p
                className={`text-xl font-bold ${
                  stat.alert ? "text-destructive" : "text-foreground"
                }`}
              >
                {stat.value?.toLocaleString() || "0"}
              </p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
            <stat.icon
              className={`w-5 h-5 ${
                stat.alert
                  ? "text-destructive"
                  : "text-muted-foreground group-hover:text-primary"
              }`}
            />
          </div>
        ))}
      </motion.div>

      {/* Content Split: Orders & Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <motion.div
          className="bg-card rounded-xl shadow-sm border border-border flex flex-col"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-cormorant font-bold text-foreground">
              Recent Orders
            </h2>
            <Link href="/dashboard/orders">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary hover:bg-primary/10"
              >
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="p-4 flex-1 overflow-auto">
            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                <Package className="w-8 h-8 mb-2 opacity-50" />
                <p>No recent orders found</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <tbody className="divide-y divide-border">
                  {recentOrders.map((order: any) => (
                    <tr
                      key={order.id}
                      className="group hover:bg-muted/40 transition-colors"
                    >
                      <td className="py-3 px-2">
                        <div className="font-medium text-foreground">
                          #{order.id}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.customer?.name || "Guest"}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="text-foreground max-w-[120px] truncate">
                          {order.product}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="font-medium text-foreground">
                          {order.amount}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          className="bg-card rounded-xl shadow-sm border border-border flex flex-col"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-cormorant font-bold text-foreground">
              Top Performing Products
            </h2>
          </div>

          <div className="p-4 flex-1 overflow-auto">
            {topProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                <Package className="w-8 h-8 mb-2 opacity-50" />
                <p>No sales data yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {topProducts.map((product: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.sales} units sold
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-medium text-foreground text-sm">
                        {product.revenue}
                      </p>
                      <div
                        className={`flex items-center justify-end text-xs ${
                          product.growthPercent >= 0
                            ? "text-primary"
                            : "text-destructive"
                        }`}
                      >
                        {product.growthPercent >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(product.growthPercent)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Action Tiles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-lg font-semibold text-foreground mb-4 pl-1">
          Management Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Add Product",
              desc: "Create a new flower arrangement",
              icon: Package,
              action: () => router.push("/dashboard/products/add"),
              color: "text-primary",
            },
            {
              title: "Process Orders",
              desc: "Review and manage pending orders",
              icon: ShoppingCart,
              action: () => router.push("/dashboard/orders"),
              color: "text-primary",
            },
            {
              title: "Analytics",
              desc: "Deep dive into store performance",
              icon: TrendingUp,
              action: () => router.push("/dashboard/analytics"),
              color: "text-primary",
            },
          ].map((item, i) => (
            <button
              key={i}
              onClick={item.action}
              className="flex items-start p-6 bg-card border border-border rounded-xl text-left hover:border-primary/50 hover:shadow-md transition-all group"
            >
              <div
                className={`p-3 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors mr-4 ${item.color}`}
              >
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
