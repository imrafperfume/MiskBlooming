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
} from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { toast } from "sonner";
import {
  GET_ALL_COUPONS,
  DELETE_COUPON,
  TOGGLE_COUPON_STATUS,
} from "@/src/modules/coupon/operations";
import { formatPrice } from "@/src/lib/utils";
import { CreateCouponModal } from "@/src/components/dashboard/coupons/CreateCouponModal";
import type { Coupon } from "@/src/types/coupon";

export default function CouponsPage() {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_ALL_COUPONS);
  const [deleteCoupon] = useMutation(DELETE_COUPON);
  const [toggleCouponStatus] = useMutation(TOGGLE_COUPON_STATUS);

  const coupons: Coupon[] = data?.allCoupons || [];

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    try {
      await deleteCoupon({ variables: { id } });
      toast.success("Coupon deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleCouponStatus({ variables: { id } });
      toast.success("Coupon status updated");
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Coupon code copied to clipboard");
  };

  const getDiscountDisplay = (coupon: Coupon) => {
    switch (coupon.discountType) {
      case "PERCENTAGE":
        return `${coupon.discountValue}%`;
      case "FIXED_AMOUNT":
        return `${formatPrice(coupon.discountValue)}`;
      case "FREE_SHIPPING":
        return "Free Shipping";
      default:
        return "N/A";
    }
  };

  const getDiscountIcon = (type: string) => {
    switch (type) {
      case "PERCENTAGE":
        return <Percent className="w-4 h-4" />;
      case "FIXED_AMOUNT":
        return <DollarSign className="w-4 h-4" />;
      case "FREE_SHIPPING":
        return <Truck className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (coupon: Coupon) => {
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (!coupon.isActive) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-background  text-gray-800 rounded-full">
          Inactive
        </span>
      );
    }

    if (now < validFrom) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
          Scheduled
        </span>
      );
    }

    if (now > validUntil) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
          Expired
        </span>
      );
    }

    return (
      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
        Active
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading coupons: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h1 className="font-cormorant text-3xl font-bold text-foreground ">
            Coupon Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage discount coupons and promotional codes
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          className="bg-background p-6 rounded-lg shadow-sm border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Coupons
              </p>
              <p className="text-2xl font-bold text-foreground ">
                {coupons.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Percent className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-background p-6 rounded-lg shadow-sm border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Coupons
              </p>
              <p className="text-2xl font-bold text-foreground ">
                {
                  coupons.filter(
                    (c) => c.isActive && new Date(c.validUntil) > new Date()
                  ).length
                }
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <ToggleRight className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-background p-6 rounded-lg shadow-sm border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Usage
              </p>
              <p className="text-2xl font-bold text-foreground ">
                {coupons.reduce((sum, c) => sum + c.usageCount, 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-background p-6 rounded-lg shadow-sm border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Expired Coupons
              </p>
              <p className="text-2xl font-bold text-foreground ">
                {
                  coupons.filter((c) => new Date(c.validUntil) < new Date())
                    .length
                }
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <Calendar className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Coupons Table */}
      <motion.div
        className="bg-background rounded-lg shadow-sm border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Coupon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Validity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            {coupons ? (
              <tbody className="divide-y divide-cream-200">
                {coupons.map((coupon, index) => (
                  <motion.tr
                    key={coupon.id}
                    className="hover:bg-cream-50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-foreground ">
                            {coupon.code}
                          </span>
                          <button
                            onClick={() => copyCouponCode(coupon.code)}
                            className="text-muted-foreground hover:text-foreground "
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {coupon.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getDiscountIcon(coupon.discountType)}
                        <span className="font-medium">
                          {getDiscountDisplay(coupon)}
                        </span>
                      </div>
                      {coupon.minimumAmount && (
                        <p className="text-xs text-muted-foreground">
                          Min: {formatPrice(coupon.minimumAmount)}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium">{coupon.usageCount}</p>
                        {coupon.usageLimit && (
                          <p className="text-xs text-muted-foreground">
                            / {coupon.usageLimit}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <p>{new Date(coupon.validFrom).toLocaleDateString()}</p>
                        <p className="text-muted-foreground">
                          to {new Date(coupon.validUntil).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(coupon)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedCoupon(coupon)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCoupon(coupon);
                            setShowEditModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(coupon.id)}
                          className={
                            coupon.isActive
                              ? "text-green-600 hover:text-green-900"
                              : "text-gray-400 hover:text-foreground "
                          }
                        >
                          {coupon.isActive ? (
                            <ToggleRight className="w-6 h-6" />
                          ) : (
                            <ToggleLeft className="w-6 h-6" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteCoupon(coupon.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            ) : (
              <tbody className="flex items-center justify-center mt-7 h-44">
                <p className="text-display-sm">No Coupon Found</p>
              </tbody>
            )}
          </table>
        </div>
      </motion.div>

      {/* Create Coupon Modal */}
      <CreateCouponModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
