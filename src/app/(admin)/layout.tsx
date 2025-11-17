"use client";

import type React from "react";

import { useState } from "react";
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
  List,
  Store,
  GalleryHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/Button";
import { Suspense } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { useNotifications } from "@/src/hooks/useNotifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const pathname = usePathname();
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
      name: "Hero Manage",
      href: "/dashboard/hero",
      icon: GalleryHorizontal,
      description: "Manage Hero Section",
    },
    {
      name: "Products",
      href: "/dashboard/products",
      icon: Package,
      description: "Manage Inventory",
    },
    {
      name: "Categories",
      href: "/dashboard/category",
      icon: List,
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
    <div className="flex relative  mx-auto justify-center overflow-x-hidden  bg-background">
      <div className="  flex justify-between w-full  overflow-x-hidden">
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
          className={`fixed top-0 inset-y-0 left-0 z-50 w-72 bg-background shadow-xl transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 overflow-y-auto ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
          initial={false}
        >
          <div className="flex flex-col w-full">
            {/* Logo */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-border  bg-background">
              <Link href="/dashboard" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center">
                  <span className="foreground font-bold text-sm">MB</span>
                </div>
                <div>
                  <div className="text-lg font-cormorant font-bold text-foreground ">
                    Misk<span className="text-primary ">Blooming</span>
                  </div>
                  <div className="text-xs text-foreground ">Admin Panel</div>
                </div>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-md text-foreground hover:text-foreground hover:bg-primary"
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
                        ? "bg-primary text-foreground shadow-sm border border-border "
                        : "text-foreground  hover:bg-primary"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 mr-3 ${
                        isActive
                          ? "text-foreground "
                          : "text-foreground/60 group-hover:text-foreground "
                      }`}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-foreground mt-0.5">
                        {item.description}
                      </div>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 bg-foreground 0 rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User section */}
            <div className="p-4 border-t border-border  bg-background">
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-full flex items-center p-3 rounded-xl hover:bg-primary transition-colors"
                >
                  <div className="w-10 h-10  rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="ml-3 flex-1 text-left">
                    <p className="text-sm font-medium text-foreground ">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-foreground/60 ">{user?.email}</p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-foreground transition-transform ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      className="absolute bottom-full left-0 right-0 mb-2 bg-background rounded-xl shadow-lg border border-border  py-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <Link
                        href="/"
                        className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-primary  transition-colors"
                      >
                        <Store className="w-4 h-4 mr-3" />
                        Visit Store
                      </Link>{" "}
                      {/* <Link
                        href="/dashboard/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-background"
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profile Settings
                      </Link> */}
                      {/* <Link
                        href="/dashboard/help"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-background"
                      >
                        <HelpCircle className="w-4 h-4 mr-3" />
                        Help & Support
                      </Link> */}
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
          <div className="sticky top-0 z-30 bg-background backdrop-blur-md border-b border-border ">
            <div className="flex items-center justify-between h-16 px-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-foreground  hover:bg-primary transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>

                {/* Breadcrumb */}
                <nav className="hidden md:flex items-center space-x-2 text-sm">
                  <Link
                    href="/dashboard"
                    className="text-foreground hover:text-primary"
                  >
                    Dashboard
                  </Link>
                  {pathname !== "/dashboard" && (
                    <>
                      <span className="text-foreground">/</span>
                      <span className="text-primary font-medium capitalize">
                        {pathname.split("/").pop()?.replace("-", " ")}
                      </span>
                    </>
                  )}
                </nav>
              </div>

              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search anything..."
                    className="pl-10 pr-4 py-2 w-64 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background/50 backdrop-blur-sm"
                  />
                </div>

                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="relative p-2 text-foreground hover:bg-primary rounded-full cursor-pointer transition-colors">
                      <Bell className="w-6 h-6" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-3 h-3 bg-destructive rounded-full animate-pulse" />
                      )}
                    </div>
                  </DropdownMenuTrigger>

                  <AnimatePresence>
                    <DropdownMenuContent asChild>
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 max-h-[80vh] overflow-y-auto flex flex-col gap-2 bg-background border rounded-xl shadow-lg p-4 z-50"
                        onFocusCapture={() => markAllRead()} // mark read when opening
                      >
                        {notifications.length === 0 && (
                          <div className="p-2 text-foreground text-sm">
                            No notifications
                          </div>
                        )}

                        {notifications.map((n) => (
                          <Link
                            href={`/dashboard/orders/${n.orderId}`}
                            key={n.id}
                            // layout
                            // initial={{ opacity: 0, x: 20 }}
                            // animate={{ opacity: 1, x: 0 }}
                            // exit={{ opacity: 0, x: 20 }}
                            // transition={{ duration: 0.2 }}
                            className={`p-3 rounded-lg cursor-pointer transition-colors text-sm ${
                              n.read
                                ? "bg-background  hover:bg-gray-200"
                                : "bg-blue-50 hover:bg-blue-100"
                            }`}
                          >
                            {/* <strong className="block">{n.type}</strong> */}
                            <span className="block text-gray-700">
                              {n.message}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(n.createdAt).toLocaleTimeString()}
                            </span>
                          </Link>
                        ))}
                      </motion.div>
                    </DropdownMenuContent>
                  </AnimatePresence>
                </DropdownMenu>

                {/* Quick Actions */}
                <div className="hidden lg:flex items-center space-x-2">
                  <Link href="/dashboard/products/add">
                    <Button variant="outline" size="sm">
                      <Package className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </Link>
                  <Link href="/dashboard/orders">
                    <Button variant="luxury" size="sm">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      New Order
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="p-6 top-0 overflow-x-hidden bg-background">
            <Suspense fallback={<div>Loading...</div>}>
              {/* <AdminNotificationListener /> */}
              {children}
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
