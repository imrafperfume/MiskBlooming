"use client";
import React, { Suspense } from "react";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Grid3X3, List, ChevronDown } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import ProductCard from "../../../components/product/ProductCard";
import { useProducts } from "../../../hooks/useProducts";
import categoriesData from "../../../data/categories.json";
import { useSearchParams } from "next/navigation";
export default function ProductsPage() {
  const { data: products, isLoading } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // search url categoru
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  // category Data
  const categories = categoriesData;

  // useEffect for filter category
  useEffect(() => {
    setSelectedCategory(category || "all");
  }, [category]);

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    const filtered = products.filter((product) => {
      // Search filter
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) &&
        !product.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ) {
        return false;
      }

      // Category filter
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }

      // Price range filter
      if (priceRange !== "all") {
        const price = product.price;
        switch (priceRange) {
          case "under-100":
            return price < 100;
          case "100-300":
            return price >= 100 && price <= 300;
          case "300-500":
            return price >= 300 && price <= 500;
          case "over-500":
            return price > 500;
          default:
            return true;
        }
      }

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return b.id.localeCompare(a.id);
        case "featured":
        default:
          return b.featured === a.featured ? 0 : b.featured ? 1 : -1;
      }
    });

    return filtered;
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "under-100", label: "Under AED 100" },
    { value: "100-300", label: "AED 100 - 300" },
    { value: "300-500", label: "AED 300 - 500" },
    { value: "over-500", label: "Over AED 500" },
  ];

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen mt-10 bg-gradient-to-br from-cream-50 to-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-cormorant text-4xl md:text-5xl font-bold text-luxury-500 mb-4">
              Our Collections
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our exquisite selection of fresh flowers, luxury
              chocolates, delicious cakes, thoughtful gift sets, and beautiful
              plants
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search flowers, chocolates, cakes, gifts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-cream-400 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
                />
              </div>

              {/* Filter Controls */}
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4 items-center">
                  {/* Category Filter */}
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="appearance-none bg-white border border-cream-400 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>

                  {/* Price Range Filter */}
                  <div className="relative">
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="appearance-none bg-white border border-cream-400 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
                    >
                      {priceRanges.map((range) => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>

                  {/* Sort Filter */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border border-cream-400 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* View Mode and Results */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {filteredAndSortedProducts.length} products found
                  </span>

                  <div className="flex items-center border border-cream-400 rounded-lg">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${
                        viewMode === "grid"
                          ? "bg-luxury-500 text-charcoal-900"
                          : "text-muted-foreground hover:text-charcoal-900"
                      } transition-colors`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${
                        viewMode === "list"
                          ? "bg-luxury-500 text-charcoal-900"
                          : "text-muted-foreground hover:text-charcoal-900"
                      } transition-colors`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Products Grid/List */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl h-96 animate-pulse"
                />
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
              <h3 className="font-cormorant text-2xl font-bold text-charcoal-900 mb-4">
                No products found
              </h3>
              <p className="text-muted-foreground mb-8">
                Try adjusting your search or filter criteria
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setPriceRange("all");
                  setSortBy("featured");
                }}
                variant="luxury"
              >
                Clear All Filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              className={`grid gap-8 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {filteredAndSortedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </Suspense>
  );
}
