"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../../../components/ui/Button";
import { Input } from "../../../../../components/ui/Input";
import { RichTextEditor } from "../../../../../components/ui/RichTextEditor";
import { CloudinaryFileUpload } from "../../../../../components/ui/CloudinaryFileUpload";
import { CloudinaryImageGallery } from "../../../../../components/ui/CloudinaryImageGallery";
import {
  ArrowLeft,
  Save,
  Eye,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  Plus,
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
  { value: "roses", label: "Premium Roses" },
  { value: "mixed-arrangements", label: "Mixed Arrangements" },
  { value: "chocolates", label: "Premium Chocolates" },
  { value: "cakes", label: "Fresh Cakes" },
  { value: "plants", label: "Indoor Plants" },
  { value: "gifts", label: "Luxury Gifts" },
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
];

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [activeTab, setActiveTab] = useState("basic");
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-generate slug when name changes
      if (field === "name" && value) {
        updated.slug = generateSlug(value);
        updated.seoTitle = value;
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

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
    if (!formData.sku.trim()) newErrors.sku = "SKU is required";
    if (formData.trackQuantity && formData.quantity < 0)
      newErrors.quantity = "Quantity cannot be negative";
    if (formData.images.length === 0)
      newErrors.images = "At least one product image is required";

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
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const productData = {
        ...formData,
        status,
        id: `MB-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      console.log("Saving product with Cloudinary images:", productData);

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);

      if (status === "active") {
        setTimeout(() => {
          router.push("/dashboard/products");
        }, 1000);
      }
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const tabs = [
    {
      id: "basic",
      label: "Basic Info",
      icon: FileText,
      hasError: !!(errors.name || errors.description || errors.category),
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
      hasError: false,
    },
    {
      id: "delivery",
      label: "Delivery",
      icon: Truck,
      hasError: false,
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

          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
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
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                      {errors.name && (
                        <span className="text-red-500 ml-2">{errors.name}</span>
                      )}
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="e.g., Premium Red Rose Bouquet"
                      className={`text-lg ${
                        errors.name
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug
                    </label>
                    <Input
                      value={formData.slug}
                      onChange={(e) =>
                        handleInputChange("slug", e.target.value)
                      }
                      placeholder="product-url-slug"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      URL: /products/{formData.slug || "product-url-slug"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                      {errors.category && (
                        <span className="text-red-500 ml-2">
                          {errors.category}
                        </span>
                      )}
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent ${
                        errors.category
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory
                    </label>
                    <Input
                      value={formData.subcategory}
                      onChange={(e) =>
                        handleInputChange("subcategory", e.target.value)
                      }
                      placeholder="Enter subcategory"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Short Description
                    </label>
                    <textarea
                      value={formData.shortDescription}
                      onChange={(e) =>
                        handleInputChange("shortDescription", e.target.value)
                      }
                      placeholder="Brief description for product cards and listings..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Detailed Description *
                      {errors.description && (
                        <span className="text-red-500 ml-2">
                          {errors.description}
                        </span>
                      )}
                    </label>
                    <RichTextEditor
                      value={formData.description}
                      onChange={(value) =>
                        handleInputChange("description", value)
                      }
                      placeholder="Detailed product description with formatting..."
                      className={errors.description ? "border-red-300" : ""}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-luxury-100 text-luxury-800"
                        >
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
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        onKeyPress={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addTag())
                        }
                      />
                      <Button type="button" onClick={addTag} variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
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
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selling Price (AED) *
                      {errors.price && (
                        <span className="text-red-500 ml-2">
                          {errors.price}
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.price || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "price",
                            Number.parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="0.00"
                        className={`pl-10 ${
                          errors.price
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price (AED)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.compareAtPrice || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "compareAtPrice",
                            Number.parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="0.00"
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      For showing discounts
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cost Price (AED)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="number"
                        step="0.01"
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
                      For profit calculations
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profit Margin
                    </label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600">
                        {formData.price &&
                        formData.costPerItem &&
                        formData.price > 0
                          ? `${(
                              ((formData.price - formData.costPerItem) /
                                formData.price) *
                              100
                            ).toFixed(1)}%`
                          : "0%"}
                      </div>
                      <div className="text-sm text-gray-600">
                        Profit: AED{" "}
                        {formData.price && formData.costPerItem
                          ? (formData.price - formData.costPerItem).toFixed(2)
                          : "0.00"}
                      </div>
                    </div>
                  </div>
                </div>

                {formData.price > 0 &&
                  formData.compareAtPrice > formData.price && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-800 font-medium">
                          {Math.round(
                            ((formData.compareAtPrice - formData.price) /
                              formData.compareAtPrice) *
                              100
                          )}
                          % discount
                        </span>
                      </div>
                      <p className="text-green-700 text-sm mt-1">
                        Customers save AED{" "}
                        {(formData.compareAtPrice - formData.price).toFixed(2)}
                      </p>
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
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU *
                      {errors.sku && (
                        <span className="text-red-500 ml-2">{errors.sku}</span>
                      )}
                    </label>
                    <Input
                      value={formData.sku}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                      placeholder="Enter SKU"
                      className={
                        errors.sku
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Barcode
                    </label>
                    <Input
                      value={formData.barcode}
                      onChange={(e) =>
                        handleInputChange("barcode", e.target.value)
                      }
                      placeholder="Enter barcode"
                    />
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="trackQuantity"
                        checked={formData.trackQuantity}
                        onChange={(e) =>
                          handleInputChange("trackQuantity", e.target.checked)
                        }
                        className="w-4 h-4 text-luxury-600 border-gray-300 rounded focus:ring-luxury-500"
                      />
                      <label
                        htmlFor="trackQuantity"
                        className="text-sm font-medium text-gray-700"
                      >
                        Track inventory for this product
                      </label>
                    </div>
                  </div>

                  {formData.trackQuantity && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stock Quantity *
                          {errors.quantity && (
                            <span className="text-red-500 ml-2">
                              {errors.quantity}
                            </span>
                          )}
                        </label>
                        <Input
                          type="number"
                          value={formData.quantity || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "quantity",
                              Number.parseInt(e.target.value) || 0
                            )
                          }
                          placeholder="0"
                          className={
                            errors.quantity
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : ""
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Low Stock Threshold
                        </label>
                        <Input
                          type="number"
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
                          Alert when stock falls below this number
                        </p>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (kg)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.weight || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "weight",
                          Number.parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder="0.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dimensions (cm)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        type="number"
                        value={formData.dimensions.length || ""}
                        onChange={(e) =>
                          handleDimensionChange(
                            "length",
                            Number.parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="L"
                      />
                      <Input
                        type="number"
                        value={formData.dimensions.width || ""}
                        onChange={(e) =>
                          handleDimensionChange(
                            "width",
                            Number.parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="W"
                      />
                      <Input
                        type="number"
                        value={formData.dimensions.height || ""}
                        onChange={(e) =>
                          handleDimensionChange(
                            "height",
                            Number.parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="H"
                      />
                    </div>
                  </div>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Title
                    </label>
                    <Input
                      value={formData.seoTitle}
                      onChange={(e) =>
                        handleInputChange("seoTitle", e.target.value)
                      }
                      placeholder="Premium Red Rose Bouquet - Luxury Flowers Dubai"
                      maxLength={60}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Recommended: 50-60 characters</span>
                      <span
                        className={
                          formData.seoTitle.length > 60 ? "text-red-500" : ""
                        }
                      >
                        {formData.seoTitle.length}/60
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Description
                    </label>
                    <textarea
                      value={formData.seoDescription}
                      onChange={(e) =>
                        handleInputChange("seoDescription", e.target.value)
                      }
                      placeholder="Beautiful premium red roses arranged by expert florists. Same-day delivery in Dubai. Perfect for anniversaries, birthdays, and special occasions."
                      rows={3}
                      maxLength={160}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Recommended: 150-160 characters</span>
                      <span
                        className={
                          formData.seoDescription.length > 160
                            ? "text-red-500"
                            : ""
                        }
                      >
                        {formData.seoDescription.length}/160
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        miskblooming.com/products/
                      </span>
                      <Input
                        value={formData.slug}
                        onChange={(e) =>
                          handleInputChange(
                            "slug",
                            e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9-]/g, "-")
                          )
                        }
                        placeholder="premium-red-rose-bouquet"
                        className="rounded-l-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Keywords
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.seoKeywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
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
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        placeholder="Add keyword..."
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
                      Examples: roses, luxury flowers, Dubai delivery, premium
                      bouquet
                    </p>
                  </div>

                  {/* SEO Preview */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Search Engine Preview
                    </h3>
                    <div className="bg-white rounded border p-4">
                      <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                        {formData.seoTitle || formData.name || "Product Title"}
                      </div>
                      <div className="text-green-700 text-sm">
                        miskblooming.com/products/
                        {formData.slug || "product-slug"}
                      </div>
                      <div className="text-gray-600 text-sm mt-1">
                        {formData.seoDescription ||
                          formData.shortDescription ||
                          "Product description will appear here..."}
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
                    Delivery Information
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Time
                    </label>
                    <select
                      value={formData.deliveryTime}
                      onChange={(e) =>
                        handleInputChange("deliveryTime", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
                    >
                      <option value="2-4 hours">2-4 hours</option>
                      <option value="Same day">Same day</option>
                      <option value="Next day">Next day</option>
                      <option value="2-3 days">2-3 days</option>
                      <option value="1 week">1 week</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Free Delivery Threshold (AED)
                    </label>
                    <Input
                      type="number"
                      value={formData.freeDeliveryThreshold || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "freeDeliveryThreshold",
                          Number.parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder="500"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Zones
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {deliveryZones.map((zone) => (
                        <label
                          key={zone}
                          className="flex items-center space-x-3"
                        >
                          <input
                            type="checkbox"
                            checked={formData.deliveryZones.includes(zone)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleInputChange("deliveryZones", [
                                  ...formData.deliveryZones,
                                  zone,
                                ]);
                              } else {
                                handleInputChange(
                                  "deliveryZones",
                                  formData.deliveryZones.filter(
                                    (z) => z !== zone
                                  )
                                );
                              }
                            }}
                            className="w-4 h-4 text-luxury-600 border-gray-300 rounded focus:ring-luxury-500"
                          />
                          <span className="text-sm text-gray-700">{zone}</span>
                        </label>
                      ))}
                    </div>
                  </div>
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
                </div>

                <div className="space-y-6">
                  {/* Product Status */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Product Status
                      </h3>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={formData.featured}
                          onChange={(e) =>
                            handleInputChange("featured", e.target.checked)
                          }
                          className="w-4 h-4 text-luxury-600 border-gray-300 rounded focus:ring-luxury-500"
                        />
                        <label
                          htmlFor="featured"
                          className="text-sm font-medium text-gray-700"
                        >
                          Featured Product
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Status
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) =>
                            handleInputChange(
                              "status",
                              e.target.value as "draft" | "active" | "archived"
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
                        >
                          <option value="draft">Draft</option>
                          <option value="active">Active</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Special Features
                      </h3>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="giftWrapping"
                          checked={formData.giftWrapping}
                          onChange={(e) =>
                            handleInputChange("giftWrapping", e.target.checked)
                          }
                          className="w-4 h-4 text-luxury-600 border-gray-300 rounded focus:ring-luxury-500"
                        />
                        <label
                          htmlFor="giftWrapping"
                          className="text-sm font-medium text-gray-700"
                        >
                          Gift Wrapping Available
                        </label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="personalization"
                          checked={formData.personalization}
                          onChange={(e) =>
                            handleInputChange(
                              "personalization",
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 text-luxury-600 border-gray-300 rounded focus:ring-luxury-500"
                        />
                        <label
                          htmlFor="personalization"
                          className="text-sm font-medium text-gray-700"
                        >
                          Personalization Available
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Occasions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Suitable Occasions
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {occasionsList.map((occasion) => (
                        <label
                          key={occasion}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={formData.occasions.includes(occasion)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleInputChange("occasions", [
                                  ...formData.occasions,
                                  occasion,
                                ]);
                              } else {
                                handleInputChange(
                                  "occasions",
                                  formData.occasions.filter(
                                    (o) => o !== occasion
                                  )
                                );
                              }
                            }}
                            className="w-4 h-4 text-luxury-600 border-gray-300 rounded focus:ring-luxury-500"
                          />
                          <span className="text-sm text-gray-700">
                            {occasion}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Care Instructions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Care Instructions
                    </label>
                    <RichTextEditor
                      value={formData.careInstructions}
                      onChange={(value) =>
                        handleInputChange("careInstructions", value)
                      }
                      placeholder="Enter care instructions for this product..."
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
