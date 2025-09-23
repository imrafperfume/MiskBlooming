"use client";

import { motion } from "framer-motion";
import { Suspense, lazy, useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { LazyWrapper } from "../../components/ui/LazyWrapper";
import { Award } from "lucide-react";

// Critical components loaded immediately
import HeroSlider from "../../components/home/HeroSlider";
import ShopByCategory from "../../components/home/ShopByCategory";
import { useFeaturedProducts } from "@/src/hooks/useProducts";

// Optimized lazy loading with preloading
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
// Simple loading components
const SectionLoader = ({ height = "h-96" }: { height?: string }) => (
  <div className={`${height} bg-cream-200 animate-pulse rounded-lg`} />
);

const StatsLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-24">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="text-center">
        <div className="h-12 bg-cream-200 rounded mb-2 mx-auto w-32"></div>
        <div className="h-6 bg-cream-200 rounded w-24 mx-auto"></div>
      </div>
    ))}
  </div>
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
    "Review {rating}",
  ]);

  const [isVisible, setIsVisible] = useState({
    featured: false,
    special: false,
    season: false,
    testimonial: false,
  });

  // Intersection Observer for strategic loading
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const createObserver = (key: keyof typeof isVisible, threshold = 0.1) => {
      const element = document.getElementById(key);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible((prev) => ({ ...prev, [key]: true }));
              observer.disconnect();
            }
          });
        },
        { threshold }
      );

      observer.observe(element);
      observers.push(observer);
    };

    // Create observers for each section
    createObserver("featured");
    createObserver("special", 0.05);
    createObserver("season", 0.05);
    createObserver("testimonial", 0.1);

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const stats = [
    { number: "15,000+", label: "Distinguished Clients" },
    { number: "100,000+", label: "Luxury Arrangements" },
    { number: "8", label: "Years of Excellence" },
    { number: "99.9%", label: "Satisfaction Rate" },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Slider - Critical */}
      <HeroSlider />

      {/* Shop by Category - Critical */}
      <ShopByCategory />

      {/* Featured Products - Lazy with intersection observer */}
      <div id="featured">
        <LazyWrapper>
          <Suspense fallback={<SectionLoader height="h-80" />}>
            {isVisible.featured ? (
              <FeaturedProducts
                featuredProducts={featuredProducts ?? []}
                isLoading={isLoading}
              />
            ) : (
              <SectionLoader height="h-80" />
            )}
          </Suspense>
        </LazyWrapper>
      </div>

      {/* Special Occasions - Lazy with intersection observer */}
      <div id="special">
        <LazyWrapper>
          <Suspense fallback={<SectionLoader />}>
            {isVisible.special ? <SpecialOccasions /> : <SectionLoader />}
          </Suspense>
        </LazyWrapper>
      </div>

      {/* In Season - Lazy with intersection observer */}
      <div id="season">
        <LazyWrapper>
          <Suspense fallback={<SectionLoader />}>
            {isVisible.season ? <InSeason /> : <SectionLoader />}
          </Suspense>
        </LazyWrapper>
      </div>

      {/* Stats Section - Optimized with minimal motion */}
      <section className="py-24 luxury-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-cormorant text-display-md font-bold text-charcoal-900 mb-6">
              A Legacy of <span className="text-charcoal-900">Excellence</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-charcoal-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-charcoal-700 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Lazy with intersection observer */}
      <div id="testimonial">
        <LazyWrapper>
          <Suspense fallback={<SectionLoader height="h-64" />}>
            {isVisible.testimonial ? (
              <TestimonialSection />
            ) : (
              <SectionLoader height="h-64" />
            )}
          </Suspense>
        </LazyWrapper>
      </div>

      {/* Newsletter - Optimized with conditional motion */}
      <section className="py-24 bg-gradient-to-br from-cream-50 to-cream-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
        </div>
      </section>
    </div>
  );
}

// Optimized motion components for better performance
const OptimizedMotion = {
  div: motion.div,
};

// Alternative version without motion for maximum performance
export function HomePageStatic() {
  const { data: featuredProducts, isLoading } = useFeaturedProducts([
    "id",
    "name",
    "slug",
    "category",
  ]);

  return (
    <div className="overflow-hidden">
      <HeroSlider />
      <ShopByCategory />

      <Suspense fallback={<SectionLoader height="h-80" />}>
        <FeaturedProducts
          featuredProducts={featuredProducts ?? []}
          isLoading={isLoading}
        />
      </Suspense>

      {/* Rest of the static content */}
    </div>
  );
}
