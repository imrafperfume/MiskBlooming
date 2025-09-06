"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { motion } from "framer-motion";
import { X, Calendar, Users, Percent, DollarSign, Truck } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { CREATE_COUPON } from "@/src/modules/coupon/operations";
import { toast } from "sonner";
import type { CreateCouponInput } from "@/src/types/coupon";

interface CreateCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateCouponModal({ isOpen, onClose, onSuccess }: CreateCouponModalProps) {
  const [createCoupon, { loading }] = useMutation(CREATE_COUPON);
  
  const [formData, setFormData] = useState<CreateCouponInput>({
    code: "",
    name: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: 0,
    minimumAmount: 0,
    maximumDiscount: 0,
    usageLimit: 0,
    userUsageLimit: 1,
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    applicableProducts: [],
    applicableCategories: [],
    applicableUsers: [],
    newUsersOnly: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convert date strings to ISO DateTime strings
      const inputData = {
        ...formData,
        validFrom: new Date(formData.validFrom).toISOString(),
        validUntil: new Date(formData.validUntil).toISOString(),
      };

      await createCoupon({
        variables: { input: inputData },
      });
      
      toast.success("Coupon created successfully!");
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        code: "",
        name: "",
        description: "",
        discountType: "PERCENTAGE",
        discountValue: 0,
        minimumAmount: 0,
        maximumDiscount: 0,
        usageLimit: 0,
        userUsageLimit: 1,
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        applicableProducts: [],
        applicableCategories: [],
        applicableUsers: [],
        newUsersOnly: false,
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleInputChange = (field: keyof CreateCouponInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-charcoal-900">Create New Coupon</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-charcoal-900"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-charcoal-900">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-900 mb-2">
                    Coupon Code *
                  </label>
                  <Input
                    type="text"
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
                    placeholder="e.g., WELCOME10"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-charcoal-900 mb-2">
                    Coupon Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Welcome Discount"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-900 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe the coupon..."
                  className="w-full px-3 py-2 border border-cream-400 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>

            {/* Discount Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-charcoal-900">Discount Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-900 mb-2">
                    Discount Type *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => handleInputChange("discountType", e.target.value)}
                    className="w-full px-3 py-2 border border-cream-400 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
                    required
                  >
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="FIXED_AMOUNT">Fixed Amount</option>
                    <option value="FREE_SHIPPING">Free Shipping</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal-900 mb-2">
                    Discount Value *
                  </label>
                  <Input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => handleInputChange("discountValue", parseFloat(e.target.value) || 0)}
                    placeholder={formData.discountType === "PERCENTAGE" ? "10" : "20"}
                    min="0"
                    step={formData.discountType === "PERCENTAGE" ? "1" : "0.01"}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-900 mb-2">
                    Minimum Order Amount
                  </label>
                  <Input
                    type="number"
                    value={formData.minimumAmount}
                    onChange={(e) => handleInputChange("minimumAmount", parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>

                {formData.discountType === "PERCENTAGE" && (
                  <div>
                    <label className="block text-sm font-medium text-charcoal-900 mb-2">
                      Maximum Discount Amount
                    </label>
                    <Input
                      type="number"
                      value={formData.maximumDiscount}
                      onChange={(e) => handleInputChange("maximumDiscount", parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Usage Limits */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-charcoal-900">Usage Limits</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-900 mb-2">
                    Total Usage Limit
                  </label>
                  <Input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => handleInputChange("usageLimit", parseInt(e.target.value) || 0)}
                    placeholder="0 (unlimited)"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal-900 mb-2">
                    Per User Usage Limit
                  </label>
                  <Input
                    type="number"
                    value={formData.userUsageLimit}
                    onChange={(e) => handleInputChange("userUsageLimit", parseInt(e.target.value) || 1)}
                    placeholder="1"
                    min="1"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="newUsersOnly"
                  checked={formData.newUsersOnly}
                  onChange={(e) => handleInputChange("newUsersOnly", e.target.checked)}
                  className="rounded border-cream-400 text-luxury-500 focus:ring-luxury-500"
                />
                <label htmlFor="newUsersOnly" className="text-sm font-medium text-charcoal-900">
                  Only for new users
                </label>
              </div>
            </div>

            {/* Validity Period */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-charcoal-900">Validity Period</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-900 mb-2">
                    Valid From *
                  </label>
                  <Input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => handleInputChange("validFrom", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal-900 mb-2">
                    Valid Until *
                  </label>
                  <Input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => handleInputChange("validUntil", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <span>Create Coupon</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
