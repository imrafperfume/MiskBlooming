"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Copy,
  Eye,
  Calendar,
  Users,
  Percent,
  DollarSign,
  Truck,
  Ticket,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { toast } from "sonner";
import {
  GET_ALL_COUPONS,
  DELETE_COUPON,
  TOGGLE_COUPON_STATUS,
} from "@/src/modules/coupon/operations";
import { formatPrice } from "@/src/lib/utils";
import { CreateCouponModal } from "@/src/components/dashboard/coupons/CreateCouponModal";
import type { Coupon } from "@/src/types/coupon";
import Link from "next/link";

// --- Types & Interfaces ---
interface StatCardProps {
  label: string;
  value: number | string;
  icon: any;
  colorClass: string;
  bgClass: string;
}

// --- Helper Components ---
const StatusBadge = ({ coupon }: { coupon: Coupon }) => {
  const now = new Date();
  const validFrom = new Date(coupon.validFrom);
  const validUntil = new Date(coupon.validUntil);

  if (!coupon.isActive) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
        <XCircle className="w-3 h-3" /> Inactive
      </span>
    );
  }

  if (now < validFrom) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20">
        <Clock className="w-3 h-3" /> Scheduled
      </span>
    );
  }

  if (now > validUntil) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20">
        <AlertCircle className="w-3 h-3" /> Expired
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600 border border-green-500/20">
      <CheckCircle className="w-3 h-3" /> Active
    </span>
  );
};

const DiscountBadge = ({ type, value }: { type: string; value: number }) => {
  const iconMap: Record<string, any> = {
    PERCENTAGE: Percent,
    FIXED_AMOUNT: DollarSign,
    FREE_SHIPPING: Truck,
  };
  const Icon = iconMap[type] || DollarSign;

  const displayValue =
    type === "PERCENTAGE"
      ? `${value}%`
      : type === "FIXED_AMOUNT"
      ? formatPrice(value)
      : "Free Shipping";

  return (
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-md bg-primary/10 text-primary">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <span className="font-medium text-foreground">{displayValue}</span>
    </div>
  );
};

// --- Loading Skeleton ---
const CouponSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-24 bg-card rounded-xl border border-border animate-pulse"
        />
      ))}
    </div>
    <div className="h-96 bg-card rounded-xl border border-border animate-pulse" />
  </div>
);

export default function CouponsPage() {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  // Assuming showEditModal logic is similar to create modal,
  // currently Edit modal component is not imported but state exists
  const [showEditModal, setShowEditModal] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_ALL_COUPONS, {
    notifyOnNetworkStatusChange: true,
  });

  const [deleteCoupon] = useMutation(DELETE_COUPON);
  const [toggleCouponStatus] = useMutation(TOGGLE_COUPON_STATUS);

  const coupons: Coupon[] = data?.allCoupons || [];

  const handleDeleteCoupon = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this coupon? This action cannot be undone."
      )
    )
      return;
    try {
      await deleteCoupon({ variables: { id } });
      toast.success("Coupon deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete coupon");
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleCouponStatus({ variables: { id } });
      toast.success("Coupon status updated");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  if (loading) return <CouponSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold text-foreground">
          Failed to load coupons
        </h2>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  // Calculate Stats
  const now = new Date();
  const activeCount = coupons.filter(
    (c) => c.isActive && new Date(c.validUntil) > now
  ).length;
  const expiredCount = coupons.filter(
    (c) => new Date(c.validUntil) < now
  ).length;
  const totalUsage = coupons.reduce((sum, c) => sum + (c.usageCount || 0), 0);

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-cormorant text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Coupon Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Create and manage promotional codes and discounts.
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          variant="luxury"
          className="shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Coupon
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Coupons",
            value: coupons.length,
            icon: Ticket,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Active Now",
            value: activeCount,
            icon: CheckCircle,
            color: "text-green-600",
            bg: "bg-green-500/10",
          },
          {
            label: "Total Usage",
            value: totalUsage,
            icon: Users,
            color: "text-purple-600",
            bg: "bg-purple-500/10",
          },
          {
            label: "Expired",
            value: expiredCount,
            icon: Clock,
            color: "text-destructive",
            bg: "bg-destructive/10",
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-card p-5 rounded-xl border border-border shadow-sm flex items-start justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {stat.value}
              </h3>
            </div>
            <div className={`p-2.5 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Table Card */}
      <motion.div
        className="bg-card rounded-xl shadow-sm border border-border overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="overflow-x-auto">
          {coupons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-muted p-4 rounded-full mb-4">
                <Ticket className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                No coupons created yet
              </h3>
              <p className="text-muted-foreground max-w-sm mt-1 mb-6">
                Get started by creating your first promotional campaign.
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                variant="outline"
              >
                Create Coupon
              </Button>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  {[
                    "Code / Name",
                    "Discount",
                    "Usage",
                    "Validity",
                    "Status",
                    "Actions",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-6 py-4 font-semibold text-muted-foreground"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {coupons.map((coupon) => (
                  <tr
                    key={coupon.id}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    {/* Code & Name */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <code className="px-2 py-0.5 rounded bg-muted font-mono text-sm font-bold text-foreground border border-border">
                            {coupon.code}
                          </code>
                          <button
                            onClick={() => copyCouponCode(coupon.code)}
                            className="text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                            title="Copy Code"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium truncate max-w-[150px]">
                          {coupon.name}
                        </span>
                      </div>
                    </td>

                    {/* Discount Value */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <DiscountBadge
                          type={coupon.discountType}
                          value={coupon.discountValue}
                        />
                        {coupon.minimumAmount && (
                          <span className="text-xs text-muted-foreground">
                            Min spend: {formatPrice(coupon.minimumAmount)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Usage Stats */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-foreground">
                        <span className="font-semibold">
                          {coupon.usageCount}
                        </span>
                        <span className="text-muted-foreground">/</span>
                        <span className="text-muted-foreground">
                          {coupon.usageLimit || "∞"}
                        </span>
                      </div>
                    </td>

                    {/* Date Range */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-xs text-muted-foreground gap-1">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500/50"></span>
                          {new Date(coupon.validFrom).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-destructive/50"></span>
                          {new Date(coupon.validUntil).toLocaleDateString()}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <StatusBadge coupon={coupon} />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* Edit Action (Placeholder) */}
                        <button
                          onClick={() => {
                            setSelectedCoupon(coupon);
                            setShowCreateModal(true); // Reusing modal for simplicity, ideally use EditModal
                          }}
                          className="p-1.5 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Toggle Status */}
                        <button
                          onClick={() => handleToggleStatus(coupon.id)}
                          className={`p-1.5 rounded-md hover:bg-muted transition-colors ${
                            coupon.isActive
                              ? "text-green-600"
                              : "text-muted-foreground"
                          }`}
                          title={coupon.isActive ? "Deactivate" : "Activate"}
                        >
                          {coupon.isActive ? (
                            <ToggleRight className="w-5 h-5" />
                          ) : (
                            <ToggleLeft className="w-5 h-5" />
                          )}
                        </button>

                        {/* Delete Action */}
                        <button
                          onClick={() => handleDeleteCoupon(coupon.id)}
                          className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

      {/* Modals */}
      <CreateCouponModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setSelectedCoupon(null);
        }}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
