"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { useSearchParams } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  User,
  ChevronDown,
  MessageSquare,
  FileText,
  Truck,
  CreditCard,
  Tag,
  Calendar,
  HelpCircle,
  Ticket,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/Button";
import { Suspense } from "react";
import { useAuth } from "@/src/hooks/useAuth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  // const searchParams = useSearchParams()
  const { data: user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div>
        <p>Loading please wait</p>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    window.location.href = "/";
    return null;
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      description: "Overview & Analytics",
    },
    {
      name: "Products",
      href: "/dashboard/products",
      icon: Package,
      description: "Manage Inventory",
    },
    {
      name: "Orders",
      href: "/dashboard/orders",
      icon: ShoppingCart,
      description: "Order Management",
    },
    {
      name: "Customers",
      href: "/dashboard/customers",
      icon: Users,
      description: "Customer Relations",
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
      description: "Business Insights",
    },
    {
      name: "Reviews",
      href: "/dashboard/reviews",
      icon: MessageSquare,
      description: "Customer Feedback",
    },
    {
      name: "Promotions",
      href: "/dashboard/promotions",
      icon: Tag,
      description: "Discounts & Offers",
    },
    {
      name: "Coupons",
      href: "/dashboard/coupons",
      icon: Ticket,
      description: "Coupon Management",
    },
    {
      name: "Delivery",
      href: "/dashboard/delivery",
      icon: Truck,
      description: "Shipping Management",
    },
    {
      name: "Payments",
      href: "/dashboard/payments",
      icon: CreditCard,
      description: "Payment Processing",
    },
    {
      name: "Invoices",
      href: "/dashboard/invoices",
      icon: FileText,
      description: "Invoice Management",
    },
    {
      name: "Reports",
      href: "/dashboard/reports",
      icon: BarChart3,
      description: "Business Reports",
    },
    {
      name: "Calendar",
      href: "/dashboard/calendar",
      icon: Calendar,
      description: "Schedule & Events",
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      description: "System Configuration",
    },
  ];

  return (
    <div className="flex relative max-w-screen-2xl justify-center overflow-x-hidden  bg-gray-50">
      <div className="  flex justify-between max-w-full overflow-x-hidden">
        {/* Mobile sidebar backdrop */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="fixed inset-0 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
                onClick={() => setSidebarOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.div
          className={`fixed top-0 inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
          initial={false}
        >
          <div className="flex flex-col w-full">
            {/* Logo */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white">
              <Link href="/dashboard" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-luxury-400 to-luxury-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MB</span>
                </div>
                <div>
                  <div className="text-lg font-cormorant font-bold text-charcoal-900">
                    Misk<span className="text-luxury-500">Blooming</span>
                  </div>
                  <div className="text-xs text-gray-500">Admin Panel</div>
                </div>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-luxury-50 to-luxury-100 text-luxury-700 shadow-sm border border-luxury-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 mr-3 ${
                        isActive
                          ? "text-luxury-600"
                          : "text-gray-400 group-hover:text-gray-600"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                      </div>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 bg-luxury-500 rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User section */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-full flex items-center p-3 rounded-xl hover:bg-white transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-luxury-400 to-luxury-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-3 flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900">
                      Admin User
                    </p>
                    <p className="text-xs text-gray-500">
                      admin@miskblooming.ae
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profile Settings
                      </Link>
                      <Link
                        href="/dashboard/help"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <HelpCircle className="w-4 h-4 mr-3" />
                        Help & Support
                      </Link>
                      <hr className="my-2" />
                      <button className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="overflow-x-auto w-full">
          {/* Top bar */}
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <Menu className="w-5 h-5" />
                </button>

                {/* Breadcrumb */}
                <nav className="hidden md:flex items-center space-x-2 text-sm">
                  <Link
                    href="/dashboard"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Dashboard
                  </Link>
                  {pathname !== "/dashboard" && (
                    <>
                      <span className="text-gray-300">/</span>
                      <span className="text-gray-900 font-medium capitalize">
                        {pathname.split("/").pop()?.replace("-", " ")}
                      </span>
                    </>
                  )}
                </nav>
              </div>

              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search anything..."
                    className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  />
                </div>

                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Quick Actions */}
                <div className="hidden lg:flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Package className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                  <Button variant="luxury" size="sm">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    New Order
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="p-6 top-0 overflow-x-hidden">
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
