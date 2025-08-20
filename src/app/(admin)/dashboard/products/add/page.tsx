"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../../../components/ui/Button";
import { Input } from "../../../../../components/ui/Input";
import RichTextEditor from "../../../../../components/ui/RichTextEditor";
import { CloudinaryFileUpload } from "../../../../../components/ui/CloudinaryFileUpload";
import { CloudinaryImageGallery } from "../../../../../components/ui/CloudinaryImageGallery";
import {
  ArrowLeft,
  Save,
  Eye,
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
  Plus,
  X,
  Tag,
  Search,
  Calendar,
  Gift,
  Heart,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import type { getResponsiveImageUrls } from "../../../../../lib/cloudinary";
import {
  ApolloCache,
  DefaultContext,
  OperationVariables,
  useMutation,
} from "@apollo/client";
import { CREATE_PRODUCT } from "@/src/graphql/clientDefs/create-productDefs";

interface CloudinaryImage {
  url: string;
  publicId: string;
  optimizedUrls?: ReturnType<typeof getResponsiveImageUrls>;
}

interface ProductFormData {
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
  weight: number;
  dimensions: {
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
  weight: 0,
  dimensions: { length: 0, width: 0, height: 0 },
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

const categories = [
  {
    value: "roses",
    label: "Premium Roses",
    subcategories: ["Red Roses", "White Roses", "Pink Roses", "Mixed Roses"],
  },
  {
    value: "mixed-arrangements",
    label: "Mixed Arrangements",
    subcategories: ["Seasonal", "Tropical", "Classic", "Modern"],
  },
  {
    value: "chocolates",
    label: "Premium Chocolates",
    subcategories: [
      "Dark Chocolate",
      "Milk Chocolate",
      "Assorted",
      "Sugar-Free",
    ],
  },
  {
    value: "cakes",
    label: "Fresh Cakes",
    subcategories: ["Birthday", "Anniversary", "Wedding", "Custom"],
  },
  {
    value: "plants",
    label: "Indoor Plants",
    subcategories: ["Succulents", "Flowering", "Green Plants", "Air Purifying"],
  },
  {
    value: "gifts",
    label: "Luxury Gifts",
    subcategories: ["Jewelry", "Perfumes", "Accessories", "Gift Sets"],
  },
];

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
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [activeTab, setActiveTab] = useState("basic");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createProduct, { data, loading, error }] =
    useMutation<ProductFormData>(CREATE_PRODUCT);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [newTag, setNewTag] = useState("");
  const [newKeyword, setNewKeyword] = useState("");

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
    dimension: "length" | "width" | "height",
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
      optimizedUrls: ReturnType<typeof getResponsiveImageUrls>;
    }>
  ) => {
    const cloudinaryImages: CloudinaryImage[] = newImages.map((img) => ({
      url: img.url,
      publicId: img.publicId,
      optimizedUrls: img.optimizedUrls,
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
    if (status === "active" && !validateForm()) {
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
          ...productData,
        },
      });
      console.log(res);
      setSaveStatus("saved");
      if (status === "active") {
        router.push("/dashboard/products");
      }
    } catch (error) {
      setSaveStatus("error");
      setSaveStatus("idle");
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

  const selectedCategory = categories.find(
    (cat) => cat.value === formData.category
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()} className="p-2">
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
          <Button
            onClick={() => handleSave("active")}
            disabled={saveStatus === "saving"}
            variant="luxury"
          >
            Publish Product
          </Button>
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

      <div className="grid grid-cols-12 gap-6">
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
        <div className="col-span-9">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-cream-200 p-6"
          >
            {/* Basic Information Tab */}
            {activeTab === "basic" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-cormorant font-bold text-charcoal-900 mb-4">
                    Basic Information
                  </h2>
                  <p className="text-gray-600">
                    Essential product details and categorization
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Product Name *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="e.g., Premium Red Rose Bouquet"
                      className={errors.name ? "border-red-300" : ""}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="slug"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      URL Slug
                    </label>
                    <Input
                      id="slug"
                      type="text"
                      value={formData.slug}
                      onChange={(e) =>
                        handleInputChange("slug", e.target.value)
                      }
                      placeholder="premium-red-rose-bouquet"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Auto-generated from product name
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Category *
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-luxury-500 focus:border-transparent ${
                        errors.category ? "border-red-300" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.category}
                      </p>
                    )}
                  </div>

                  {selectedCategory && (
                    <div>
                      <label
                        htmlFor="subcategory"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Subcategory
                      </label>
                      <select
                        id="subcategory"
                        value={formData.subcategory}
                        onChange={(e) =>
                          handleInputChange("subcategory", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
                      >
                        <option value="">Select a subcategory</option>
                        {selectedCategory.subcategories.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label
                      htmlFor="shortDescription"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Short Description *
                    </label>
                    <textarea
                      id="shortDescription"
                      value={formData.shortDescription}
                      onChange={(e) =>
                        handleInputChange("shortDescription", e.target.value)
                      }
                      placeholder="Brief description for product listings (max 160 characters)"
                      rows={3}
                      maxLength={160}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-luxury-500 focus:border-transparent ${
                        errors.shortDescription
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.shortDescription && (
                        <p className="text-red-500 text-sm">
                          {errors.shortDescription}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 ml-auto">
                        {formData.shortDescription.length}/160
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Description *
                  </label>
                  <RichTextEditor
                    value={formData.description}
                    onChange={(value) =>
                      handleInputChange("description", value)
                    }
                    placeholder="Enter a detailed description of your product..."
                    className={errors.description ? "border-red-300" : ""}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-luxury-100 text-luxury-800"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-luxury-600 hover:text-luxury-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Status and Featured */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) =>
                          handleInputChange("featured", e.target.checked)
                        }
                        className="rounded border-gray-300 text-luxury-600 focus:ring-luxury-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700 flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        Featured Product
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === "pricing" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-cormorant font-bold text-charcoal-900 mb-4">
                    Pricing Information
                  </h2>
                  <p className="text-gray-600">
                    Set competitive pricing for your product
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Regular Price (AED) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "price",
                            Number.parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="0.00"
                        className={`pl-10 ${
                          errors.price ? "border-red-300" : ""
                        }`}
                      />
                    </div>
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.price}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="compareAtPrice"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Compare at Price (AED)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="compareAtPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.compareAtPrice || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "compareAtPrice",
                            Number.parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="0.00"
                        className={`pl-10 ${
                          errors.compareAtPrice ? "border-red-300" : ""
                        }`}
                      />
                    </div>
                    {errors.compareAtPrice && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.compareAtPrice}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Original price for showing discounts
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="costPerItem"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Cost per Item (AED)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="costPerItem"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.costPerItem || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "costPerItem",
                            Number.parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="0.00"
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Your cost for profit calculations
                    </p>
                  </div>
                </div>

                {/* Pricing Summary */}
                {formData.price > 0 && (
                  <div className="bg-luxury-50 border border-luxury-200 rounded-lg p-4">
                    <h3 className="font-medium text-luxury-900 mb-3">
                      Pricing Summary
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Regular Price:</span>
                        <p className="font-medium text-luxury-900">
                          AED {formData.price.toFixed(2)}
                        </p>
                      </div>
                      {formData.compareAtPrice > 0 && (
                        <div>
                          <span className="text-gray-600">Discount:</span>
                          <p className="font-medium text-green-600">
                            {Math.round(
                              ((formData.compareAtPrice - formData.price) /
                                formData.compareAtPrice) *
                                100
                            )}
                            % OFF
                          </p>
                        </div>
                      )}
                      {formData.costPerItem > 0 && (
                        <div>
                          <span className="text-gray-600">Profit Margin:</span>
                          <p className="font-medium text-blue-600">
                            {Math.round(
                              ((formData.price - formData.costPerItem) /
                                formData.price) *
                                100
                            )}
                            %
                          </p>
                        </div>
                      )}
                      {formData.costPerItem > 0 && (
                        <div>
                          <span className="text-gray-600">
                            Profit per Sale:
                          </span>
                          <p className="font-medium text-green-600">
                            AED{" "}
                            {(formData.price - formData.costPerItem).toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Inventory Tab */}
            {activeTab === "inventory" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-cormorant font-bold text-charcoal-900 mb-4">
                    Inventory Management
                  </h2>
                  <p className="text-gray-600">
                    Track stock levels and product identifiers
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="sku"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      SKU (Stock Keeping Unit) *
                    </label>
                    <Input
                      id="sku"
                      type="text"
                      value={formData.sku}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                      placeholder="MB-RO001"
                      className={errors.sku ? "border-red-300" : ""}
                    />
                    {errors.sku && (
                      <p className="text-red-500 text-sm mt-1">{errors.sku}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Auto-generated from name and category
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="barcode"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Barcode
                    </label>
                    <Input
                      id="barcode"
                      type="text"
                      value={formData.barcode}
                      onChange={(e) =>
                        handleInputChange("barcode", e.target.value)
                      }
                      placeholder="1234567890123"
                    />
                  </div>
                </div>

                {/* Quantity Tracking */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.trackQuantity}
                        onChange={(e) =>
                          handleInputChange("trackQuantity", e.target.checked)
                        }
                        className="rounded border-gray-300 text-luxury-600 focus:ring-luxury-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        Track quantity for this product
                      </span>
                    </label>
                  </div>

                  {formData.trackQuantity && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="quantity"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Current Stock Quantity *
                        </label>
                        <Input
                          id="quantity"
                          type="number"
                          min="0"
                          value={formData.quantity || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "quantity",
                              Number.parseInt(e.target.value) || 0
                            )
                          }
                          placeholder="0"
                          className={errors.quantity ? "border-red-300" : ""}
                        />
                        {errors.quantity && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.quantity}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="lowStockThreshold"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Low Stock Alert Threshold
                        </label>
                        <Input
                          id="lowStockThreshold"
                          type="number"
                          min="0"
                          value={formData.lowStockThreshold || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "lowStockThreshold",
                              Number.parseInt(e.target.value) || 0
                            )
                          }
                          placeholder="5"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Get notified when stock is low
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Shipping Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Shipping Information
                  </h3>

                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.requiresShipping}
                        onChange={(e) =>
                          handleInputChange(
                            "requiresShipping",
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300 text-luxury-600 focus:ring-luxury-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        This product requires shipping
                      </span>
                    </label>
                  </div>

                  {formData.requiresShipping && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label
                          htmlFor="weight"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Weight (kg)
                        </label>
                        <Input
                          id="weight"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.weight || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "weight",
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="length"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Length (cm)
                        </label>
                        <Input
                          id="length"
                          type="number"
                          min="0"
                          value={formData.dimensions.length || ""}
                          onChange={(e) =>
                            handleDimensionChange(
                              "length",
                              Number.parseInt(e.target.value) || 0
                            )
                          }
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="width"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Width (cm)
                        </label>
                        <Input
                          id="width"
                          type="number"
                          min="0"
                          value={formData.dimensions.width || ""}
                          onChange={(e) =>
                            handleDimensionChange(
                              "width",
                              Number.parseInt(e.target.value) || 0
                            )
                          }
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="height"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Height (cm)
                        </label>
                        <Input
                          id="height"
                          type="number"
                          min="0"
                          value={formData.dimensions.height || ""}
                          onChange={(e) =>
                            handleDimensionChange(
                              "height",
                              Number.parseInt(e.target.value) || 0
                            )
                          }
                          placeholder="0"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Images Tab */}
            {activeTab === "images" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-cormorant font-bold text-charcoal-900 mb-4 flex items-center">
                    Product Images
                    <Cloud className="w-6 h-6 ml-2 text-blue-500" />
                    {errors.images && (
                      <span className="text-red-500 ml-2 text-sm">
                        {errors.images}
                      </span>
                    )}
                  </h2>
                  <p className="text-gray-600">
                    Upload high-quality images with automatic Cloudinary
                    optimization
                  </p>
                </div>

                {/* Cloudinary File Upload Component */}
                <CloudinaryFileUpload
                  onFilesUploaded={handleImagesUploaded}
                  maxFiles={10}
                  maxFileSize={10}
                  existingFiles={formData.images.map((img) => ({
                    url: img.url,
                    publicId: img.publicId,
                  }))}
                  className={errors.images ? "border-red-300" : ""}
                  folder="misk-blooming/products"
                  tags={[
                    "product",
                    "misk-blooming",
                    formData.category || "uncategorized",
                  ]}
                />

                {/* Cloudinary Image Gallery */}
                {formData.images.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        Optimized Images
                        <Cloud className="w-5 h-5 ml-2 text-blue-500" />
                        <Zap className="w-4 h-4 ml-1 text-yellow-500" />
                      </h3>
                      <div className="text-sm text-gray-500">
                        {formData.images.length} of 10 images
                      </div>
                    </div>

                    <CloudinaryImageGallery
                      images={formData.images}
                      featuredIndex={formData.featuredImage}
                      onImagesChange={(images) =>
                        handleInputChange("images", images)
                      }
                      onFeaturedChange={(index) =>
                        handleInputChange("featuredImage", index)
                      }
                    />
                  </div>
                )}

                {/* Image Guidelines */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    Image Optimization Features
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Automatic WebP conversion for faster loading</li>
                    <li>
                      • Multiple size variants (thumbnail, small, medium, large)
                    </li>
                    <li>• Quality optimization based on content</li>
                    <li>• CDN delivery for global performance</li>
                    <li>
                      • Drag & drop reordering with featured image selection
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === "seo" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-cormorant font-bold text-charcoal-900 mb-4">
                    SEO Optimization
                  </h2>
                  <p className="text-gray-600">
                    Optimize your product for search engines
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="seoTitle"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      SEO Title *
                    </label>
                    <Input
                      id="seoTitle"
                      type="text"
                      value={formData.seoTitle}
                      onChange={(e) =>
                        handleInputChange("seoTitle", e.target.value)
                      }
                      placeholder="Premium Red Rose Bouquet - Dubai Flower Delivery"
                      maxLength={60}
                      className={errors.seoTitle ? "border-red-300" : ""}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.seoTitle && (
                        <p className="text-red-500 text-sm">
                          {errors.seoTitle}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 ml-auto">
                        {formData.seoTitle.length}/60
                      </p>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="seoDescription"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      SEO Description *
                    </label>
                    <textarea
                      id="seoDescription"
                      value={formData.seoDescription}
                      onChange={(e) =>
                        handleInputChange("seoDescription", e.target.value)
                      }
                      placeholder="Beautiful premium red roses arranged in an elegant bouquet. Perfect for anniversaries, birthdays, and special occasions. Same-day delivery in Dubai."
                      rows={4}
                      maxLength={160}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-luxury-500 focus:border-transparent ${
                        errors.seoDescription
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.seoDescription && (
                        <p className="text-red-500 text-sm">
                          {errors.seoDescription}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 ml-auto">
                        {formData.seoDescription.length}/160
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Keywords
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.seoKeywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          <Search className="w-3 h-3 mr-1" />
                          {keyword}
                          <button
                            type="button"
                            onClick={() => removeKeyword(keyword)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        placeholder="Add SEO keyword..."
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addKeyword())
                        }
                      />
                      <Button
                        type="button"
                        onClick={addKeyword}
                        variant="outline"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Add relevant keywords for better search visibility
                    </p>
                  </div>

                  {/* SEO Preview */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Search Engine Preview
                    </h4>
                    <div className="space-y-2">
                      <div className="text-blue-600 text-lg font-medium hover:underline cursor-pointer">
                        {formData.seoTitle || "Your SEO Title"}
                      </div>
                      <div className="text-green-700 text-sm">
                        https://miskblooming.com/products/
                        {formData.slug || "product-slug"}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {formData.seoDescription ||
                          "Your SEO description will appear here..."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Tab */}
            {activeTab === "delivery" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-cormorant font-bold text-charcoal-900 mb-4">
                    Delivery Settings
                  </h2>
                  <p className="text-gray-600">
                    Configure delivery options and zones
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Time
                    </label>
                    <select
                      value={formData.deliveryTime}
                      onChange={(e) =>
                        handleInputChange("deliveryTime", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
                    >
                      {deliveryTimes.map((time) => (
                        <option key={time.value} value={time.value}>
                          {time.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="freeDeliveryThreshold"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Free Delivery Threshold (AED)
                    </label>
                    <Input
                      id="freeDeliveryThreshold"
                      type="number"
                      min="0"
                      value={formData.freeDeliveryThreshold || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "freeDeliveryThreshold",
                          Number.parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder="100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum order value for free delivery
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Delivery Zones *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {deliveryZones.map((zone) => (
                        <label key={zone} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.deliveryZones.includes(zone)}
                            onChange={() => toggleDeliveryZone(zone)}
                            className="rounded border-gray-300 text-luxury-600 focus:ring-luxury-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {zone}
                          </span>
                        </label>
                      ))}
                    </div>
                    {errors.deliveryZones && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.deliveryZones}
                      </p>
                    )}
                  </div>

                  {/* Selected Zones Summary */}
                  {formData.deliveryZones.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2 flex items-center">
                        <Truck className="w-4 h-4 mr-2" />
                        Selected Delivery Zones ({formData.deliveryZones.length}
                        )
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.deliveryZones.map((zone) => (
                          <span
                            key={zone}
                            className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800"
                          >
                            {zone}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Features Tab */}
            {activeTab === "features" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-cormorant font-bold text-charcoal-900 mb-4">
                    Product Features
                  </h2>
                  <p className="text-gray-600">
                    Additional features and care instructions
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Product Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.giftWrapping}
                          onChange={(e) =>
                            handleInputChange("giftWrapping", e.target.checked)
                          }
                          className="rounded border-gray-300 text-luxury-600 focus:ring-luxury-500"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700 flex items-center">
                          <Gift className="w-4 h-4 mr-1" />
                          Gift Wrapping Available
                        </span>
                      </label>
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.personalization}
                          onChange={(e) =>
                            handleInputChange(
                              "personalization",
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-luxury-600 focus:ring-luxury-500"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700 flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          Personalization Available
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Occasions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Suitable Occasions
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {occasionsList.map((occasion) => (
                        <label key={occasion} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.occasions.includes(occasion)}
                            onChange={() => toggleOccasion(occasion)}
                            className="rounded border-gray-300 text-luxury-600 focus:ring-luxury-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {occasion}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Selected Occasions */}
                  {formData.occasions.length > 0 && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-medium text-purple-900 mb-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Selected Occasions ({formData.occasions.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.occasions.map((occasion) => (
                          <span
                            key={occasion}
                            className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-100 text-purple-800"
                          >
                            {occasion}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Care Instructions */}
                  <div>
                    <label
                      htmlFor="careInstructions"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Care Instructions
                    </label>
                    <textarea
                      id="careInstructions"
                      value={formData.careInstructions}
                      onChange={(e) =>
                        handleInputChange("careInstructions", e.target.value)
                      }
                      placeholder="Provide care instructions for the product (e.g., watering schedule for plants, storage instructions for chocolates, etc.)"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
