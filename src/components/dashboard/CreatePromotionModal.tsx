"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  X,
  Tag,
  LayoutGrid,
  ShoppingBag,
  Search,
  ImageIcon,
  Plus,
  Loader2,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@apollo/client";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import Image from "next/image";

// --- Imports ---
import { Input } from "../ui/input";
import Button from "../ui/button";
import { GET_CATEGORIES } from "@/src/modules/category/categoryTypes";
import { GET_PRODUCTS } from "@/src/modules/product/operations";
import { uploadToCloudinary } from "@/src/lib/cloudinary";
import { Category, Product } from "@prisma/client";

// --- Types matching Prisma Enums ---
export type DiscountType = "PERCENTAGE" | "FIXED";
export type ScopeType = "ALL" | "CATEGORY" | "PRODUCT";
export type PromotionStatus = "ACTIVE" | "EXPIRED" | "PAUSED" | "DRAFT";

// Input type for your Mutation
export interface PromotionInput {
  id?: string;
  name: string;
  promoCode: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: string; // ISO String
  endDate: string; // ISO String
  scope: ScopeType;
  status: PromotionStatus;
  isActive: boolean;
  imageUrl: string;
  categories: string[];
  products: string[];
}

interface CreatePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onSave now expects the formatted Input type
  onSave: (promo: PromotionInput) => Promise<void> | void;
  initialData?: PromotionInput | null;
}

// --- Zod Validation Schema ---
const promotionSchema = z
  .object({
    name: z.string().min(3, "Campaign name is required"),
    promoCode: z
      .string()
      .min(3, "Code must be 3+ chars")
      .regex(/^[A-Z0-9_-]+$/, "Alphanumeric, uppercase only"),
    discountType: z.enum(["PERCENTAGE", "FIXED"]),
    discountValue: z.coerce
      .number()
      .min(1, "Value must be positive")
      .max(100000, "Value too high"),
    startDate: z.string().min(1, "Start date required"),
    endDate: z.string().min(1, "End date required"),
    scope: z.enum(["ALL", "CATEGORY", "PRODUCT"]),
    selectedCategories: z.array(z.string()),
    selectedProducts: z.array(z.string()),
    status: z.enum(["ACTIVE", "PAUSED", "EXPIRED", "DRAFT"]),
    imageUrl: z.string().min(1, "Banner image is required"),
  })
  .refine(
    (data) => {
      return new Date(data.endDate) >= new Date(data.startDate);
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

type PromotionFormValues = z.infer<typeof promotionSchema>;

export function CreatePromotionModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: CreatePromotionModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  // UI States
  const [productSearch, setProductSearch] = useState("");
  const [debouncedSearch] = useDebounce(productSearch, 300);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Data Fetching
  const { data: catData, loading: catLoading } = useQuery(GET_CATEGORIES, {
    skip: !isOpen,
  });
  const { data: prodData, loading: prodLoading } = useQuery(GET_PRODUCTS, {
    skip: !isOpen,
  });

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      name: "",
      promoCode: "",
      discountType: "PERCENTAGE",
      discountValue: 0,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 86400000 * 7).toISOString().split("T")[0],
      scope: "ALL",
      selectedCategories: [],
      selectedProducts: [],
      status: "ACTIVE",
      imageUrl: "",
    },
  });

  const scope = watch("scope");
  const imageUrl = watch("imageUrl");
  const selectedProducts = watch("selectedProducts");
  const selectedCategories = watch("selectedCategories");

  // Reset Logic
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Ensure dates are formatted for Input type="date" (YYYY-MM-DD)
        const startString = new Date(initialData.startDate)
          .toISOString()
          .split("T")[0];
        const endString = new Date(initialData.endDate)
          .toISOString()
          .split("T")[0];

        reset({
          name: initialData.name,
          promoCode: initialData.promoCode,
          discountType: initialData.discountType,
          discountValue: initialData.discountValue,
          startDate: startString,
          endDate: endString,
          scope: initialData.scope,
          selectedCategories: initialData.categories || [],
          selectedProducts: initialData.products || [],
          status: initialData.status,
          imageUrl: initialData.imageUrl,
        });
      } else {
        reset({
          name: "",
          promoCode: "",
          discountType: "PERCENTAGE",
          discountValue: 0,
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 86400000 * 7)
            .toISOString()
            .split("T")[0],
          scope: "ALL",
          selectedCategories: [],
          selectedProducts: [],
          status: "ACTIVE",
          imageUrl: "",
        });
      }
    }
  }, [isOpen, initialData, reset]);

  // Click Outside Handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter Products
  const filteredProducts = useMemo(() => {
    if (!prodData?.products) return [];
    const searchLower = debouncedSearch.toLowerCase();
    return prodData.products
      .filter(
        (p: Product) =>
          p.name.toLowerCase().includes(searchLower) &&
          !selectedProducts.includes(p.id)
      )
      .slice(0, 5);
  }, [prodData, debouncedSearch, selectedProducts]);

  // Handlers
  const handleProductSelect = (productId: string) => {
    setValue("selectedProducts", [...selectedProducts, productId], {
      shouldValidate: true,
    });
    setProductSearch("");
  };

  const handleProductRemove = (productId: string) => {
    setValue(
      "selectedProducts",
      selectedProducts.filter((id) => id !== productId),
      { shouldValidate: true }
    );
  };

  const handleCategoryToggle = (catName: string) => {
    const current = selectedCategories;
    const next = current.includes(catName)
      ? current.filter((c) => c !== catName)
      : [...current, catName];
    setValue("selectedCategories", next, { shouldValidate: true });
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      toast.loading("Uploading image...");

      const result = await uploadToCloudinary(file, {
        folder: "promotions/banners",
        tags: ["promo", "banner"],
      });

      setValue("imageUrl", result.secure_url, { shouldValidate: true });
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Upload failed");
    } finally {
      setIsUploading(false);
      toast.dismiss();
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: PromotionFormValues) => {
    try {
      setIsSubmitting(true);

      // --- DATA TRANSFORMATION FOR PRISMA ---
      const formattedData: PromotionInput = {
        id: initialData?.id,
        name: data.name,
        promoCode: data.promoCode,
        discountType: data.discountType,
        discountValue: Number(data.discountValue),
        // Convert YYYY-MM-DD to ISO-8601 DateTime
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        scope: data.scope,
        status: data.status,
        // Sync Boolean with Enum
        isActive: data.status === "ACTIVE",
        imageUrl: data.imageUrl,
        categories: data.selectedCategories,
        products: data.selectedProducts,
      };

      await onSave(formattedData);
      onClose();
    } catch (error) {
      console.error("Submission error", error);
      toast.error("Failed to save promotion");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
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
                  Configure your banner, discount rules, and targeting.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-full transition-colors text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* 1. Image Upload Section */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Banner Image <span className="text-red-500">*</span>
                    </label>
                    {errors.imageUrl && (
                      <span className="text-xs text-red-500 font-medium">
                        {errors.imageUrl.message}
                      </span>
                    )}
                  </div>

                  <div
                    onClick={() =>
                      !imageUrl && !isUploading && fileInputRef.current?.click()
                    }
                    className={`relative min-h-[200px] border-2 border-dashed rounded-2xl flex items-center justify-center transition-all overflow-hidden ${
                      imageUrl
                        ? "border-primary bg-background"
                        : "border-border bg-muted/20 hover:border-primary/50 cursor-pointer"
                    } ${
                      errors.imageUrl ? "border-red-500/50 bg-red-500/5" : ""
                    }`}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="text-xs text-muted-foreground">
                          Uploading...
                        </span>
                      </div>
                    ) : imageUrl ? (
                      <div className="w-full h-[220px] relative group">
                        <Image
                          src={imageUrl}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-all duration-200">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                          >
                            Change
                          </Button>
                          <Button
                            size="sm"
                            type="button"
                            className="bg-red-500 hover:bg-red-600 text-white border-none"
                            onClick={(e) => {
                              e.stopPropagation();
                              setValue("imageUrl", "");
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-6">
                        <ImageIcon className="mx-auto w-10 h-10 text-muted-foreground mb-2" />
                        <p className="text-sm font-bold text-foreground">
                          Click to Upload Banner
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Recommended size: 1200x600px
                        </p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onUpload}
                    />
                  </div>
                </div>

                {/* 2. Scope & Targeting */}
                <div className="space-y-4 p-5 bg-muted/30 rounded-2xl border border-border">
                  <label className="text-sm font-bold uppercase text-primary flex items-center gap-2">
                    <Tag size={16} /> Targeting Scope
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
                        onClick={() => setValue("scope", item.id as ScopeType)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                          scope === item.id
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:bg-background/80"
                        }`}
                      >
                        <item.icon size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="min-h-[60px] relative">
                    {scope === "CATEGORY" && (
                      <div className="animate-in fade-in slide-in-from-top-1">
                        <div className="flex flex-wrap gap-2">
                          {catLoading ? (
                            <span className="text-xs text-muted-foreground">
                              Loading categories...
                            </span>
                          ) : (
                            catData?.categories.map((cat: Category) => (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => handleCategoryToggle(cat.name)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                  selectedCategories.includes(cat.name)
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background text-foreground border-border hover:border-primary/50"
                                }`}
                              >
                                {cat.name}
                              </button>
                            ))
                          )}
                        </div>
                        {selectedCategories.length === 0 && (
                          <p className="text-xs text-red-500 mt-2">
                            Select at least one category.
                          </p>
                        )}
                      </div>
                    )}

                    {scope === "PRODUCT" && (
                      <div
                        ref={searchDropdownRef}
                        className="space-y-3 animate-in fade-in slide-in-from-top-1"
                      >
                        <div className="relative">
                          <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            size={16}
                          />
                          <Input
                            placeholder="Search products..."
                            className="pl-10 bg-background"
                            value={productSearch}
                            onChange={(e) => {
                              setProductSearch(e.target.value);
                              setIsSearchOpen(true);
                            }}
                            onFocus={() => setIsSearchOpen(true)}
                          />

                          {isSearchOpen && productSearch && (
                            <div className="absolute z-20 w-full mt-1 bg-background border border-border rounded-xl shadow-xl overflow-hidden max-h-[200px] overflow-y-auto">
                              {prodLoading ? (
                                <div className="p-4 text-center text-xs text-muted-foreground">
                                  Loading...
                                </div>
                              ) : filteredProducts?.length > 0 ? (
                                filteredProducts.map((p: Product) => (
                                  <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => handleProductSelect(p.id)}
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

                        <div className="flex flex-wrap gap-2">
                          {selectedProducts.map((id) => {
                            const p = prodData?.products?.find(
                              (item: any) => item.id === id
                            );
                            return (
                              <div
                                key={id}
                                className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-md text-primary text-xs font-bold"
                              >
                                <span>{p?.name || "Loading..."}</span>
                                <button
                                  type="button"
                                  onClick={() => handleProductRemove(id)}
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Discount Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">
                      Campaign Name
                    </label>
                    <Input
                      {...register("name")}
                      placeholder="e.g., Winter Sale"
                      error={errors.name?.message}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">
                      Promo Code
                    </label>
                    <Input
                      {...register("promoCode")}
                      placeholder="WINTER20"
                      error={errors.promoCode?.message}
                      onChange={(e) =>
                        setValue("promoCode", e.target.value.toUpperCase())
                      }
                    />
                    {errors.promoCode && (
                      <p className="text-xs text-red-500">
                        {errors.promoCode.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">
                      Discount Type
                    </label>
                    <select
                      {...register("discountType")}
                      className="w-full h-11 px-4 bg-background border border-border rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED">Fixed Amount (AED)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">
                      Value
                    </label>
                    <Input
                      type="number"
                      {...register("discountValue")}
                      placeholder="20"
                      error={errors.discountValue?.message}
                    />
                    {errors.discountValue && (
                      <p className="text-xs text-red-500">
                        {errors.discountValue.message}
                      </p>
                    )}
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
                      {...register("startDate")}
                      error={errors.startDate?.message}
                    />
                    {errors.startDate && (
                      <p className="text-xs text-red-500">
                        {errors.startDate.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground">
                      End Date
                    </label>
                    <Input
                      type="date"
                      {...register("endDate")}
                      error={errors.endDate?.message}
                    />
                    {errors.endDate && (
                      <p className="text-xs text-red-500">
                        {errors.endDate.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground">
                      Status
                    </label>
                    <div className="relative">
                      <select
                        {...register("status")}
                        className="w-full h-11 px-4 bg-background border border-border rounded-xl text-sm appearance-none outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="PAUSED">Paused</option>
                        <option value="EXPIRED">Expired</option>
                        <option value="DRAFT">Draft</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                        <Tag size={12} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-4 border-t border-border mt-auto">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="luxury"
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="min-w-[140px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : initialData ? (
                      "Update Campaign"
                    ) : (
                      "Launch Campaign"
                    )}
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
