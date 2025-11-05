"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import type { HeroSlide } from "../../types";

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(false);

  // Sort slides by order
  const slides = useMemo(() => {
    return heroSlides.length > 0
      ? [...heroSlides]
          .filter((slide) => slide.published === true) // Filter unpublished slides
          .sort((a, b) => a.order - b.order) // Sort by order
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

      // ✅ Filter & sort here too for safe measure
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
  // Auto-play
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

  const imageConfig = {
    fill: true,
    className: "object-cover",
    priority: currentSlide === 0,
    quality: 85,
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw",
  };

  const slideContent = useMemo(() => {
    if (!slides[currentSlide]) return null;
    const slide = slides[currentSlide];
    return (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {!isCurrentSlideLoaded && (
            <div className="absolute inset-0 bg-charcoal-900 animate-pulse" />
          )}
          <Image
            src={slide.imageUrl}
            alt={slide.title}
            {...imageConfig}
            onLoad={() => handleImageLoad(slide.imageUrl)}
            style={{
              opacity: isCurrentSlideLoaded ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/70 via-charcoal-900/30 to-transparent" />
        </motion.div>
      </AnimatePresence>
    );
  }, [currentSlide, slides, isCurrentSlideLoaded, handleImageLoad]);

  const textContent = useMemo(() => {
    if (!slides[currentSlide]) return null;
    const slide = slides[currentSlide];
    return (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-luxury-400 sm:text-lg text-base font-medium mb-4 tracking-wide">
            {slide.subtitle}
          </p>
          <h1 className="font-cormorant sm:text-display-lg text-display-md lg:text-display-xl font-bold text-cream-50 mb-6 leading-tight">
            {slide.title}
          </h1>
          <p className="text-cream-100 sm:text-xl leading-relaxed mb-8 max-w-2xl">
            {slide.description}
          </p>
          {slide.buttons && (
            <div className="flex flex-col sm:flex-row gap-4">
              {Array.isArray(slide.buttons) ? (
                slide.buttons.length > 0 &&
                slide.buttons.map((btn, idx) => (
                  <Link key={idx} href={btn.link}>
                    <Button variant="luxury" size="xl">
                      {btn.text}
                    </Button>
                  </Link>
                ))
              ) : (
                <Link href={slide.buttons.link}>
                  <Button variant="luxury" size="xl">
                    {slide.buttons.text}
                  </Button>
                </Link>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }, [currentSlide, slides]);

  const slideIndicators = useMemo(
    () => (
      <div className="absolute lg:bottom-8 md:bottom-8 sm:flex hidden bottom-4 left-1/2 -translate-x-1/2 z-20 space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-luxury-500 scale-125"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    ),
    [slides, currentSlide, goToSlide]
  );

  return (
    <div className="relative sm:h-screen h-1/3 overflow-hidden">
      {slideContent}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mt-16 sm:mt-0 mx-auto px-4 sm:py-0 py-6 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">{textContent}</div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute sm:inline-block hidden left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full glass-effect bg-white/20 hover:bg-white/30"
      >
        <ChevronLeft className="w-6 h-6 text-cream-50 hover:text-luxury-400" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute sm:inline-block hidden right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full glass-effect bg-gray-600/20 hover:bg-white/30"
      >
        <ChevronRight className="w-6 h-6 text-cream-50 hover:text-luxury-400" />
      </button>

      {slideIndicators}
    </div>
  );
};

export default HeroSlider;
