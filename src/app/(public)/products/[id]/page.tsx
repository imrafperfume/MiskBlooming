"use client";
import * as React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  Shield,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  Gift,
  Award,
  Leaf,
  CheckCircle,
  MessageCircle,
  ThumbsUp,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../../../components/ui/Button";
import { useProduct } from "../../../../hooks/useProducts";
import { useCartStore } from "../../../../store/cartStore";
import { useWishlistStore } from "../../../../store/wishlistStore";
import { formatPrice } from "../../../../lib/utils";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = React.use(params);
  const { data: product, isLoading } = useProduct(id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedReviewFilter, setSelectedReviewFilter] = useState("all");

  const addItem = useCartStore((state) => state.addItem);
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();
  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      // Could add a toast notification here
    }
  };

  const handleWishlistToggle = () => {
    if (product) {
      if (isWishlisted) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    }
  };

  const nextImage = () => {
    if (product) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product) {
      setSelectedImage(
        (prev) => (prev - 1 + product.images.length) % product.images.length
      );
    }
  };

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      name: "Sarah Al-Mansouri",
      rating: 5,
      date: "2024-01-15",
      comment:
        "Absolutely stunning arrangement! The quality exceeded my expectations and the delivery was perfect.",
      verified: true,
      helpful: 12,
    },
    {
      id: 2,
      name: "Ahmed Hassan",
      rating: 5,
      date: "2024-01-10",
      comment:
        "Ordered this for my wife's birthday. She was thrilled! The flowers were fresh and beautifully arranged.",
      verified: true,
      helpful: 8,
    },
    {
      id: 3,
      name: "Emma Johnson",
      rating: 4,
      date: "2024-01-08",
      comment:
        "Beautiful flowers, though delivery was slightly delayed. Overall very satisfied with the quality.",
      verified: true,
      helpful: 5,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-luxury-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-charcoal-900">Loading luxury experience...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-cormorant text-3xl font-bold text-charcoal-900 mb-4">
            Product Not Found
          </h1>
          <Link href="/products">
            <Button variant="luxury">Return to Collections</Button>
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "description", label: "Description", icon: MessageCircle },
    { id: "specifications", label: "Specifications", icon: Award },
    { id: "care", label: "Care Instructions", icon: Leaf },
    { id: "delivery", label: "Delivery Info", icon: Truck },
    { id: "reviews", label: `Reviews (${reviews.length})`, icon: Star },
  ];

  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-br from-cream-50 to-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <motion.div
          className="flex items-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/products"
            className="flex items-center sm:text-base text-xs text-muted-foreground hover:text-luxury-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Collections
          </Link>
          <span className="mx-2 text-charcoal-900">/</span>
          <span className="text-charcoal-900 font-medium text-xs  sm:text-base">
            {product.name}
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-luxury group">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover cursor-zoom-in"
                priority
                onClick={() => setIsImageModalOpen(true)}
              />

              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                {product.featured && (
                  <div className="bg-luxury-500 text-charcoal-900 px-3 py-1 rounded-full text-sm font-bold flex items-center">
                    <Award className="w-3 h-3 mr-1" />
                    Featured
                  </div>
                )}
                {discountPercentage > 0 && (
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{discountPercentage}% OFF
                  </div>
                )}
                {!product.inStock && (
                  <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Zoom Icon */}
              <div className="absolute top-4 right-4 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                <Eye className="w-5 h-5" />
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 ${
                    selectedImage === index
                      ? "ring-2 ring-luxury-500 scale-105"
                      : "hover:scale-105 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Category & Stock Status */}
            <div className="flex items-center justify-between">
              <span className="text-luxury-500 font-medium text-sm uppercase tracking-wide">
                {product.category.replace("-", " ")}
              </span>
              {product.inStock ? (
                <div className="flex items-center text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  In Stock
                </div>
              ) : (
                <div className="flex items-center text-red-600 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  Out of Stock
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, rating) => (
                  <Star
                    key={rating}
                    className={`w-5 h-5 ${
                      rating < Math.floor(product.rating)
                        ? "text-luxury-500 fill-current"
                        : "text-cream-400"
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Title */}
            <h1 className="font-cormorant text-display-sm font-bold text-charcoal-900 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="sm:text-3xl text-2xl font-bold text-charcoal-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="sm:text-xl text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {discountPercentage > 0 && (
                <span className="sm:text-lg font-semibold text-green-600">
                  Save {formatPrice(product.originalPrice! - product.price)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-luxury-100 text-luxury-700 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Quantity Selector */}
            <div className="flex flex-wrap sm:flex-nowrap col-span-2 items-center  sm:space-x-6">
              <div className="flex-1 sm:flex-none sm:mr-0 mr-2">
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-charcoal-900">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-cream-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-cream-100 transition-colors rounded-l-lg"
                      disabled={!product.inStock}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-3 font-medium min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-cream-100 transition-colors rounded-r-lg"
                      disabled={!product.inStock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="sm:text-right flex-1 sm:flex-none sm:w-auto w-full">
                <p className="text-sm text-muted-foreground">Total Price</p>
                <p className="text-xl font-bold text-charcoal-900">
                  {formatPrice(product.price * quantity)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap sm:flex-nowrap sm:col-span-3 col-span-2 gap-4">
              <Button
                onClick={handleAddToCart}
                variant="luxury"
                size="xl"
                className="flex-1 sm:flex-none"
                disabled={!product.inStock}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>

              <Button
                onClick={handleWishlistToggle}
                variant="outline"
                size="xl"
                className={`flex-1 sm:flex-none ${
                  isWishlisted
                    ? "bg-red-50 border-red-200 text-red-600"
                    : "bg-white"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                />
              </Button>

              <Button
                variant="outline"
                size="xl"
                className="flex-1 sm:flex-none bg-white"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-4 pt-6 border-t border-cream-300">
              <div className="text-center border py-3 rounded-md border-cream-400">
                <Truck className="w-6 h-6 text-luxury-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-charcoal-900">
                  Free Delivery
                </p>
                <p className="text-xs text-muted-foreground">
                  Orders over AED 500
                </p>
              </div>
              <div className="text-center border py-3 rounded-md border-cream-400">
                <Shield className="w-6 h-6 text-luxury-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-charcoal-900">
                  Freshness Guarantee
                </p>
                <p className="text-xs text-muted-foreground">
                  100% fresh flowers
                </p>
              </div>
              <div className="text-center border py-3 rounded-md border-cream-400">
                <Gift className="w-6 h-6 text-luxury-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-charcoal-900">
                  Gift Wrapping
                </p>
                <p className="text-xs text-muted-foreground">
                  Luxury packaging included
                </p>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="bg-luxury-50 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 text-luxury-600 mr-2" />
                <span className="font-medium text-charcoal-900">
                  Estimated Delivery
                </span>
              </div>
              <p className="text-muted-foreground">
                {new Date(
                  Date.now() + 1 * 24 * 60 * 60 * 1000
                ).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-luxury-600 mt-1">
                Order by 2 PM for same-day delivery in Dubai
              </p>
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="border-b border-cream-300">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center ${
                    activeTab === tab.id
                      ? "border-luxury-500 text-luxury-500"
                      : "border-transparent text-muted-foreground hover:text-charcoal-900"
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            <AnimatePresence mode="wait">
              {activeTab === "description" && (
                <motion.div
                  key="description"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="prose prose-lg max-w-none"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h3 className="font-cormorant text-2xl font-bold text-charcoal-900 mb-4">
                      Product Description
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {product.longDescription}
                    </p>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-charcoal-900 mb-3">
                          Perfect For:
                        </h4>
                        <ul className="space-y-2 text-muted-foreground">
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            Special occasions
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            Corporate gifts
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            Home decoration
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-charcoal-900 mb-3">
                          What's Included:
                        </h4>
                        <ul className="space-y-2 text-muted-foreground">
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            Premium arrangement
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            Luxury packaging
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            Care instructions
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "specifications" && product.specifications && (
                <motion.div
                  key="specifications"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h3 className="font-cormorant text-2xl font-bold text-charcoal-900 mb-6">
                      Specifications
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between py-3 border-b border-cream-200"
                          >
                            <span className="font-medium text-charcoal-900">
                              {key}:
                            </span>
                            <span className="text-muted-foreground">
                              {value}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "care" && product.care_instructions && (
                <motion.div
                  key="care"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h3 className="font-cormorant text-2xl font-bold text-charcoal-900 mb-6">
                      Care Instructions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-charcoal-900 mb-4 flex items-center">
                          <Leaf className="w-5 h-5 text-green-500 mr-2" />
                          Daily Care
                        </h4>
                        <ul className="space-y-3">
                          {product.care_instructions.map(
                            (instruction, index) => (
                              <li key={index} className="flex items-start">
                                <span className="w-2 h-2 bg-luxury-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span className="text-muted-foreground">
                                  {instruction}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                      <div className="bg-luxury-50 rounded-xl p-6">
                        <h4 className="font-semibold text-charcoal-900 mb-4">
                          Pro Tips
                        </h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                          <li>• Use lukewarm water for best results</li>
                          <li>• Trim stems every 2-3 days</li>
                          <li>• Keep away from direct heat sources</li>
                          <li>• Remove wilted flowers promptly</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "delivery" && (
                <motion.div
                  key="delivery"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h3 className="font-cormorant text-2xl font-bold text-charcoal-900 mb-6">
                      Delivery Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-6 bg-luxury-50 rounded-xl">
                        <Truck className="w-8 h-8 text-luxury-500 mx-auto mb-3" />
                        <h4 className="font-semibold text-charcoal-900 mb-2">
                          Standard Delivery
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Next day across UAE
                        </p>
                        <p className="text-sm font-medium text-luxury-600">
                          Free over AED 500
                        </p>
                      </div>
                      <div className="text-center p-6 bg-luxury-50 rounded-xl">
                        <Clock className="w-8 h-8 text-luxury-500 mx-auto mb-3" />
                        <h4 className="font-semibold text-charcoal-900 mb-2">
                          Same Day Delivery
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Fresh flowers today in Dubai
                        </p>
                        <p className="text-sm font-medium text-luxury-600">
                          AED 50
                        </p>
                      </div>
                      <div className="text-center p-6 bg-luxury-50 rounded-xl">
                        <Calendar className="w-8 h-8 text-luxury-500 mx-auto mb-3" />
                        <h4 className="font-semibold text-charcoal-900 mb-2">
                          Scheduled Delivery
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Perfect for special occasions
                        </p>
                        <p className="text-sm font-medium text-luxury-600">
                          AED 25
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>Freshness Guarantee:</strong> All flowers are
                        sourced fresh daily and arranged by our expert florists.
                        We guarantee the freshness and quality of every
                        arrangement delivered.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "reviews" && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-cormorant text-2xl font-bold text-charcoal-900">
                        Customer Reviews
                      </h3>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-luxury-500 fill-current mr-1" />
                          <span className="font-semibold text-charcoal-900">
                            {product.rating}
                          </span>
                          <span className="text-muted-foreground ml-1">
                            ({product.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Review Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div>
                        <h4 className="font-semibold text-charcoal-900 mb-4">
                          Rating Breakdown
                        </h4>
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center mb-2">
                            <span className="text-sm text-muted-foreground w-8">
                              {rating}
                            </span>
                            <Star className="w-4 h-4 text-luxury-500 fill-current mr-2" />
                            <div className="flex-1 bg-cream-200 rounded-full h-2 mr-3">
                              <div
                                className="bg-luxury-500 h-2 rounded-full"
                                style={{
                                  width: `${
                                    rating === 5 ? 80 : rating === 4 ? 15 : 5
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-muted-foreground w-8">
                              {rating === 5
                                ? "80%"
                                : rating === 4
                                ? "15%"
                                : "5%"}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-luxury-50 rounded-xl p-6">
                        <h4 className="font-semibold text-charcoal-900 mb-3">
                          What customers love:
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Exceptional quality and freshness</li>
                          <li>• Beautiful presentation and packaging</li>
                          <li>• Reliable and timely delivery</li>
                          <li>• Outstanding customer service</li>
                        </ul>
                      </div>
                    </div>

                    {/* Individual Reviews */}
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border-b border-cream-200 pb-6 last:border-b-0"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center mb-2">
                                <span className="font-medium text-sm text-charcoal-900 mr-3">
                                  {review.name}
                                </span>
                                {review.verified && (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Verified Purchase
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center">
                                {[5, 4, 3, 2, 1].map((starRating) => (
                                  <Star
                                    key={starRating}
                                    className={`w-4 h-4 ${
                                      starRating <= review.rating
                                        ? "text-luxury-500 fill-current"
                                        : "text-cream-300"
                                    }`}
                                  />
                                ))}
                                <span className="text-sm text-muted-foreground ml-2">
                                  {review.date}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-3 leading-relaxed">
                            {review.comment}
                          </p>
                          <div className="flex items-center space-x-4">
                            <button className="flex items-center text-sm text-muted-foreground hover:text-luxury-500 transition-colors">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              Helpful ({review.helpful})
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 text-center">
                      <Button variant="outline" className="bg-white">
                        Load More Reviews
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Image Modal */}
        <AnimatePresence>
          {isImageModalOpen && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsImageModalOpen(false)}
            >
              <motion.div
                className="relative max-w-4xl max-h-[90vh] w-full h-full"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
                <button
                  onClick={() => setIsImageModalOpen(false)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white"
                >
                  ×
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
