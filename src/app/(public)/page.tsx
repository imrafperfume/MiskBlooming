"use client";

import { motion } from "framer-motion";
import { Suspense, lazy } from "react";
import { Button } from "../../components/ui/Button";
import { LazyWrapper } from "../../components/ui/LazyWrapper";
import { useFeaturedProducts } from "../../hooks/useProducts";
import { Truck, Shield, Headphones, Award, Crown } from "lucide-react";
import Link from "next/link";

// Critical components loaded immediately
import HeroSlider from "../../components/home/HeroSlider";
import ShopByCategory from "../../components/home/ShopByCategory";
import Loading from "@/src/components/layout/Loading";

// Lazy load non-critical components
const FeaturedProducts = lazy(
  () => import("../../components/home/FeaturedProducts")
);
const SpecialOccasions = lazy(
  () => import("../../components/home/SpecialOccasions")
);
const InSeason = lazy(() => import("../../components/home/InSeason"));
const TestimonialSection = lazy(
  () => import("../../components/home/TestimonialSection")
);

export default function HomePage() {
  const { data: featuredProducts, isLoading } = useFeaturedProducts([
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
    "compareAtPrice",
    "status",
    "tags",
    "featuredImage",
  ]);

  const stats = [
    { number: "15,000+", label: "Distinguished Clients" },
    { number: "100,000+", label: "Luxury Arrangements" },
    { number: "8", label: "Years of Excellence" },
    { number: "99.9%", label: "Satisfaction Rate" },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Shop by Category */}
      <ShopByCategory />

      {/* Features Section */}
      <LazyWrapper>
        <Suspense fallback={<Loading />}>
          <FeaturedProducts
            featuredProducts={featuredProducts ?? []}
            isLoading={isLoading}
          />
        </Suspense>
      </LazyWrapper>

      {/* Special Occasions */}
      <LazyWrapper>
        <Suspense
          fallback={
            <div className="h-96 bg-cream-200 animate-pulse rounded-lg" />
          }
        >
          <SpecialOccasions />
        </Suspense>
      </LazyWrapper>

      {/* In Season */}
      <LazyWrapper>
        <Suspense
          fallback={
            <div className="h-96 bg-cream-200 animate-pulse rounded-lg" />
          }
        >
          <InSeason />
        </Suspense>
      </LazyWrapper>

      {/* Stats Section */}
      <section className="py-24 luxury-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-cormorant text-display-md font-bold text-charcoal-900 mb-6">
              A Legacy of <span className="text-charcoal-900">Excellence</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl lg:text-5xl font-bold text-charcoal-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-charcoal-700 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <LazyWrapper>
        <Suspense fallback={<div className=" ">Loading...</div>}>
          <TestimonialSection />
        </Suspense>
      </LazyWrapper>

      {/* Newsletter */}
      <section className="py-24 bg-gradient-to-br from-cream-50 to-cream-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center mb-6">
              <Award className="w-8 h-8 text-luxury-500 mr-3" />
              <h2 className="font-cormorant text-display-sm font-bold text-charcoal-900">
                Join Our Exclusive Circle
              </h2>
              <Award className="w-8 h-8 text-luxury-500 ml-3" />
            </div>
            <p className="text-muted-foreground text-xl mb-8 max-w-2xl mx-auto">
              Be the first to discover our latest collections, exclusive offers,
              and seasonal inspirations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-xl border border-cream-400 focus:ring-2 focus:ring-luxury-500 focus:border-transparent transition-all duration-300 bg-white"
              />
              <Button variant="luxury" size="lg">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
