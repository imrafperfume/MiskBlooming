"use client";

import { Suspense, useEffect, useState } from "react";
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
} from "lucide-react";
import { motion } from "framer-motion";
import type { getResponsiveImageUrls } from "../../../../../lib/cloudinary";
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
import { toast } from "sonner";
import { useCategories } from "@/src/hooks/useCategories";
import { Category } from "@/src/types";
interface CloudinaryImage {
  url: string;
  publicId: string;
}

export interface ProductFormData {
  // Basic Information
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  subcategory: string;
  tags: string[];

  // Pricing
  price: number;
  compareAtPrice: number;
  costPerItem: number;

  // Inventory
  sku: string;
  barcode: string;
  trackQuantity: boolean;
  quantity: number;
  lowStockThreshold: number;

  // Shipping
  requiresShipping: boolean;
  dimensions: {
    weight: number;
    length: number;
    width: number;
    height: number;
  };

  // Images - Updated to use Cloudinary
  images: CloudinaryImage[];
  featuredImage: number;

  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];

  // Status
  status: "draft" | "active" | "archived";
  featured: boolean;

  // Delivery
  deliveryZones: string[];
  deliveryTime: string;
  freeDeliveryThreshold: number;

  // Product Features
  giftWrapping: boolean;
  personalization: boolean;
  careInstructions: string;
  occasions: string[];
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
};

// const categories = [
//   {
//     value: "roses",
//     label: "Premium Roses",
//     subcategories: ["Red Roses", "White Roses", "Pink Roses", "Mixed Roses"],
//   },
//   {
//     value: "mixed-arrangements",
//     label: "Mixed Arrangements",
//     subcategories: ["Seasonal", "Tropical", "Classic", "Modern"],
//   },
//   {
//     value: "chocolates",
//     label: "Premium Chocolates",
//     subcategories: [
//       "Dark Chocolate",
//       "Milk Chocolate",
//       "Assorted",
//       "Sugar-Free",
//     ],
//   },
//   {
//     value: "cakes",
//     label: "Fresh Cakes",
//     subcategories: ["Birthday", "Anniversary", "Wedding", "Custom"],
//   },
//   {
//     value: "plants",
//     label: "Indoor Plants",
//     subcategories: ["Succulents", "Flowering", "Green Plants", "Air Purifying"],
//   },
//   {
//     value: "gifts",
//     label: "Luxury Gifts",
//     subcategories: ["Jewelry", "Perfumes", "Accessories", "Gift Sets"],
//   },
// ];

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
  console.log(params);
  const slug: any = params.get("slug");
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [activeTab, setActiveTab] = useState("basic");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createProduct, { data, loading, error }] =
    useMutation<ProductFormData>(CREATE_PRODUCT);
  const { data: categories } = useCategories([
    "id",
    "name",
    "description",
    "subcategories {id name}",
  ]);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error" | "update"
  >("idle");
  const [newTag, setNewTag] = useState("");
  const [newKeyword, setNewKeyword] = useState("");

  // query and mutation:::::::::::::::::::::::::::::::::::::::::::
  const {
    data: editData,
    loading: queryLoading,
    error: queryError,
  } = useQuery(GET_PRODUCT_BY_SLUG, {
    variables: { slug: slug },
    skip: !slug,
  });
  const [updateProduct, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_PRODUCT);

  // product by id , get for edit product::::::::
  useEffect(() => {
    if (editData?.productBySlug) {
      setFormData(editData.productBySlug);
    }
  }, [editData, queryLoading]);
  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Auto-generate SKU
  const generateSKU = (name: string, category: string) => {
    const nameCode = name.substring(0, 3).toUpperCase();
    const categoryCode = category.substring(0, 2).toUpperCase();
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `MB-${categoryCode}${nameCode}-${randomNum}`;
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-generate slug when name changes
      if (field === "name" && value) {
        updated.slug = generateSlug(value);
        updated.seoTitle = value;
        if (!prev.sku) {
          updated.sku = generateSKU(value, prev.category || "GEN");
        }
      }

      // Auto-generate SKU when category changes
      if (field === "category" && value && prev.name) {
        if (!prev.sku || prev.sku.startsWith("MB-")) {
          updated.sku = generateSKU(prev.name, value);
        }
      }

      // Clear subcategory when category changes
      if (field === "category") {
        updated.subcategory = "";
      }

      return updated;
    });

    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleDimensionChange = (
    dimension: "weight" | "length" | "width" | "height",
    value: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      dimensions: { ...prev.dimensions, [dimension]: value },
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange("tags", [...formData.tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange(
      "tags",
      formData.tags.filter((tag) => tag !== tagToRemove)
    );
  };

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

  const removeKeyword = (keywordToRemove: string) => {
    handleInputChange(
      "seoKeywords",
      formData.seoKeywords.filter((keyword) => keyword !== keywordToRemove)
    );
  };

  const toggleOccasion = (occasion: string) => {
    const isSelected = formData.occasions.includes(occasion);
    if (isSelected) {
      handleInputChange(
        "occasions",
        formData.occasions.filter((o) => o !== occasion)
      );
    } else {
      handleInputChange("occasions", [...formData.occasions, occasion]);
    }
  };

  const toggleDeliveryZone = (zone: string) => {
    const isSelected = formData.deliveryZones.includes(zone);
    if (isSelected) {
      handleInputChange(
        "deliveryZones",
        formData.deliveryZones.filter((z) => z !== zone)
      );
    } else {
      handleInputChange("deliveryZones", [...formData.deliveryZones, zone]);
    }
  };

  const handleImagesUploaded = (
    newImages: Array<{
      url: string;
      publicId: string;
    }>
  ) => {
    const cloudinaryImages: CloudinaryImage[] = newImages.map((img) => ({
      url: img.url,
      publicId: img.publicId,
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...cloudinaryImages],
      featuredImage:
        prev.featuredImage < prev.images.length + cloudinaryImages.length
          ? prev.featuredImage
          : 0,
    }));

    // Clear image error if exists
    if (errors.images) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Basic Information
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.slug.trim()) newErrors.slug = "Product slug is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.shortDescription.trim())
      newErrors.shortDescription = "Short description is required";
    if (!formData.category) newErrors.category = "Category is required";

    // Pricing
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
    if (
      formData.compareAtPrice > 0 &&
      formData.compareAtPrice <= formData.price
    ) {
      newErrors.compareAtPrice =
        "Compare at price must be higher than regular price";
    }

    // Inventory
    if (!formData.sku.trim()) newErrors.sku = "SKU is required";
    if (formData.trackQuantity && formData.quantity < 0)
      newErrors.quantity = "Quantity cannot be negative";

    // Images
    if (formData.images.length === 0)
      newErrors.images = "At least one product image is required";

    // SEO
    if (!formData.seoTitle.trim()) newErrors.seoTitle = "SEO title is required";
    if (!formData.seoDescription.trim())
      newErrors.seoDescription = "SEO description is required";

    // Delivery
    if (formData.deliveryZones.length === 0)
      newErrors.deliveryZones = "At least one delivery zone is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (status: "draft" | "active" = "draft") => {
    if (!validateForm()) {
      setSaveStatus("error");
      return;
    }

    setSaveStatus("saving");

    try {
      // Simulate API call

      const productData = {
        ...formData,
        status,
        id: `MB-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      console.log("Saving product with Cloudinary images:", productData);
      const res = await createProduct({
        variables: {
          data: productData,
        },
      });
      console.log(res);
      if (res.errors) {
        toast.error(res.errors[0].message);
      }
      toast.success("Product created successfully!");
      setSaveStatus("saved");
      if (status === "active") {
        router.push("/dashboard/products");
      }
    } catch (error: any) {
      setSaveStatus("error");
      setSaveStatus("idle");
      toast.error(error?.message || "Error saving product");
    }
  };
  // console.log("DATA: ", data);
  const tabs = [
    {
      id: "basic",
      label: "Basic Info",
      icon: FileText,
      hasError: !!(
        errors.name ||
        errors.description ||
        errors.shortDescription ||
        errors.category
      ),
    },
    {
      id: "pricing",
      label: "Pricing",
      icon: DollarSign,
      hasError: !!(errors.price || errors.compareAtPrice),
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: Package,
      hasError: !!(errors.sku || errors.quantity),
    },
    {
      id: "images",
      label: "Images",
      icon: ImageIcon,
      hasError: !!errors.images,
    },
    {
      id: "seo",
      label: "SEO",
      icon: Globe,
      hasError: !!(errors.seoTitle || errors.seoDescription),
    },
    {
      id: "delivery",
      label: "Delivery",
      icon: Truck,
      hasError: !!errors.deliveryZones,
    },
    {
      id: "features",
      label: "Features",
      icon: Sparkles,
      hasError: false,
    },
  ];

  const getSaveButtonContent = () => {
    switch (saveStatus) {
      case "saving":
        return (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        );
      case "saved":
        return (
          <>
            <CheckCircle className="w-4 h-4" />
            Saved
          </>
        );
      case "error":
        return (
          <>
            <AlertCircle className="w-4 h-4" />
            Error
          </>
        );
      default:
        return (
          <>
            <Save className="w-4 h-4" />
            Save Draft
          </>
        );
    }
  };

  const category = categories?.find((cat) => cat.name === formData.category) as
    | Category
    | undefined;
  const selectedCategory = category
    ? {
        id: category.id,
        name: category.name,
        desription: category.description ?? "",
        subcategories: (category as any)?.subcategories ?? [],
      }
    : undefined;

  // UPDATE PRODUCT BY SLUG:::::::::::::::::::::
  const handleUpdate = async () => {
    if (!validateForm()) {
      setSaveStatus("error");
      return;
    }

    setSaveStatus("saving");
    try {
      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        shortDescription: formData.shortDescription,
        category: formData.category,
        subcategory: formData.subcategory,
        tags: formData.tags,
        price: formData.price,
        compareAtPrice: formData.compareAtPrice,
        costPerItem: formData.costPerItem,
        sku: formData.sku,
        barcode: formData.barcode,
        trackQuantity: formData.trackQuantity,
        quantity: formData.quantity,
        lowStockThreshold: formData.lowStockThreshold,
        requiresShipping: formData.requiresShipping,
        featuredImage: formData.featuredImage,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        seoKeywords: formData.seoKeywords,
        status: formData.status || "draft", // enum must be valid
        featured: formData.featured,
        deliveryZones: formData.deliveryZones,
        deliveryTime: formData.deliveryTime,
        freeDeliveryThreshold: formData.freeDeliveryThreshold,
        giftWrapping: formData.giftWrapping,
        personalization: formData.personalization,
        careInstructions: formData.careInstructions,
        occasions: formData.occasions,

        dimensions: formData.dimensions
          ? {
              weight: formData.dimensions.weight,
              length: formData.dimensions.length,
              width: formData.dimensions.width,
              height: formData.dimensions.height,
            }
          : undefined,

        images: formData?.images?.map((img) => ({
          url: img?.url,
          publicId: img.publicId,
        })),
      };
      console.log("update:", productData);
      const res = await updateProduct({
        variables: {
          slug,
          data: productData,
        },
      });

      setSaveStatus("saved");
      router.push("/dashboard/products");
    } catch (error) {
      setSaveStatus("error");
      setSaveStatus("idle");
    }
  };
  return (
    <Suspense fallback={<div>Loading query...</div>}>
      <div className="space-y-6 w-full overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-5 justify-between w-full">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-cormorant font-bold text-charcoal-900 flex items-center">
                Add New Product
                <Cloud className="w-8 h-8 ml-3 text-blue-500" />
              </h1>
              <p className="text-gray-600 mt-1">
                Create a new product with Cloudinary-optimized images
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Save Status Indicator */}
            {saveStatus === "saving" && (
              <div className="flex items-center text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Saving...
              </div>
            )}
            {saveStatus === "saved" && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-2" />
                Saved!
              </div>
            )}
            {saveStatus === "error" && (
              <div className="flex items-center text-red-600">
                <AlertCircle className="w-4 h-4 mr-2" />
                Error saving
              </div>
            )}

            {/* <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button> */}
            <Button
              onClick={() => handleSave("draft")}
              disabled={saveStatus === "saving"}
              variant="outline"
              className={`${
                saveStatus === "saved"
                  ? "border-green-300 text-green-700"
                  : saveStatus === "error"
                  ? "border-red-300 text-red-700"
                  : ""
              }`}
            >
              {getSaveButtonContent()}
            </Button>
            {slug ? (
              <Button
                onClick={() => handleUpdate()}
                disabled={saveStatus === "saving" || queryLoading}
                variant="luxury"
              >
                {updateLoading ? "Updating Product" : "Update Product"}
              </Button>
            ) : (
              <Button
                onClick={() => handleSave("active")}
                disabled={saveStatus === "saving"}
                variant="luxury"
              >
                Publish Product
              </Button>
            )}
          </div>
        </div>

        {/* Error Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <h3 className="text-sm font-medium text-red-800">
                Please fix the following errors:
              </h3>
            </div>
            <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="sm:grid sm:grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-cream-200 p-4 sticky top-6">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? "bg-luxury-50 text-luxury-600 border border-luxury-200"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </div>
                      {tab.hasError && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Progress Indicator */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-2">
                  Completion Progress
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-luxury-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.round(
                        (tabs.filter((tab) => !tab.hasError).length /
                          tabs.length) *
                          100
                      )}%`,
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {tabs.filter((tab) => !tab.hasError).length} of {tabs.length}{" "}
                  sections complete
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9 w-full">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-cream-200 p-6  w-full"
            >
              {/* Basic Information Tab */}
              {activeTab === "basic" && (
                <BasicInfoTab
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  removeTag={removeTag}
                  newTag={newTag}
                  setNewTag={setNewTag}
                  addTag={addTag}
                />
              )}

              {/* Pricing Tab */}
              {activeTab === "pricing" && (
                <PricingTab
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                />
              )}

              {/* Inventory Tab */}
              {activeTab === "inventory" && (
                <InventoryTab
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                  handleDimensionChange={handleDimensionChange}
                />
              )}

              {/* Images Tab */}
              {activeTab === "images" && (
                //
                <div className="w-full">
                  <ImagesTab
                    formData={formData}
                    handleInputChange={handleInputChange}
                    errors={errors}
                    handleImagesUploaded={handleImagesUploaded}
                  />
                </div>
              )}

              {/* SEO Tab */}
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

              {/* Delivery Tab */}
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

              {/* Features Tab */}
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
      </div>
    </Suspense>
  );
}
