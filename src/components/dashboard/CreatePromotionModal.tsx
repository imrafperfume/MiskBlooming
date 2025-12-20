"use client";

import { useState, useRef } from "react";
import {
  X,
  Calendar as CalendarIcon,
  Upload,
  Image as ImageIcon,
  Trash2,
  Tag,
  LayoutGrid,
  ShoppingBag,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Promotion } from "@/src/app/(admin)/dashboard/promotions/page";
import { Input } from "../ui/Input";
import Button from "../ui/Button";

interface CreatePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (promo: Promotion) => void;
}

// Mock Categories for Selection
const CATEGORIES = ["Flowers", "Bouquets", "Gifts", "Cakes", "Plants"];

export function CreatePromotionModal({
  isOpen,
  onClose,
  onCreate,
}: CreatePromotionModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
    image: null as File | null,
    // New Fields for Scope
    target: "all", // all, category, product
    selectedCategories: [] as string[],
    selectedProducts: [] as string[], // IDs
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleCategory = (cat: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(cat)
        ? prev.selectedCategories.filter((c) => c !== cat)
        : [...prev.selectedCategories, cat],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.code || !formData.value) {
      alert("Please fill in all required fields");
      return;
    }

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
      bannerImage: imagePreview || "",
      scope: {
        target: formData.target as "all" | "category" | "product",
        categories: formData.selectedCategories,
        products: formData.selectedProducts,
      },
    };

    onCreate(newPromo);
    handleClose();
  };

  const handleClose = () => {
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
      image: null,
      target: "all",
      selectedCategories: [],
      selectedProducts: [],
    });
    setImagePreview(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl bg-card border border-border rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border bg-card flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold font-cormorant text-foreground">
                  Create Promotion Banner
                </h2>
                <p className="text-xs text-muted-foreground">
                  Define your discount target and homepage banner visibility.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. Banner Image Section */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Homepage Banner Image
                  </label>
                  <div
                    onClick={() =>
                      !imagePreview && fileInputRef.current?.click()
                    }
                    className={`relative min-h-[200px] border-2 border-dashed rounded-xl flex items-center justify-center bg-muted/20 cursor-pointer transition-all ${
                      imagePreview ? "border-primary" : "border-border"
                    }`}
                  >
                    {imagePreview ? (
                      <div className="w-full h-[220px] relative group">
                        <img
                          src={imagePreview}
                          className="w-full h-full object-cover rounded-lg"
                          alt="Banner"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                          <Button
                            size="sm"
                            variant="outline"
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Change
                          </Button>
                          <Button
                            size="sm"
                            className="bg-destructive text-white border-none"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImagePreview(null);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto w-10 h-10 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">
                          Upload Banner (1920x1080px)
                        </p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                {/* 2. Promotion Scope (The dynamic part) */}
                <div className="space-y-4 p-5 bg-muted/30 rounded-xl border border-border">
                  <label className="text-sm font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
                    <Tag className="w-4 h-4" /> Promotion Scope
                  </label>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "all", label: "Store-wide", icon: ShoppingBag },
                      { id: "category", label: "Categories", icon: LayoutGrid },
                      {
                        id: "product",
                        label: "Specific Products",
                        icon: Search,
                      },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, target: item.id })
                        }
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                          formData.target === item.id
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border bg-background text-muted-foreground"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="text-xs font-bold">{item.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Conditional Rendering: Categories */}
                  {formData.target === "category" && (
                    <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                      <p className="text-xs font-medium mb-2">
                        Select Categories:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => toggleCategory(cat)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                              formData.selectedCategories.includes(cat)
                                ? "bg-primary text-white border-primary"
                                : "bg-background text-foreground"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Conditional Rendering: Products */}
                  {formData.target === "product" && (
                    <div className="pt-2">
                      <Input
                        placeholder="Search and select products..."
                        className="bg-background"
                      />
                      <p className="text-[10px] text-muted-foreground mt-1 px-1">
                        * Selected products will get the discount automatically.
                      </p>
                    </div>
                  )}
                </div>

                {/* 3. Discount Config */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Campaign Name</label>
                    <Input
                      placeholder="e.g. Eid Mega Sale"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Promo Code</label>
                    <Input
                      placeholder="EID2024"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          code: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Discount Type</label>
                    <select
                      className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm"
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (AED)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Value</label>
                    <Input
                      type="number"
                      placeholder="20"
                      value={formData.value}
                      onChange={(e) =>
                        setFormData({ ...formData, value: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* 4. Limits & Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase">
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" type="button" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    variant="luxury"
                    type="submit"
                    disabled={!imagePreview}
                  >
                    Publish to Homepage
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
