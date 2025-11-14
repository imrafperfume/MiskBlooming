"use client";

import { motion } from "framer-motion";

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="h-12 bg-cream-200 rounded-lg w-96 mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-cream-200 rounded-lg w-2/3 mx-auto animate-pulse" />
        </div>

        {/* Search and Filters Skeleton */}
        <div className="bg-background rounded-2xl p-6 shadow-lg mb-8">
          <div className="h-12 bg-cream-200 rounded-lg mb-6 animate-pulse" />
          <div className="flex flex-wrap gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-10 bg-cream-200 rounded-lg w-32 animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="bg-background rounded-2xl overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <div className="aspect-square bg-cream-200 animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-cream-200 rounded animate-pulse" />
                <div className="h-6 bg-cream-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-cream-200 rounded w-1/2 animate-pulse" />
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-cream-200 rounded w-20 animate-pulse" />
                  <div className="h-8 bg-cream-200 rounded w-24 animate-pulse" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
