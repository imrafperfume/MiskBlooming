"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../../../../../components/ui/Button";
import {
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle,
  Loader2,
  DollarSign,
  Package,
  Truck,
  Globe,
  FileText,
  Sparkles,
  ImageIcon,
  Cloud,
  Layers,
  X,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_PRODUCT,
  GET_PRODUCT_BY_SLUG,
  UPDATE_PRODUCT,
} from "@/src/modules/product/operations";
import BasicInfoTab from "@/src/components/dashboard/tabs/addProductTabs/BasicInfoTab";
import PricingTab from "@/src/components/dashboard/tabs/addProductTabs/PricingTab";
import InventoryTab from "@/src/components/dashboard/tabs/addProductTabs/InventoryTab";
import ImagesTab from "@/src/components/dashboard/tabs/addProductTabs/ImagesTab";
import SEOTab from "@/src/components/dashboard/tabs/addProductTabs/SEOTab";
import DeliveryTab from "@/src/components/dashboard/tabs/addProductTabs/DeliveryTab";
import FeaturesTab from "@/src/components/dashboard/tabs/addProductTabs/FeaturesTab";
import VariantsTab from "@/src/components/product/VariantsTab";
import { toast } from "sonner";
import { useCategories } from "@/src/hooks/useCategories";
import { cn } from "@/src/lib/utils";

// --- Types (Kept same as provided) ---
interface CloudinaryImage {
  url: string;
  publicId: string;
}
export interface VariantOption {
  id: string;
  name: string;
  values: string[];
}
export interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  price: number;
  stock: number;
  options: Record<string, string>;
}
export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  subcategory: string;
  tags: string[];
  price: number;
  compareAtPrice: number;
  costPerItem: number;
  sku: string;
  barcode: string;
  trackQuantity: boolean;
  quantity: number;
  lowStockThreshold: number;
  requiresShipping: boolean;
  dimensions: {
    weight: number;
    length: number;
    width: number;
    height: number;
  };
  images: CloudinaryImage[];
  featuredImage: number;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  status: "draft" | "active" | "archived";
  featured: boolean;
  deliveryZones: string[];
  deliveryTime: string;
  freeDeliveryThreshold: number;
  giftWrapping: boolean;
  personalization: boolean;
  careInstructions: string;
  occasions: string[];
  hasVariants: boolean;
  variantOptions: VariantOption[];
  // variants: ProductVariant[];
}

const initialFormData: ProductFormData = {
  name: "",
  slug: "",
  description: "",
  shortDescription: "",
  category: "",
  subcategory: "",
  tags: [],
  price: 0,
  compareAtPrice: 0,
  costPerItem: 0,
  sku: "",
  barcode: "",
  trackQuantity: true,
  quantity: 0,
  lowStockThreshold: 5,
  requiresShipping: true,
  dimensions: { weight: 0, length: 0, width: 0, height: 0 },
  images: [],
  featuredImage: 0,
  seoTitle: "",
  seoDescription: "",
  seoKeywords: [],
  status: "draft",
  featured: false,
  deliveryZones: [],
  deliveryTime: "same-day",
  freeDeliveryThreshold: 100,
  giftWrapping: true,
  personalization: true,
  careInstructions: "",
  occasions: [],
  hasVariants: false,
  variantOptions: [],
  // variants: [],
};

const occasionsList = [
  "Birthday",
  "Anniversary",
  "Wedding",
  "Valentine's Day",
  "Mother's Day",
  "Father's Day",
  "Graduation",
  "New Baby",
  "Sympathy",
  "Get Well Soon",
  "Thank You",
  "Congratulations",
  "Apology",
  "Just Because",
];

const deliveryZones = [
  "Dubai Marina",
  "Downtown Dubai",
  "Jumeirah",
  "Business Bay",
  "DIFC",
  "Palm Jumeirah",
  "JBR",
  "Al Barsha",
  "City Walk",
  "Deira",
  "Bur Dubai",
  "Karama",
  "Satwa",
  "Al Wasl",
  "Umm Suqeim",
];

const deliveryTimes = [
  { value: "same-day", label: "Same Day (2-4 hours)" },
  { value: "next-day", label: "Next Day" },
  { value: "express", label: "Express (1 hour)" },
  { value: "scheduled", label: "Scheduled Delivery" },
];

export default function AddProductPage() {
  const params = useSearchParams();
  const slug = params.get("slug");
  const router = useRouter();

  // State
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [activeTab, setActiveTab] = useState("basic");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [newTag, setNewTag] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  // Data Fetching
  const { data: categories } = useCategories([
    "id",
    "name",
    "description",
    "subcategories {id name}",
  ]);
  const [createProduct] = useMutation<ProductFormData>(CREATE_PRODUCT);
  const [updateProduct, { loading: updateLoading }] =
    useMutation(UPDATE_PRODUCT);

  const { data: editData, loading: queryLoading } = useQuery(
    GET_PRODUCT_BY_SLUG,
    {
      variables: { slug: slug },
      skip: !slug,
    }
  );

  // Populate form for editing
  useEffect(() => {
    if (editData?.productBySlug) {
      setFormData(editData.productBySlug);
    }
  }, [editData]);

  // Prevent accidental navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Utility Functions
  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const generateSKU = (name: string, category: string) => {
    const nameCode = name.substring(0, 3).toUpperCase();
    const categoryCode = category.substring(0, 2).toUpperCase();
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `MB-${categoryCode}${nameCode}-${randomNum}`;
  };

  const generateUniqueBarcode = (length: number = 6) => {
    const timestamp = Date.now().toString();
    let randomPart = "";
    const digits = "0123456789";
    for (let i = 0; i < length; i++)
      randomPart += digits.charAt(Math.floor(Math.random() * digits.length));
    return timestamp.slice(-6) + randomPart;
  };

  // Handlers
  const handleInputChange = useCallback(
    (field: keyof ProductFormData, value: any) => {
      setIsDirty(true);
      setFormData((prev) => {
        const updated = { ...prev, [field]: value };

        if (field === "name" && value) {
          updated.slug = generateSlug(value);
          updated.seoTitle = value;
          if (!prev.sku)
            updated.sku = generateSKU(value, prev.category || "GEN");
          if (!prev.barcode) updated.barcode = generateUniqueBarcode();
        }

        if (field === "category" && value && prev.name) {
          if (!prev.sku || prev.sku.startsWith("MB-"))
            updated.sku = generateSKU(prev.name, value);
          updated.subcategory = "";
        }
        return updated;
      });

      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleDimensionChange = (
    dim: "weight" | "length" | "width" | "height",
    value: number
  ) => {
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      dimensions: { ...prev.dimensions, [dim]: value },
    }));
  };

  // Tag & Keyword Management
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange("tags", [...formData.tags, newTag.trim()]);
      setNewTag("");
    }
  };
  const removeTag = (t: string) =>
    handleInputChange(
      "tags",
      formData.tags.filter((tag) => tag !== t)
    );

  const addKeyword = () => {
    if (
      newKeyword.trim() &&
      !formData.seoKeywords.includes(newKeyword.trim())
    ) {
      handleInputChange("seoKeywords", [
        ...formData.seoKeywords,
        newKeyword.trim(),
      ]);
      setNewKeyword("");
    }
  };
  const removeKeyword = (k: string) =>
    handleInputChange(
      "seoKeywords",
      formData.seoKeywords.filter((key) => key !== k)
    );

  // Arrays Management
  const toggleOccasion = (occ: string) => {
    const exists = formData.occasions.includes(occ);
    handleInputChange(
      "occasions",
      exists
        ? formData.occasions.filter((o) => o !== occ)
        : [...formData.occasions, occ]
    );
  };

  const toggleDeliveryZone = (zone: string) => {
    const exists = formData.deliveryZones.includes(zone);
    handleInputChange(
      "deliveryZones",
      exists
        ? formData.deliveryZones.filter((z) => z !== zone)
        : [...formData.deliveryZones, zone]
    );
  };

  const handleImagesUploaded = (
    newImages: Array<{ url: string; publicId: string }>
  ) => {
    setIsDirty(true);
    const cloudinaryImages = newImages.map((img) => ({
      url: img.url,
      publicId: img.publicId,
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...cloudinaryImages],
      // Reset featured if invalid
      featuredImage:
        prev.featuredImage < prev.images.length + cloudinaryImages.length
          ? prev.featuredImage
          : 0,
    }));

    if (errors.images)
      setErrors((prev) => {
        const n = { ...prev };
        delete n.images;
        return n;
      });
  };

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.slug.trim()) newErrors.slug = "Product slug is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (formData.price <= 0) newErrors.price = "Price > 0 required";
    if (formData.images.length === 0) newErrors.images = "Image required";
    if (!formData.sku.trim()) newErrors.sku = "SKU required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix validation errors before saving.");
      return false;
    }
    return true;
  };

  // Submits
  const handleSave = async (status: "draft" | "active" = "draft") => {
    if (!validateForm()) {
      setSaveStatus("error");
      return;
    }
    console.log(formData);
    setSaveStatus("saving");
    try {
      const productData = {
        ...formData,
        status,
        id: formData.sku || `MB-${Date.now()}`, // Fallback ID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      console.log("🚀 ~ handleSave ~ productData:", productData);

      const res = await createProduct({ variables: { data: productData } });

      if (res.errors) throw new Error(res.errors[0].message);

      toast.success(
        `Product ${status === "active" ? "published" : "saved"} successfully!`
      );
      setSaveStatus("saved");
      setIsDirty(false);

      if (status === "active") router.push("/dashboard/products");
    } catch (error: any) {
      console.error(error);
      setSaveStatus("error");
      toast.error(error?.message || "Failed to save product");
    } finally {
      setTimeout(
        () => setSaveStatus((prev) => (prev === "saved" ? "idle" : prev)),
        3000
      );
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    setSaveStatus("saving");

    try {
      // Construct clean payload (omit __typename, etc if needed by GQL)
      const { ...cleanData } = formData;

      await updateProduct({ variables: { slug, data: cleanData } });

      toast.success("Product updated successfully");
      setSaveStatus("saved");
      setIsDirty(false);
      router.push("/dashboard/products");
    } catch (error: any) {
      setSaveStatus("error");
      toast.error(error?.message || "Update failed");
    }
  };

  // Tab Config
  const tabs = [
    {
      id: "basic",
      label: "Basic Info",
      icon: FileText,
      error: !!(errors.name || errors.description || errors.category),
    },
    {
      id: "pricing",
      label: "Pricing",
      icon: DollarSign,
      error: !!(errors.price || errors.compareAtPrice),
    },
    { id: "variants", label: "Variants", icon: Layers, error: false },
    {
      id: "inventory",
      label: "Inventory",
      icon: Package,
      error: !!(errors.sku || errors.quantity),
    },
    { id: "images", label: "Images", icon: ImageIcon, error: !!errors.images },
    {
      id: "seo",
      label: "SEO",
      icon: Globe,
      error: !!(errors.seoTitle || errors.seoDescription),
    },
    {
      id: "delivery",
      label: "Delivery",
      icon: Truck,
      error: !!errors.deliveryZones,
    },
    { id: "features", label: "Features", icon: Sparkles, error: false },
  ];

  const categoryObj = categories?.find(
    (cat: any) => cat.name === formData.category
  );

  return (
    <Suspense
      fallback={
        <div className="flex h-[50vh] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <div className="min-h-screen w-full bg-background pb-20 text-foreground transition-colors duration-300">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 mb-8 w-full border-b border-border bg-background/80 px-6 py-4 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <div className="hidden md:block">
                <div className="flex items-center gap-2">
                  <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                    {slug ? "Edit Product" : "New Product"}
                  </h1>
                  {isDirty && (
                    <span className="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      Unsaved Changes
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {slug
                    ? `Editing: ${formData.name}`
                    : "Fill in the details to create a new product"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Status Indicators */}
              <AnimatePresence mode="wait">
                {saveStatus === "saving" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mr-2 flex items-center text-sm text-primary"
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </motion.div>
                )}
                {saveStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mr-2 flex items-center text-sm text-destructive"
                  >
                    <AlertCircle className="mr-2 h-4 w-4" /> Failed
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                variant="outline"
                onClick={() => handleSave("draft")}
                disabled={saveStatus === "saving"}
                className="hidden sm:flex border-border bg-background hover:bg-muted"
              >
                Save Draft
              </Button>

              {slug ? (
                <Button
                  onClick={handleUpdate}
                  disabled={
                    saveStatus === "saving" || queryLoading || updateLoading
                  }
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {updateLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Update Product"
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => handleSave("active")}
                  disabled={saveStatus === "saving"}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Publish
                </Button>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6">
          {/* Error Summary Banner */}
          <AnimatePresence>
            {Object.keys(errors).length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 rounded-lg border border-destructive/20 bg-destructive/5 p-4"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />
                  <div>
                    <h3 className="font-semibold text-destructive">
                      Validation Errors
                    </h3>
                    <ul className="mt-1 list-disc pl-5 text-sm text-destructive/80">
                      {Object.values(errors).map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setErrors({})}
                    className="ml-auto h-6 w-6 text-destructive/60 hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-3">
              <nav className="sticky top-28 space-y-1 rounded-xl border border-border bg-card p-2 shadow-sm">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={cn(
                            "h-4 w-4",
                            isActive
                              ? "text-primary-foreground"
                              : "text-muted-foreground group-hover:text-foreground"
                          )}
                        />
                        {tab.label}
                      </div>
                      {tab.error && (
                        <div className="h-2 w-2 rounded-full bg-destructive" />
                      )}
                      {!tab.error && isActive && (
                        <ChevronRight className="h-4 w-4 opacity-50" />
                      )}
                    </button>
                  );
                })}

                <div className="mt-4 px-3 pt-4 border-t border-border">
                  <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                    <span>Completion</span>
                    <span>
                      {Math.round(
                        (tabs.filter((t) => !t.error).length / tabs.length) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all duration-500 ease-out"
                      style={{
                        width: `${
                          (tabs.filter((t) => !t.error).length / tabs.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </nav>
            </aside>

            {/* Content Area */}
            <div className="lg:col-span-9">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="min-h-[600px] rounded-xl border border-border bg-card p-6 shadow-sm md:p-8"
              >
                {activeTab === "basic" && (
                  <BasicInfoTab
                    formData={formData}
                    handleInputChange={handleInputChange}
                    errors={errors}
                    categories={categories}
                    selectedCategory={
                      categoryObj
                        ? {
                            id: categoryObj.id,
                            name: categoryObj.name,
                            desription: (categoryObj as any).description,
                            subcategories: categoryObj.subcategories?.map(
                              (s: any) => s.name
                            ),
                          }
                        : undefined
                    }
                    removeTag={removeTag}
                    newTag={newTag}
                    setNewTag={setNewTag}
                    addTag={addTag}
                  />
                )}

                {activeTab === "pricing" && (
                  <PricingTab
                    formData={formData}
                    handleInputChange={handleInputChange}
                    errors={errors}
                  />
                )}

                {activeTab === "variants" && (
                  <VariantsTab
                    formData={formData}
                    handleInputChange={handleInputChange}
                    errors={errors}
                  />
                )}

                {activeTab === "inventory" && (
                  <InventoryTab
                    formData={formData}
                    handleInputChange={handleInputChange}
                    errors={errors}
                    handleDimensionChange={handleDimensionChange}
                  />
                )}

                {activeTab === "images" && (
                  <ImagesTab
                    formData={formData}
                    handleInputChange={handleInputChange}
                    errors={errors}
                    handleImagesUploaded={handleImagesUploaded}
                  />
                )}

                {activeTab === "seo" && (
                  <SEOTab
                    formData={formData}
                    handleInputChange={handleInputChange}
                    errors={errors}
                    removeKeyword={removeKeyword}
                    newKeyword={newKeyword}
                    addKeyword={addKeyword}
                    setNewKeyword={setNewKeyword}
                  />
                )}

                {activeTab === "delivery" && (
                  <DeliveryTab
                    formData={formData}
                    handleInputChange={handleInputChange}
                    errors={errors}
                    deliveryTimes={deliveryTimes}
                    deliveryZones={deliveryZones}
                    toggleDeliveryZone={toggleDeliveryZone}
                  />
                )}

                {activeTab === "features" && (
                  <FeaturesTab
                    formData={formData}
                    handleInputChange={handleInputChange}
                    occasionsList={occasionsList}
                    toggleOccasion={toggleOccasion}
                  />
                )}
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </Suspense>
  );
}
