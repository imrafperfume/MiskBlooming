import Link from "next/link";
import React from "react";
import Button from "../ui/Button";
import { ArrowRight, Sparkles } from "lucide-react";
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
  return (
    <section className="sm:py-24 py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-luxury-500 mr-2" />
            <span className="text-luxury-500 font-medium tracking-wide">
              SIGNATURE COLLECTIONS
            </span>
            <Sparkles className="w-6 h-6 text-luxury-500 ml-2" />
          </div>
          <h2 className="font-cormorant sm:text-display-md text-display-sm font-bold text-charcoal-900 mb-6">
            Masterpieces in <span className="luxury-text">Bloom</span>
          </h2>
          <p className="text-muted-foreground sm:text-xl text-base max-w-3xl mx-auto">
            Discover our curated selection of premium arrangements, each a
            testament to luxury and artistry
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-cream-500 rounded-2xl h-96 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            {!featuredProducts || featuredProducts.length === 0 ? (
              <div className="mt-10 flex items-center justify-center">
                <p className="font-normal text-2xl text-luxury-500">
                  No Products Found
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                {featuredProducts?.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    viewMode="grid"
                  />
                ))}
              </div>
            )}
          </>
        )}

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Link href="/products" className="hidden sm:inline-block">
            <Button
              variant="outline"
              size="xl"
              className="group bg-transparent"
            >
              Explore All Collections
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>{" "}
          <Link href="/products" className="sm:hidden inline-block">
            <Button
              variant="outline"
              size="sm"
              className="group bg-transparent"
            >
              Explore All Collections
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
