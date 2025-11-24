"use client";

import React from "react";
import Link from "next/link";
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
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const settingCards = [
  {
    title: "General",
    description: "Store name, currency, and regional formats.",
    icon: Settings,
    href: "/dashboard/settings/general",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Profile",
    description: "Manage your personal information and avatar.",
    icon: User,
    href: "/dashboard/settings/profile",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Notifications",
    description: "Configure email alerts and push notifications.",
    icon: Bell,
    href: "/dashboard/settings/notifications",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    title: "Security",
    description: "Password, 2FA, and login activity logs.",
    icon: Shield,
    href: "/dashboard/settings/security",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Payments",
    description: "Connect payment gateways and manage billing.",
    icon: CreditCard,
    href: "/dashboard/settings/payments",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    title: "Shipping",
    description: "Delivery zones, rates, and carrier integration.",
    icon: Truck,
    href: "/dashboard/settings/shipping",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    title: "Appearance",
    description: "Customize the look and feel of your dashboard.",
    icon: Palette,
    href: "/dashboard/settings/appearance",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    title: "Integrations",
    description: "Manage API keys and third-party apps.",
    icon: Database,
    href: "/dashboard/settings/integrations",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
];

export default function SettingsOverviewPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Account Status Summary Card */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              AC
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Acme Corp Store
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  Active Plan
                </span>
                <span className="text-sm text-muted-foreground">
                  • Administrator
                </span>
              </div>
            </div>
          </div>
          <button className="text-sm font-medium text-primary hover:underline underline-offset-4">
            View Public Profile
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Current Plan
            </p>
            <p className="font-semibold text-foreground">Pro Business</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Member Since
            </p>
            <p className="font-semibold text-foreground">Oct 2023</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Security Status
            </p>
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">2FA Not Enabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Navigation Grid */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          All Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {settingCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/50"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`h-10 w-10 rounded-lg ${card.bgColor} ${card.color} flex items-center justify-center`}
                >
                  <card.icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
              </div>

              <div>
                <h4 className="font-semibold text-foreground">{card.title}</h4>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Footer / Support Area */}
      <div className="rounded-xl bg-muted/50 border border-dashed border-border p-6 text-center">
        <h4 className="text-sm font-semibold text-foreground">Need help?</h4>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          Check our documentation or contact support if you are stuck.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="#"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Documentation
          </Link>
          <span className="text-border">|</span>
          <Link
            href="#"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
