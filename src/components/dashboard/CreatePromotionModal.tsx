"use client";

import { useState } from "react";
import { X, Calendar as CalendarIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Promotion } from "@/src/app/(admin)/dashboard/promotions/page";
import { Input } from "../ui/Input";
import Button from "../ui/Button";

interface CreatePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (promo: Promotion) => void;
}

export function CreatePromotionModal({
  isOpen,
  onClose,
  onCreate,
}: CreatePromotionModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "percentage",
    value: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    minOrderValue: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.name || !formData.code || !formData.value) return;

    const newPromo: Promotion = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      code: formData.code.toUpperCase(),
      type: formData.type as any,
      value: Number(formData.value),
      startDate: formData.startDate || new Date().toISOString(),
      endDate:
        formData.endDate || new Date(Date.now() + 86400000 * 7).toISOString(),
      usageLimit: Number(formData.usageLimit) || 100,
      minOrderValue: Number(formData.minOrderValue) || 0,
      description: formData.description,
      status: "active",
      usageCount: 0,
      revenue: 0,
    };

    onCreate(newPromo);
    // Reset form
    setFormData({
      name: "",
      code: "",
      type: "percentage",
      value: "",
      startDate: "",
      endDate: "",
      usageLimit: "",
      minOrderValue: "",
      description: "",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            // Important: removed fixed positioning here in favor of flex centering from parent container
            className="relative w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-card sticky top-0 z-10">
              <h2 className="text-2xl font-bold font-cormorant text-foreground">
                Create New Promotion
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Campaign Name
                    </label>
                    <Input
                      placeholder="e.g. Summer Sale"
                      value={formData.name}
                      onChange={(e: any) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Promo Code
                    </label>
                    <Input
                      placeholder="e.g. SUMMER20"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          code: e.target.value.toUpperCase(),
                        })
                      }
                      className="uppercase font-mono bg-background"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Description
                  </label>
                  <textarea
                    className="w-full min-h-[80px] px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none placeholder:text-muted-foreground"
                    placeholder="Describe the offer details..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                {/* Offer Details */}
                <div className="p-4 bg-muted/30 rounded-lg border border-border/50 space-y-4">
                  <h3 className="font-semibold text-foreground text-sm">
                    Discount Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Type
                      </label>
                      <select
                        className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                      >
                        <option value="percentage">
                          Percentage Discount (%)
                        </option>
                        <option value="fixed">Fixed Amount (AED)</option>
                        <option value="buy_x_get_y">Buy X Get Y</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Value
                      </label>
                      <Input
                        type="number"
                        placeholder={
                          formData.type === "percentage" ? "20" : "50"
                        }
                        value={formData.value}
                        onChange={(e) =>
                          setFormData({ ...formData, value: e.target.value })
                        }
                        required
                        className="bg-background"
                      />
                    </div>
                  </div>
                </div>

                {/* Limits & Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Min. Order (AED)
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.minOrderValue}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minOrderValue: e.target.value,
                        })
                      }
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Usage Limit
                    </label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={formData.usageLimit}
                      onChange={(e) =>
                        setFormData({ ...formData, usageLimit: e.target.value })
                      }
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Start Date
                    </label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="date"
                        className="pl-10 bg-background"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            startDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      End Date
                    </label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="date"
                        className="pl-10 bg-background"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t border-border mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="bg-background"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="luxury">
                    Create Promotion
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
