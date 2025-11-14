"use client";

import { useQuery } from "@apollo/client";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Award,
  Target,
} from "lucide-react";
import { GET_COUPON_STATS } from "@/src/modules/coupon/operations";
import { formatPrice } from "@/src/lib/utils";

export function CouponUsageStats() {
  const { data, loading, error } = useQuery(GET_COUPON_STATS);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-background p-6 rounded-lg shadow-sm border animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">
          Error loading coupon stats: {error.message}
        </p>
      </div>
    );
  }

  const stats = data?.couponStats;

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: "Total Coupons",
      value: stats.totalCoupons,
      icon: Target,
      color: "blue",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Coupons",
      value: stats.activeCoupons,
      icon: TrendingUp,
      color: "green",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Total Usage",
      value: stats.totalUsage,
      icon: Users,
      color: "purple",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Total Discount Given",
      value: formatPrice(stats.totalDiscountGiven),
      icon: DollarSign,
      color: "emerald",
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Expired Coupons",
      value: stats.expiredCoupons,
      icon: Calendar,
      color: "red",
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Top Performing",
      value: stats.topCoupons.length > 0 ? stats.topCoupons[0].code : "N/A",
      icon: Award,
      color: "yellow",
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="bg-background p-6 rounded-lg shadow-sm border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-foreground ">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Top Coupons */}
      {stats.topCoupons.length > 0 && (
        <motion.div
          className="bg-background rounded-lg shadow-sm border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground  mb-4">
              Top Performing Coupons
            </h3>
            <div className="space-y-4">
              {stats.topCoupons.map((coupon: any, index: any) => (
                <div
                  key={coupon.code}
                  className="flex items-center justify-between p-4 bg-cream-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-luxury-100 text-primary rounded-full font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground ">
                        {coupon.code}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {coupon.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground ">
                      {coupon.usageCount} uses
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(coupon.totalDiscount)} saved
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
