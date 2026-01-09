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
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  {
    id: "general",
    name: "General",
    icon: Settings,
    href: "/dashboard/settings/general",
    description: "System preferences",
  },
  {
    id: "profile",
    name: "Profile",
    icon: User,
    href: "/dashboard/settings/profile",
    description: "Your personal info",
  },
  {
    id: "appearance",
    name: "Appearance",
    icon: Palette,
    href: "/dashboard/settings/appearance",
    description: "Theme & Layout",
  },
  {
    id: "notifications",
    name: "Notifications",
    icon: Bell,
    href: "/dashboard/settings/notifications",
    description: "Email & alerts",
  },
  {
    id: "security",
    name: "Security",
    icon: Shield,
    href: "/dashboard/settings/security",
    description: "Password & 2FA",
  },
  {
    id: "payments",
    name: "Payments",
    icon: CreditCard,
    href: "/dashboard/settings/payments",
    description: "Billing methods",
  },
  {
    id: "shipping",
    name: "Shipping",
    icon: Truck,
    href: "/dashboard/settings/shipping",
    description: "Delivery zones",
  },
  {
    id: "integrations",
    name: "Integrations",
    icon: Database,
    href: "/dashboard/settings/integrations",
    description: "Connected apps",
  },
  {
    id: "admins",
    name: "Admin Management",
    icon: Shield,
    href: "/dashboard/settings/admins",
    description: "Manage admin roles",
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Helper to check active state including sub-paths
  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
            Manage your account settings and set system-wide preferences here.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <motion.aside
            className="w-full lg:w-64 shrink-0 space-y-1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="lg:sticky lg:top-6 space-y-1">
              {tabs.map((tab) => {
                const active = isActive(tab.href);
                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={`
                      group relative flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                      ${active
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }
                    `}
                  >
                    <tab.icon
                      className={`w-4 h-4 shrink-0 transition-colors ${active
                          ? "text-primary-foreground"
                          : "group-hover:text-foreground"
                        }`}
                    />
                    <div className="flex flex-col leading-none">
                      <span>{tab.name}</span>
                      {/* Optional: Show description only on desktop if desired, currently hidden for clean look */}
                    </div>

                    {active && (
                      <ChevronRight className="w-4 h-4 ml-auto opacity-80" />
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-card rounded-xl border border-border shadow-sm"
            >
              <div className="p-6 lg:p-10">{children}</div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
