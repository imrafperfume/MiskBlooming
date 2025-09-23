"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import Button from "../ui/Button";
import { ArrowRight, Grid3X3, List, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "../product/ProductCard";
import { Product } from "@/src/types";

function FeaturedProducts({
  featuredProducts,
  isLoading,
}: {
  featuredProducts: Product[];
  isLoading: boolean;
}) {
  const [viewMode, setViewMode] = useState("grid");

  // Memoize the loading skeletons to prevent re-renders
  const loadingSkeletons = useMemo(
    () =>
      [...Array(6)].map((_, i) => (
        <div key={i} className="bg-cream-200 rounded-2xl h-96 animate-pulse" />
      )),
    []
  );

  // Memoize product cards to prevent unnecessary re-renders
  const productCards = useMemo(
    () =>
      featuredProducts?.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      )),
    [featuredProducts]
  );

  // Optimize motion props with reduced animations for better performance
  const motionProps = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
    viewport: { once: true, margin: "50px" },
  };

  return (
    <section className="sm:py-24 py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section - Optimized motion */}
        <motion.div className="text-center mb-16" {...motionProps}>
          <div className="flex items-center justify-center sm:mb-4 mb-2">
            <Sparkles className="w-5 h-5 text-luxury-500 mr-2" />
            <span className="text-luxury-500 font-medium tracking-wide text-sm">
              SIGNATURE COLLECTIONS
            </span>
            <Sparkles className="w-5 h-5 text-luxury-500 ml-2" />
          </div>
          <h2 className="font-cormorant sm:text-display-md text-display-sm font-bold text-charcoal-900 sm:mb-6 mb-2">
            Masterpieces in <span className="luxury-text">Bloom</span>
          </h2>
          <p className="text-muted-foreground sm:text-lg text-base max-w-3xl mx-auto leading-relaxed">
            Discover our curated selection of premium arrangements, each a
            testament to luxury and artistry
          </p>
          <div className="flex sm:hidden items-center justify-center mt-4 gap-1 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${
                viewMode === "grid"
                  ? "bg-luxury-500 text-charcoal-900"
                  : "text-muted-foreground hover:text-charcoal-900"
              } transition-colors`}
            >
              <Grid3X3 className="w-6 h-6" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${
                viewMode === "list"
                  ? "bg-luxury-500 text-charcoal-900"
                  : "text-muted-foreground hover:text-charcoal-900"
              } transition-colors`}
            >
              <List className="w-6 h-6" />
            </button>
          </div>
        </motion.div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 sm:gap-8 gap-4">
            {loadingSkeletons}
          </div>
        ) : (
          <>
            {!featuredProducts || featuredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="font-normal text-xl text-gray-500">
                  No featured products available at the moment
                </p>
              </div>
            ) : (
              <div
                className={`grid sm:grid-cols-3 lg:grid-cols-4 sm:gap-8 gap-4 ${
                  viewMode === "grid" ? "grid-cols-2" : "grid-cols-1"
                }`}
              >
                {productCards}
              </div>
            )}
          </>
        )}

        {/* CTA Button - Conditional rendering to avoid layout shift */}
        {featuredProducts && featuredProducts.length > 0 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link href="/products" className="inline-block">
              <Button
                variant="outline"
                size="lg"
                className="group bg-transparent sm:text-base text-sm"
              >
                Explore All Collections
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Export with React.memo for performance
export default React.memo(FeaturedProducts);
