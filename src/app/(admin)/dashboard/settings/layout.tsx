"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Truck,
  Mail,
  Palette,
  Database,
} from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  {
    id: "general",
    name: "General",
    icon: Settings,
    href: "/dashboard/settings/general",
  },
  {
    id: "profile",
    name: "Profile",
    icon: User,
    href: "/dashboard/settings/profile",
  },
  {
    id: "notifications",
    name: "Notifications",
    icon: Bell,
    href: "/dashboard/settings/notifications",
  },
  {
    id: "security",
    name: "Security",
    icon: Shield,
    href: "/dashboard/settings/security",
  },
  {
    id: "payments",
    name: "Payments",
    icon: CreditCard,
    href: "/dashboard/settings/payments",
  },
  { id: "shipping", name: "Shipping", icon: Truck, href: "/settings/shipping" },
  { id: "email", name: "Email", icon: Mail, href: "/settings/email" },
  {
    id: "appearance",
    name: "Appearance",
    icon: Palette,
    href: "/dashboard/settings/appearance",
  },
  {
    id: "integrations",
    name: "Integrations",
    icon: Database,
    href: "/dashboard/settings/integrations",
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center border-gray-200  border-b pb-4 justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">
              Manage your account and system preferences
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.nav
            className="bg-white rounded-2xl shadow-sm border border-gray-200 "
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`flex items-center gap-4 w-full px-3 py-2 rounded-lg transition-colors ${
                  pathname === tab.href
                    ? "bg-luxury-50 text-luxury-700 border border-luxury-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.name}</span>
              </Link>
            ))}
          </motion.nav>

          {/* Page Content */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
