"use client";

import React, {
  Suspense,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Grid3X3, List, ChevronDown, X, Filter } from "lucide-react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import { useProducts } from "../../../hooks/useProducts";
import { useCategories } from "@/src/hooks/useCategories";
import { Input } from "@/src/components/ui/Input"; // Assuming you have this, otherwise standard input is used below

// Dynamic imports for performance
const Button = dynamic(() => import("../../../components/ui/Button"));
const ProductCard = dynamic(
  () => import("../../../components/product/ProductCard"),
  {
    loading: () => <ProductSkeleton />,
  }
);

// Professional Skeleton Loader
const ProductSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <div className="relative w-full aspect-[3/4] bg-muted/50 rounded-xl animate-pulse overflow-hidden" />
    <div className="space-y-2 px-1">
      <div className="h-4 bg-muted/50 rounded w-3/4 animate-pulse" />
      <div className="h-4 bg-muted/50 rounded w-1/4 animate-pulse" />
    </div>
  </div>
);

// Constants
const PRICE_RANGES = [
  { value: "all", label: "Price: All" },
  { value: "under-100", label: "Under AED 100" },
  { value: "100-300", label: "AED 100 - 300" },
  { value: "300-500", label: "AED 300 - 500" },
  { value: "over-500", label: "Over AED 500" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Sort: Featured" },
  { value: "newest", label: "Sort: Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL Params State
  const categoryParam = searchParams.get("category") || "all";
  const searchParam = searchParams.get("search") || "";

  // Local State
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [subCategory, setSubcategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Data Fetching
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

  const { data: products, isLoading: productsLoading } =
    useProducts(productFields);
  const { data: categories, isLoading: categoriesLoading } = useCategories([
    "id",
    "name",
    "subcategories{id name}",
  ]);

  // Sync state with URL params
  useEffect(() => {
    setSelectedCategory(categoryParam);
    setSearchQuery(searchParam);
  }, [categoryParam, searchParam]);

  // Derived Data
  const currentCategory = useMemo(
    () => categories?.find((cat) => cat.name === selectedCategory),
    [categories, selectedCategory]
  );

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    return products
      .filter((product) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          !searchQuery ||
          product.name?.toLowerCase().includes(query) ||
          product.shortDescription?.toLowerCase().includes(query) ||
          product.tags?.some((tag) => tag.toLowerCase().includes(query));

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
            return b.id.localeCompare(a.id); // Assuming ID is time-sortable or use createdAt
          case "rating":
            return (b.Review?.length || 0) - (a.Review?.length || 0);
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
    router.push("/products"); // Reset URL
  }, [router]);

  const isLoading = productsLoading || categoriesLoading;
  const hasActiveFilters =
    selectedCategory !== "all" ||
    subCategory !== "all" ||
    priceRange !== "all" ||
    searchQuery !== "";

  // Helper Component for Select Inputs
  const FilterSelect = ({
    value,
    onChange,
    options,
    placeholder,
    disabled = false,
  }: {
    value: string;
    onChange: (val: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    disabled?: boolean;
  }) => (
    <div className="relative group min-w-[160px] w-full sm:w-auto">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full appearance-none bg-card text-foreground border border-border rounded-lg text-sm px-4 py-2.5 pr-10 
        focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary/50"
      >
        {placeholder && <option value="all">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none group-hover:text-primary transition-colors" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-cormorant text-4xl md:text-5xl font-bold text-foreground mb-3">
            Our Collections
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover our exquisite selection of fresh flowers, luxury
            chocolates, cakes, and gifts curated for your special moments.
          </p>
        </motion.div>

        {/* Controls Bar */}
        <div className="sticky top-20 z-30 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4 sm:mx-0 sm:px-0 mb-8 border-b border-border/50 transition-all">
          <div className="flex flex-col gap-4">
            {/* Top Row: Search & View Toggle */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:max-w-md group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/60"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <button
                  className="sm:hidden flex items-center gap-2 text-sm font-medium text-foreground bg-card border border-border px-4 py-2.5 rounded-lg"
                  onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                >
                  <Filter className="w-4 h-4" /> Filters
                </button>

                <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-md transition-all ${
                      viewMode === "grid"
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-md transition-all ${
                      viewMode === "list"
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filters Row (Desktop: Always visible, Mobile: Collapsible) */}
            <motion.div
              initial={false}
              animate={
                isMobileFiltersOpen
                  ? { height: "auto", opacity: 1 }
                  : { height: "auto", opacity: 1 }
              }
              className={`flex flex-col sm:flex-row flex-wrap gap-3 items-center ${
                isMobileFiltersOpen ? "flex" : "hidden sm:flex"
              }`}
            >
              <FilterSelect
                value={selectedCategory}
                onChange={(val) => {
                  setSelectedCategory(val);
                  setSubcategory("all");
                }}
                options={
                  categories?.map((c) => ({ value: c.name, label: c.name })) ||
                  []
                }
                placeholder="All Categories"
              />

              <FilterSelect
                value={subCategory}
                onChange={setSubcategory}
                options={
                  currentCategory?.subcategories?.map((s) => ({
                    value: s.name,
                    label: s.name,
                  })) || []
                }
                placeholder="Subcategory"
                disabled={
                  selectedCategory === "all" ||
                  !currentCategory?.subcategories?.length
                }
              />

              <FilterSelect
                value={priceRange}
                onChange={setPriceRange}
                options={PRICE_RANGES}
              />

              <div className="sm:ml-auto w-full sm:w-auto">
                <FilterSelect
                  value={sortBy}
                  onChange={setSortBy}
                  options={SORT_OPTIONS}
                />
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors px-2"
                >
                  Reset
                </button>
              )}
            </motion.div>
          </div>
        </div>

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10"
            >
              {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </motion.div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-cormorant text-2xl font-bold text-foreground mb-2">
                No products found
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                We couldn't find any products matching your current filters. Try
                adjusting your search or clearing filters.
              </p>
              <Button onClick={handleClearFilters} variant="luxury">
                Clear All Filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
              className={`
                grid gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10
                ${
                  viewMode === "grid"
                    ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                    : "grid-cols-1 max-w-3xl mx-auto"
                }
              `}
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
        </AnimatePresence>

        {/* Results Count Footer */}
        {!isLoading && filteredAndSortedProducts.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Showing {filteredAndSortedProducts.length} results
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
