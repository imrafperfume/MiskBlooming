"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import type { HeroSlide } from "../../types";
import cloudinaryLoader from "@/src/lib/imageLoader";


// --- Types ---
interface ButtonLink {
  text: string;
  link: string;
}

// Normalize legacy data structures if necessary
interface NormalizedHeroSlide extends Omit<HeroSlide, "buttons"> {
  buttons: ButtonLink[];
}

const HeroSlider = ({ slides = [], layout = "full" }: { slides?: any[], layout?: string }) => {
  // --- State ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState<NormalizedHeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Layout is now passed as a prop


  useEffect(() => {
    if (slides && slides.length > 0) {
      // Normalize props data
      const processed = slides.map((slide: any, index: number) => ({
        id: `slide-${index}`,
        title: slide.title,
        subtitle: slide.subtitle,
        description: slide.description || slide.subtitle,
        imageUrl: slide.image || slide.imageUrl, // Handle both structures
        buttons: slide.link ? [{ text: "Shop Now", link: slide.link }] : (slide.buttons || []),
        published: true,
        order: index
      }));
      setHeroSlides(processed);
      setIsLoading(false);
    } else {
      // Fetch from existing API (dashboard/hero system)
      const fetchSlides = async () => {
        try {
          const res = await fetch("/api/hero-slides");
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              // Determine if we need to filter by 'published' (usually API returns all for admin, but verify)
              // Assuming client-side should show only published?
              // The API seems to return all. Let's filter here if needed, or assume API handles it?
              // Looking at route.ts, it returns all. Client should filter.
              const published = data.filter((s: any) => s.published !== false);

              if (published.length > 0) {
                const sorted = published.sort((a: any, b: any) => a.order - b.order);
                setHeroSlides(sorted);
                setIsLoading(false);
                return;
              }
            }
          }
        } catch (e) {
          console.error("Failed to fetch hero slides", e);
        }

        // Fallback if API fails or is empty
        const defaultSlide: NormalizedHeroSlide = {
          id: "default-hero",
          title: "Welcome to Misk Blooming",
          subtitle: "Luxury Floral Arrangements",
          description: "Experience the elegance of our hand-crafted bouquets designed for every occasion.",
          imageUrl: "/luxury-flower-shop.png",
          buttons: [{ text: "Shop Collection", link: "/products" }],
          published: true,
          order: 0
        };
        setHeroSlides([defaultSlide]);
        setIsLoading(false);
      };

      fetchSlides();
    }
  }, [slides]);

  // --- Auto Play Logic ---
  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
  }, [heroSlides.length]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  }, []);

  // Reset timer on slide change
  useEffect(() => {
    if (heroSlides.length > 0) startAutoPlay();
    return () => stopAutoPlay();
  }, [currentSlide, heroSlides.length, startAutoPlay, stopAutoPlay]);

  // --- Navigation ---
  const nextSlide = useCallback(() => {
    stopAutoPlay();
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, [heroSlides.length, stopAutoPlay]);

  const prevSlide = useCallback(() => {
    stopAutoPlay();
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  }, [heroSlides.length, stopAutoPlay]);

  // --- Preloading Strategy ---
  // Purely functional preloading, no state updates to prevent re-renders
  useEffect(() => {
    if (heroSlides.length < 2) return;
    const nextIndex = (currentSlide + 1) % heroSlides.length;
    const img = new window.Image();
    img.src = cloudinaryLoader({
      src: heroSlides[nextIndex].imageUrl,
      width: 1920,
      quality: 75,
    });
  }, [currentSlide, heroSlides]);

  // --- Layout Classes ---
  // Calculated immediately, defaulting to 'full' to prevent collapse
  const containerStyles =
    layout === "boxed"
      ? "relative w-full max-w-[1400px] mx-auto sm:mt-20 sm:h-[60vh] h-[60vh] sm:rounded-3xl overflow-hidden shadow-2xl"
      : "relative w-full h-[60vh] sm:h-screen overflow-hidden";

  // --- Render ---
  if (isLoading) {
    return (
      <div className={containerStyles}>
        <div className="absolute inset-0 bg-muted/20 animate-pulse flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
        </div>
      </div>
    );
  }

  if (heroSlides.length === 0) return null;

  return (
    <div
      className={containerStyles}
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
      role="region"
      aria-label="Hero Slider"
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={currentSlide}
          className="absolute inset-0 w-full h-full will-change-transform"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        >
          {/* Background Image */}
          <Image
            loader={cloudinaryLoader}
            src={heroSlides[currentSlide].imageUrl}
            alt={heroSlides[currentSlide].title}
            fill
            priority={true} // Always priority for the active slide in hero
            className="object-cover"
            sizes="100vw"
            quality={85} // Slightly reduced from 90 for performance
          />

          {/* Gradient Overlay - Static to avoid repaint */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent pointer-events-none" />

          {/* Text Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="max-w-2xl space-y-6"
              >
                {heroSlides[currentSlide].subtitle && (
                  <p className="text-primary font-medium text-sm sm:text-base uppercase tracking-widest">
                    {heroSlides[currentSlide].subtitle}
                  </p>
                )}

                <h1 className="font-bold text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight drop-shadow-lg">
                  {heroSlides[currentSlide].title}
                </h1>

                <p className="text-gray-100/90 text-base sm:text-lg md:text-xl leading-relaxed max-w-xl font-light">
                  {heroSlides[currentSlide].description}
                </p>

                {/* Buttons */}
                {heroSlides[currentSlide].buttons.length > 0 && (
                  <div className="flex flex-wrap gap-4 pt-2">
                    {heroSlides[currentSlide].buttons.map((btn, idx) => (
                      <Link key={idx} href={btn.link || "#"}>
                        <Button
                          size="lg"
                          className={`
                            transition-all duration-300
                            ${idx === 0
                              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105"
                              : "bg-white/10 text-white backdrop-blur-md hover:bg-white/20 border border-white/30"
                            }
                          `}
                        >
                          {btn.text}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute inset-x-0 bottom-10 z-20 px-4 sm:px-12 flex justify-between items-end pointer-events-none">
        {/* Indicators */}
        <div className="flex space-x-3 pointer-events-auto">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                stopAutoPlay();
                setCurrentSlide(index);
              }}
              className={`h-1.5 rounded-full transition-all duration-500 ${index === currentSlide
                ? "bg-primary w-12"
                : "bg-white/40 hover:bg-white/80 w-6"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Arrows (Hidden on mobile to show more image) */}
        <div className="hidden sm:flex gap-3 pointer-events-auto">
          <button
            onClick={prevSlide}
            className="p-3 rounded-full bg-black/20 text-white backdrop-blur-sm border border-white/10 hover:bg-primary hover:border-primary transition-colors"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="p-3 rounded-full bg-black/20 text-white backdrop-blur-sm border border-white/10 hover:bg-primary hover:border-primary transition-colors"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
