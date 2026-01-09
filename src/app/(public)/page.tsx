"use client";

import { Suspense, lazy } from "react";
import { Award } from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "../../components/ui/button";
import { LazyWrapper } from "../../components/ui/LazyWrapper";
import HeroSlider from "../../components/home/HeroSlider";
import PromotionBanner from "../../components/home/PromotionBanner";
import ShopByCategory from "../../components/home/ShopByCategory";
import { useFeaturedProducts } from "@/src/hooks/useProducts";
import { useQuery } from "@apollo/client";
import { GET_HOMPAGECONTENT } from "@/src/modules/contentManagment/oparation";
import { HomePageContent } from "@prisma/client";

// --- 1. Dynamic Imports with Preloading Capabilities ---
// We use 'dynamic' for components that need browser APIs or heavy interactivity
const SpecialOccasions = dynamic(
  () => import("../../components/home/SpecialOccasions"),
  {
    loading: () => <SectionLoader height="h-[600px]" />,
    ssr: false,
  }
);

const InSeason = dynamic(() => import("../../components/home/InSeason"), {
  loading: () => <SectionLoader height="h-[500px]" />,
  ssr: false,
});

const TestimonialSection = dynamic(
  () => import("../../components/home/TestimonialSection"),
  {
    loading: () => <SectionLoader height="h-[600px]" />,
    ssr: false,
  }
);

// We use React.lazy for standard React components to split bundles
const FeaturedProducts = lazy(
  () => import("../../components/home/FeaturedProducts")
);

// --- 2. Optimized Loader (Memoized) ---
const SectionLoader = ({ height = "h-96" }: { height?: string }) => (
  <div
    className={`w-full ${height} bg-cream-50/50 animate-pulse rounded-lg my-8`}
  />
);

// --- 3. Static Data (Moved outside component to prevent re-creation) ---
const STATS_DATA = [
  { number: "1,000+", label: "Distinguished Clients" },
  { number: "10,000+", label: "Luxury Arrangements" },
  { number: "5", label: "Years of Excellence" },
  { number: "99.9%", label: "Satisfaction Rate" },
];

export default function HomePage() {
  // --- 4. Parallel Data Fetching ---
  // Ensure these hooks don't block the UI painting
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

  const { data } = useQuery(GET_HOMPAGECONTENT, {
    fetchPolicy: "cache-first", // Prefer cache for speed
    nextFetchPolicy: "cache-first",
  });

  const content: HomePageContent = data?.getHomePageContent;

  return (
    <div className="overflow-hidden bg-background">
      {/* --- Critical Path (Above the Fold) --- */}
      {/* Render these immediately for LCP (Largest Contentful Paint) */}
      <HeroSlider slides={(content as any)?.heroSlides ?? []} />


      <ShopByCategory
        caTitle={content?.categoryTitle}
        caDesc={content?.categoryDesc}
      />
      <PromotionBanner />

      {/* --- Deferred Sections (Below the Fold) --- */}

      {/* Featured Products */}
      <LazyWrapper>
        <Suspense fallback={<SectionLoader height="h-[800px]" />}>
          <FeaturedProducts
            faTitle={content?.featureTitle}
            faSubtitle={content?.featureSubtitle}
            faDesc={content?.featureDesc}
            featuredProducts={featuredProducts ?? []}
            isLoading={isLoading}
          />
        </Suspense>
      </LazyWrapper>

      {/* Special Occasions (Commented out in your code, but kept structure) */}
      {/* 
      <LazyWrapper>
        <SpecialOccasions />
      </LazyWrapper> 
      */}

      {/* In Season */}
      <LazyWrapper>
        <InSeason
          title={content?.seasonTitle}
          subtitle={content?.seasonSubtitle}
          description={content?.seasonDesc}
        />
      </LazyWrapper>

      {/* Stats Section - Static HTML (Fastest render) */}
      <section
        className="py-24 luxury-gradient border-t border-charcoal-900/10"
        aria-labelledby="stats-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2
              id="stats-heading"
              className="font-cormorant flex flex-col items-center justify-center text-foreground"
            >
              <span className="block text-xl font-medium mb-3 opacity-80">
                {content?.excellenceTitle || "Our Excellence"}
              </span>
              <span className="text-display-md font-bold text-charcoal-900 leading-none">
                {content?.excellenceSubtitle || "By The Numbers"}
              </span>
            </h2>
          </div>

          <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
            {((content as any)?.stats || STATS_DATA).map((s: any, i: number) => (
              <div
                key={i}
                className={`
                  flex flex-col items-center justify-center text-center p-4
                  ${i !== STATS_DATA.length - 1
                    ? "lg:border-r border-charcoal-900/10"
                    : ""
                  }
                  transition-transform duration-300 hover:-translate-y-1 will-change-transform
                `}
              >
                <dd className="text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-3 font-cormorant">
                  {s.number}
                </dd>
                <dt className="text-sm font-bold text-charcoal-900 uppercase tracking-widest opacity-90">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Testimonials - Heavy component, strictly lazy loaded */}
      <LazyWrapper>
        <TestimonialSection
          taTitle={content?.testimonialTitle}
          taDesc={content?.testimonialDesc}
          testimonials={(content as any)?.testimonials ?? []}
        />
      </LazyWrapper>

      {/* Newsletter - Static Content */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Award className="w-8 h-8 text-primary mx-3" />
            <h2 className="font-cormorant text-display-sm font-bold text-foreground">
              {content?.newsletterTitle || "Stay Updated with MiskBlooming"}
            </h2>
            <Award className="w-8 h-8 text-primary mx-3" />
          </div>
          <p className="text-muted-foreground text-xl mb-8 max-w-2xl mx-auto">
            {content?.newsletterDesc ||
              "Subscribe to our newsletter for the latest in luxury floral designs, exclusive offers, and more."}
          </p>
          <form
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-xl border border-border  
              focus:ring-2 focus:ring-ring transition-all bg-background"
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
