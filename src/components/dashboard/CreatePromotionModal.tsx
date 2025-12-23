"use client";

import { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  Tag,
  LayoutGrid,
  ShoppingBag,
  Search,
  ImageIcon,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Promotion,
  DiscountType,
  ScopeType,
  PromotionStatus,
} from "@/src/app/(admin)/dashboard/promotions/page";
import { Input } from "../ui/Input";
import Button from "../ui/Button";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "@/src/modules/category/categoryTypes";
// import { GET_PRODUCTS } from "@/src/modules/product/productTypes"; // Assuming this exists
import { Category, Product } from "@prisma/client";
import { GET_PRODUCTS } from "@/src/modules/product/operations";

interface CreatePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (promo: Promotion) => void;
  initialData?: Promotion | null;
}

export function CreatePromotionModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: CreatePromotionModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState("");

  // Data Fetching
  const { data: catData, loading: catLoading } = useQuery(GET_CATEGORIES);
  const { data: prodData, loading: prodLoading } = useQuery(GET_PRODUCTS);

  const [formData, setFormData] = useState({
    name: "",
    promoCode: "",
    discountType: "PERCENTAGE" as DiscountType,
    discountValue: "",
    startDate: "",
    endDate: "",
    scope: "ALL" as ScopeType,
    selectedCategories: [] as string[],
    selectedProducts: [] as string[], // IDs
    status: "ACTIVE" as PromotionStatus,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        promoCode: initialData.promoCode,
        discountType: initialData.discountType,
        discountValue: initialData.discountValue.toString(),
        startDate: new Date(initialData.startDate).toISOString().split("T")[0],
        endDate: new Date(initialData.endDate).toISOString().split("T")[0],
        scope: initialData.scope,
        selectedCategories: initialData.categories || [],
        selectedProducts: initialData.products || [],
        status: initialData.status,
      });
      setImagePreview(initialData.imageUrl);
    } else {
      handleReset();
    }
  }, [initialData, isOpen]);

  // Product Selection Logic
  const filteredProducts = prodData?.products
    ?.filter(
      (p: Product) =>
        p.name.toLowerCase().includes(productSearch.toLowerCase()) &&
        !formData.selectedProducts.includes(p.id)
    )
    .slice(0, 5); // Limit results for UI cleanlines

  const toggleProduct = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedProducts: prev.selectedProducts.includes(productId)
        ? prev.selectedProducts.filter((id) => id !== productId)
        : [...prev.selectedProducts, productId],
    }));
    setProductSearch(""); // Clear search after selection
  };

  const toggleCategory = (catName: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(catName)
        ? prev.selectedCategories.filter((c) => c !== catName)
        : [...prev.selectedCategories, catName],
    }));
  };

  const handleReset = () => {
    setFormData({
      name: "",
      promoCode: "",
      discountType: "PERCENTAGE",
      discountValue: "",
      startDate: "",
      endDate: "",
      scope: "ALL",
      selectedCategories: [],
      selectedProducts: [],
      status: "ACTIVE",
    });
    setImagePreview(null);
    setProductSearch("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.promoCode || !imagePreview) return;

    onSave({
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      ...formData,
      discountValue: Number(formData.discountValue),
      startDate: formData.startDate || new Date().toISOString(),
      endDate:
        formData.endDate || new Date(Date.now() + 86400000 * 7).toISOString(),
      isActive: formData.status === "ACTIVE",
      imageUrl: imagePreview,
      categories: formData.selectedCategories,
      products: formData.selectedProducts,
    });
    handleReset();
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
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl bg-card border border-border rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border bg-card flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-2xl font-bold font-cormorant text-foreground">
                  {initialData ? "Edit Campaign" : "New Promotion"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Setup your banner and targeting rules.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-full transition-colors text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. Image Upload */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Banner Image
                  </label>
                  <div
                    onClick={() =>
                      !imagePreview && fileInputRef.current?.click()
                    }
                    className={`relative min-h-[200px] border-2 border-dashed rounded-2xl flex items-center justify-center bg-muted/20 cursor-pointer transition-all ${
                      imagePreview
                        ? "border-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {imagePreview ? (
                      <div className="w-full h-[220px] relative p-2">
                        <img
                          src={imagePreview}
                          className="w-full h-full object-cover rounded-xl"
                          alt="Preview"
                        />
                        <div className="absolute inset-0 bg-background/40 opacity-0 hover:opacity-100 flex items-center justify-center gap-2 transition-all rounded-xl">
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
                            className="bg-red-500 text-white border-none"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImagePreview(null);
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="mx-auto w-10 h-10 text-muted-foreground mb-2" />
                        <p className="text-sm font-bold text-foreground">
                          Upload Promotion Banner
                        </p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      // onChange={handleImageChange}
                    />
                  </div>
                </div>

                {/* 2. Scope & Targeting */}
                <div className="space-y-4 p-5 bg-muted/30 rounded-2xl border border-border">
                  <label className="text-sm font-bold uppercase text-primary flex items-center gap-2">
                    <Tag size={16} /> Targeting
                  </label>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "ALL", label: "Store-wide", icon: ShoppingBag },
                      { id: "CATEGORY", label: "Categories", icon: LayoutGrid },
                      { id: "PRODUCT", label: "Products", icon: Search },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            scope: item.id as ScopeType,
                          })
                        }
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                          formData.scope === item.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        <item.icon size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Product Search Interface */}
                  {formData.scope === "PRODUCT" && (
                    <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
                      <div className="relative">
                        <Search
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          size={16}
                        />
                        <Input
                          placeholder="Search products by name..."
                          className="pl-10 bg-background"
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                        />

                        {/* Search Results Dropdown */}
                        {productSearch && (
                          <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-xl shadow-xl overflow-hidden">
                            {prodLoading ? (
                              <div className="p-4 text-center text-xs text-muted-foreground">
                                Searching...
                              </div>
                            ) : filteredProducts?.length > 0 ? (
                              filteredProducts.map((p: Product) => (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => toggleProduct(p.id)}
                                  className="w-full flex items-center justify-between p-3 hover:bg-muted text-left text-sm transition-colors border-b border-border last:border-0"
                                >
                                  <span className="font-medium text-foreground">
                                    {p.name}
                                  </span>
                                  <Plus size={14} className="text-primary" />
                                </button>
                              ))
                            ) : (
                              <div className="p-4 text-center text-xs text-muted-foreground">
                                No products found
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Selected Products Area */}
                      {formData.selectedProducts.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {formData.selectedProducts.map((id) => {
                            const p = prodData?.products?.find(
                              (item: any) => item.id === id
                            );
                            return (
                              <div
                                key={id}
                                className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-primary text-xs font-bold"
                              >
                                {p?.name || "Product"}
                                <button
                                  type="button"
                                  onClick={() => toggleProduct(id)}
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Categories Selector */}
                  {formData.scope === "CATEGORY" && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {catLoading ? (
                        <div className="text-xs">Loading...</div>
                      ) : (
                        catData?.categories.map((cat: Category) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => toggleCategory(cat.name)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                              formData.selectedCategories.includes(cat.name)
                                ? "bg-primary text-secondary border-primary"
                                : "bg-background text-foreground border-border hover:border-primary"
                            }`}
                          >
                            {cat.name}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* 3. Discount Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">
                      Campaign Name
                    </label>
                    <Input
                      placeholder="Winter Sale"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">
                      Promo Code
                    </label>
                    <Input
                      placeholder="WINTER20"
                      value={formData.promoCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          promoCode: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">
                      Type
                    </label>
                    <select
                      className="w-full h-11 px-4 bg-background border border-border rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary"
                      value={formData.discountType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountType: e.target.value as DiscountType,
                        })
                      }
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED">Fixed (AED)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">
                      Value
                    </label>
                    <Input
                      type="number"
                      placeholder="20"
                      value={formData.discountValue}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountValue: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* 4. Dates & Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-border pt-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground">
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
                    <label className="text-xs font-bold text-muted-foreground">
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
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground">
                      Initial Status
                    </label>
                    <select
                      className="w-full h-11 px-4 bg-background border border-border rounded-xl text-sm"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as PromotionStatus,
                        })
                      }
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="PAUSED">Paused</option>
                    </select>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <Button variant="outline" type="button" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    variant="luxury"
                    type="submit"
                    disabled={!imagePreview || !formData.name}
                  >
                    {initialData ? "Update Campaign" : "Launch Campaign"}
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
