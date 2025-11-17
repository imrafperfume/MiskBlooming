"use client";

import React, {
  Suspense,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from "react";
import { motion } from "framer-motion";
import { Search, Grid3X3, List, ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useProducts } from "../../../hooks/useProducts";
import { useCategories } from "@/src/hooks/useCategories";

// Dynamic imports with lightweight fallback
const Button = dynamic(() => import("../../../components/ui/Button"), {
  loading: () => <button className="btn-loading">Loading...</button>,
});
const ProductCard = dynamic(
  () => import("../../../components/product/ProductCard"),
  {
    loading: () => <div className="card-loading">Loading product...</div>,
  }
);

// Skeleton components
const ProductSkeleton = () => (
  <div className="bg-background rounded-2xl h-96 animate-pulse" />
);
const FilterSkeleton = () => (
  <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
);

// Filters & sorting constants
const PRICE_RANGES = [
  { value: "all", label: "All Prices" },
  { value: "under-100", label: "Under AED 100" },
  { value: "100-300", label: "AED 100 - 300" },
  { value: "300-500", label: "AED 300 - 500" },
  { value: "over-500", label: "Over AED 500" },
];
const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "all";
  const search = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState(category);
  const [subCategory, setSubcategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState(search);

  const productFields = [
    "id",
    "name",
    "slug",
    "category",
    "shortDescription",
    "price",
    "compareAtPrice",
    "quantity",
    "images {url}",
    "featured",
    "status",
    "tags",
    "featuredImage",
    "Review {rating}",
  ];

  const { data: products, isLoading } = useProducts(productFields);
  const { data: categories } = useCategories([
    "id",
    "name",
    "subcategories{id name}",
  ]);

  useEffect(() => setSelectedCategory(category), [category]);

  const currentCategory = useMemo(
    () => categories?.find((cat) => cat.name === selectedCategory),
    [categories, selectedCategory]
  );

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    return products
      .filter((product) => {
        const matchesSearch =
          !searchQuery ||
          product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.shortDescription
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          );

        const matchesCategory =
          selectedCategory === "all" || product.category === selectedCategory;
        const matchesSub =
          subCategory === "all" ||
          product.subcategory?.toLowerCase() === subCategory.toLowerCase();

        let matchesPrice = true;
        if (priceRange !== "all") {
          const p = product.price;
          matchesPrice =
            (priceRange === "under-100" && p < 100) ||
            (priceRange === "100-300" && p >= 100 && p <= 300) ||
            (priceRange === "300-500" && p >= 300 && p <= 500) ||
            (priceRange === "over-500" && p > 500);
        }

        return matchesSearch && matchesCategory && matchesSub && matchesPrice;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "newest":
            return b.id.localeCompare(a.id);
          case "featured":
            return b.featured === a.featured ? 0 : b.featured ? 1 : -1;
          default:
            return 0;
        }
      });
  }, [
    products,
    searchQuery,
    selectedCategory,
    subCategory,
    priceRange,
    sortBy,
  ]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSubcategory("all");
    setPriceRange("all");
    setSortBy("featured");
  }, []);

  const renderFilters = useCallback(
    () => (
      <div className="sm:flex grid grid-cols-2 sm:flex-wrap gap-4 items-center">
        {/* Category */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSubcategory("all");
            }}
            className="appearance-none bg-background border border-border  rounded-lg text-sm sm:text-lg sm:px-4 px-2 py-2 sm:pr-8 focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute sm:right-2 right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Subcategory */}
        <div className="relative">
          <select
            value={subCategory}
            onChange={(e) => setSubcategory(e.target.value)}
            className="appearance-none bg-background border border-border  rounded-lg text-sm sm:text-lg sm:px-4 px-2 py-2 sm:pr-8 focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
          >
            <option value="all">Select Subcategory</option>
            {currentCategory?.subcategories?.map((sub) => (
              <option key={sub.id} value={sub.name}>
                {sub.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute sm:right-2 right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Price */}
        <div className="relative">
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="appearance-none bg-background border border-border  rounded-lg text-sm sm:text-lg sm:px-4 px-2 py-2 sm:pr-8 focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
          >
            {PRICE_RANGES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute sm:right-2 right-8 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-background border border-border  rounded-lg text-sm sm:text-lg sm:px-4 px-2 py-2 sm:pr-8 focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute sm:right-2 right-8 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>
    ),
    [
      selectedCategory,
      subCategory,
      priceRange,
      sortBy,
      categories,
      currentCategory,
    ]
  );

  return (
    <Suspense
      fallback={
        <div className="min-h-screen mt-16 bg-background">Loading...</div>
      }
    >
      <div className="min-h-screen mt-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            className="text-center sm:mb-12 mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-cormorant text-4xl md:text-5xl font-bold text-primary  mb-4">
              Our Collections
            </h1>
            <p className="sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our exquisite selection of fresh flowers, luxury
              chocolates, cakes, gift sets, and plants
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            className="mb-4 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-background rounded-2xl sm:p-6 py-4 sm:py-0">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search flowers, chocolates, cakes, gifts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-border  rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
                />
              </div>

              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {isLoading ? (
                  <div className="flex gap-4 w-full">
                    <FilterSkeleton />
                    <FilterSkeleton />
                    <FilterSkeleton />
                  </div>
                ) : (
                  renderFilters()
                )}

                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {filteredAndSortedProducts.length} products found
                  </span>
                  <div className="flex sm:hidden items-center border border-border  rounded-lg">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${
                        viewMode === "grid"
                          ? "bg-foreground 0 text-foreground "
                          : "text-muted-foreground hover:text-foreground "
                      } transition-colors`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${
                        viewMode === "list"
                          ? "bg-foreground 0 text-foreground "
                          : "text-muted-foreground hover:text-foreground "
                      } transition-colors`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Products */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-24 h-24 bg-cream-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-cream-400" />
              </div>
              <h3 className="font-cormorant text-2xl font-bold text-foreground  mb-4">
                No products found
              </h3>
              <p className="text-muted-foreground mb-8">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={handleClearFilters} variant="luxury">
                Clear All Filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              className={`grid sm:gap-8 gap-2 ${
                viewMode === "grid"
                  ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {filteredAndSortedProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </Suspense>
  );
}
