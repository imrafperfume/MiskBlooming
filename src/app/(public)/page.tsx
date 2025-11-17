"use client";

import { Suspense, lazy, useState, useEffect } from "react";
import { Award } from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "../../components/ui/Button";
import { LazyWrapper } from "../../components/ui/LazyWrapper";

// Critical above-the-fold components (direct import)
import HeroSlider from "../../components/home/HeroSlider";
import ShopByCategory from "../../components/home/ShopByCategory";
import { useFeaturedProducts } from "@/src/hooks/useProducts";

// Non-critical sections (dynamic imports with suspense)
const FeaturedProducts = lazy(
  () => import("../../components/home/FeaturedProducts")
);
const SpecialOccasions = dynamic(
  () => import("../../components/home/SpecialOccasions"),
  { ssr: false, loading: () => <SectionLoader /> }
);
const InSeason = dynamic(() => import("../../components/home/InSeason"), {
  ssr: false,
  loading: () => <SectionLoader />,
});
const TestimonialSection = dynamic(
  () => import("../../components/home/TestimonialSection"),
  { ssr: false, loading: () => <SectionLoader height="h-64" /> }
);

// Skeleton loaders (fast paint, avoids CLS)
const SectionLoader = ({ height = "h-96" }: { height?: string }) => (
  <div className={`${height} bg-cream-200 animate-pulse rounded-lg`} />
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

  // Intersection Observer (lazy hydration strategy)
  useEffect(() => {
    const sections = Object.keys(isVisible) as (keyof typeof isVisible)[];
    const observers: IntersectionObserver[] = [];

    sections.forEach((key) => {
      const el = document.getElementById(key);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [key]: true }));
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const stats = [
    { number: "15,000+", label: "Distinguished Clients" },
    { number: "100,000+", label: "Luxury Arrangements" },
    { number: "8", label: "Years of Excellence" },
    { number: "99.9%", label: "Satisfaction Rate" },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero + Category (critical, above the fold) */}
      <HeroSlider />
      <ShopByCategory />

      {/* Featured Products */}
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

      {/* Special Occasions */}
      {/* <div id="special">
        <LazyWrapper>
          {isVisible.special ? <SpecialOccasions /> : <SectionLoader />}
        </LazyWrapper>
      </div> */}

      {/* In Season */}
      <div id="season">
        <LazyWrapper>
          {isVisible.season ? <InSeason /> : <SectionLoader />}
        </LazyWrapper>
      </div>

      {/* Stats (static, no motion for better TBT) */}
      <section className="py-24 luxury-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-cormorant flex flex-col items-center gap-1 justify-center text-2xl font-bold text-foreground mb-16">
            Why Dubai Loves MiskBlooming
            <span className="text-charcoal-900  text-display-md ">
              A Legacy of Floral Excellence
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="text-4xl lg:text-5xl font-bold text-foreground  mb-2">
                  {s.number}
                </div>
                <p className="text-charcoal-900 font-bold">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <div id="testimonial">
        <LazyWrapper>
          {isVisible.testimonial ? (
            <TestimonialSection />
          ) : (
            <SectionLoader height="h-64" />
          )}
        </LazyWrapper>
      </div>

      {/* Newsletter */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Award className="w-8 h-8 text-primary  mx-3" />
            <h2 className="font-cormorant text-display-sm font-bold text-foreground ">
              Join Our Exclusive Circle for Offers & Same-Day Delivery
            </h2>
            <Award className="w-8 h-8 text-primary  mx-3" />
          </div>
          <p className="text-muted-foreground text-xl mb-8 max-w-2xl mx-auto">
            Be the first to discover our latest collections, exclusive offers,
            and seasonal inspirations
          </p>
          <form
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-xl border border-border  
              focus:ring-2 focus:ring-luxury-500 transition-all bg-background"
              required
            />
            <Button
              variant="luxury"
              size="lg"
              type="submit"
              className="hover:text-secondary"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
