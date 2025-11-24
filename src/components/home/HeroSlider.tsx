"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "../ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import type { HeroSlide } from "../../types";
import cloudinaryLoader from "@/src/lib/imageLoader";
import { useQuery } from "@apollo/client";
import { GET_SYSTEM_SETTING } from "@/src/modules/system/operation";

interface HeroSliderProps {
  layout?: "full" | "boxed";
}

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const { data, loading: layoutLoading } = useQuery(GET_SYSTEM_SETTING);
  console.log("🚀 ~ HeroSlider ~ data:", data);
  const layout = data?.getSystemSetting.layoutStyle;
  // Sort slides by order
  const slides = useMemo(() => {
    return heroSlides.length > 0
      ? [...heroSlides]
          .filter((slide) => slide.published === true)
          .sort((a, b) => a.order - b.order)
      : [];
  }, [heroSlides]);

  useEffect(() => {
    fetchHeroSlides();
  }, []);

  const fetchHeroSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/hero-slides");
      if (!res.ok) throw new Error("Failed to fetch slides");

      const data: HeroSlide[] = await res.json();

      setHeroSlides(
        data
          .filter((s) => s.published === true)
          .sort((a, b) => a.order - b.order)
      );
    } catch (error) {
      console.error("Fetch HeroSlides Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-play logic
  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  }, [slides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  }, [slides]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  }, []);

  // Preload next slide image
  useEffect(() => {
    if (!slides[currentSlide]) return;
    const nextIndex = (currentSlide + 1) % slides.length;
    const nextImage = slides[nextIndex]?.imageUrl;
    if (nextImage && !loadedImages.has(nextImage)) {
      const img = new window.Image();
      img.src = nextImage;
      img.onload = () =>
        setLoadedImages((prev) => new Set(prev).add(nextImage));
    }
  }, [currentSlide, slides, loadedImages]);

  const handleImageLoad = useCallback((imageUrl: string) => {
    setLoadedImages((prev) => new Set(prev).add(imageUrl));
  }, []);

  const isCurrentSlideLoaded = slides[currentSlide]
    ? loadedImages.has(slides[currentSlide].imageUrl)
    : false;

  // Layout Logic
  const containerStyles =
    layout === "boxed"
      ? "relative w-full max-w-[1400px] mx-auto sm:mt-20 sm:h-[60vh] h-[60vh] sm:rounded-3xl    overflow-hidden"
      : "relative w-full sm:h-screen h-[60vh] overflow-hidden";

  // Loading Skeleton
  if (loading && slides.length === 0) {
    return (
      <div className={containerStyles}>
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
        </div>
      </div>
    );
  }

  if (slides.length === 0) return null;

  return (
    <div className={containerStyles}>
      <AnimatePresence mode="wait" initial={false}>
        {slides.map((slide, index) => {
          if (index !== currentSlide) return null;

          return (
            <motion.div
              key={slide.id}
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            >
              {/* Placeholder while Image loads */}
              {!isCurrentSlideLoaded && (
                <div className="absolute inset-0 bg-background animate-pulse" />
              )}

              {/* Background Image */}
              <Image
                loader={cloudinaryLoader}
                src={slide.imageUrl}
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover"
                onLoad={() => handleImageLoad(slide.imageUrl)}
                sizes="(max-width: 768px) 100vw, 100vw"
                quality={90}
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="max-w-2xl space-y-5"
                  >
                    {slide.subtitle && (
                      <p className="text-primary font-medium text-sm sm:text-base uppercase tracking-widest">
                        {slide.subtitle}
                      </p>
                    )}
                    <h1 className="font-bold text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]">
                      {slide.title}
                    </h1>
                    <p className="text-gray-200 text-base sm:text-lg md:text-xl leading-relaxed max-w-xl">
                      {slide.description}
                    </p>

                    {/* Buttons */}
                    {slide.buttons && (
                      <div className="flex flex-wrap gap-4 pt-4">
                        {Array.isArray(slide.buttons) ? (
                          slide.buttons.map((btn: any, idx: number) => (
                            <Link key={idx} href={btn.link || "#"}>
                              <Button
                                size="lg"
                                className={
                                  idx === 0
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                    : "bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 border border-white/20"
                                }
                              >
                                {btn.text}
                              </Button>
                            </Link>
                          ))
                        ) : (
                          // Fallback for legacy object structure
                          <Link href={slide.buttons.link || "#"}>
                            <Button size="lg">{slide.buttons.text}</Button>
                          </Link>
                        )}
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-background/20 text-white backdrop-blur-md border border-white/10 hover:bg-background/40 transition-all hidden sm:flex"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-background/20 text-white backdrop-blur-md border border-white/10 hover:bg-background/40 transition-all hidden sm:flex"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-primary w-8"
                : "bg-white/50 hover:bg-white/80 w-2"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
