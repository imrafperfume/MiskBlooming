"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import type { HeroSlide } from "../../types";
import heroSlidesData from "../../data/hero-slides.json";

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  // Memoize slides data to prevent unnecessary re-renders
  const slides = useMemo(() => heroSlidesData as HeroSlide[], []);

  // Optimized auto-play with cleanup
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  // Memoized navigation functions
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  }, []);

  // Preload images - Corrected version
  useEffect(() => {
    const preloadImages = async () => {
      // Preload next image
      const nextIndex = (currentSlide + 1) % slides.length;
      const nextSlideImage = slides[nextIndex].image;

      if (!loadedImages.has(nextSlideImage)) {
        try {
          // Use proper image preloading for Next.js
          const img = document.createElement("img");
          img.src = nextSlideImage;
          img.onload = () => {
            setLoadedImages((prev) => new Set(prev).add(nextSlideImage));
          };
        } catch (error) {
          console.warn("Failed to preload image:", error);
        }
      }
    };

    preloadImages();
  }, [currentSlide, slides, loadedImages]);

  // Handle image load
  const handleImageLoad = useCallback((imageUrl: string) => {
    setLoadedImages((prev) => new Set(prev).add(imageUrl));
  }, []);

  // Check if current slide image is loaded
  const isCurrentSlideLoaded = loadedImages.has(slides[currentSlide]?.image);

  // Optimized image configuration
  const imageConfig = {
    fill: true,
    className: "object-cover",
    priority: currentSlide === 0, // Only first image gets priority
    quality: 85, // Reduced quality for better performance
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw",
  };

  // Memoized slide content to prevent unnecessary re-renders
  const slideContent = useMemo(
    () => (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentSlide}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Loading state */}
          {!isCurrentSlideLoaded && (
            <div className="absolute inset-0 bg-charcoal-900 animate-pulse" />
          )}

          <Image
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            {...imageConfig}
            onLoad={() => handleImageLoad(slides[currentSlide].image)}
            style={{
              opacity: isCurrentSlideLoaded ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/70 via-charcoal-900/30 to-transparent" />
        </motion.div>
      </AnimatePresence>
    ),
    [currentSlide, slides, imageConfig, isCurrentSlideLoaded, handleImageLoad]
  );

  // Memoized text content animation
  const textContent = useMemo(
    () => (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.p
            className="text-luxury-400 sm:text-lg text-base font-medium mb-4 tracking-wide"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {slides[currentSlide].subtitle}
          </motion.p>

          <motion.h1
            className="font-cormorant sm:text-display-lg text-display-md lg:text-display-xl font-bold text-cream-50 mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {slides[currentSlide].title}
          </motion.h1>

          <motion.p
            className="text-cream-100 sm:text-xl leading-relaxed mb-8 max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {slides[currentSlide].description}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <Link
              href={slides[currentSlide].cta.link}
              className="sm:flex hidden"
              prefetch={true}
            >
              <Button
                variant="luxury"
                size="xl"
                className="group sm:w-auto w-full"
              >
                {slides[currentSlide].cta.text}
                <motion.span
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                >
                  →
                </motion.span>
              </Button>
            </Link>

            <Link
              href={slides[currentSlide].cta.link}
              className="sm:hidden flex"
              prefetch={true}
            >
              <Button
                variant="luxury"
                size="lg"
                className="group sm:w-auto w-full"
              >
                {slides[currentSlide].cta.text}
                <motion.span
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                >
                  →
                </motion.span>
              </Button>
            </Link>

            <Button
              variant="outline"
              size="xl"
              className="border-cream-50 sm:flex hidden text-cream-50 hover:bg-cream-50 hover:text-charcoal-900 bg-transparent"
            >
              View Gallery
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-cream-50 sm:hidden flex text-cream-50 hover:bg-cream-50 hover:text-charcoal-900 bg-transparent"
            >
              View Gallery
            </Button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    ),
    [currentSlide, slides]
  );

  // Memoized navigation indicators
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
    [slides.length, currentSlide, goToSlide]
  );

  return (
    <div className="relative sm:h-screen h-1/3 overflow-hidden">
      {slideContent}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mt-16 sm:mt-0 mx-auto px-4 sm:py-0 py-6 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">{textContent}</div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute sm:inline-block hidden left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full glass-effect bg-white/20 transition-all duration-300 group hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-luxury-400"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-cream-50 group-hover:text-luxury-400 transition-colors" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute sm:inline-block hidden right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full glass-effect bg-gray-600/20 transition-all duration-300 group hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-luxury-400"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-cream-50 group-hover:text-luxury-400 transition-colors" />
      </button>

      {slideIndicators}

      {/* Progress Bar */}
      <div className="absolute bottom-0 sm:flex hidden left-0 right-0 h-1 bg-white/20">
        <motion.div
          className="h-full bg-luxury-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 6, ease: "linear" }}
          key={currentSlide}
        />
      </div>
    </div>
  );
};

export default HeroSlider;
