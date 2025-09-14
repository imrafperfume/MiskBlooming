"use client";

import { useState, useEffect } from "react";
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
  const slides = heroSlidesData as HeroSlide[];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative sm:h-screen h-1/3 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <Image
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/70 via-charcoal-900/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mt-16 sm:mt-0 mx-auto px-4 sm:py-0 py-6 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <AnimatePresence mode="wait">
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
                  >
                    <Button
                      variant="luxury"
                      size="xl"
                      className="group sm:w-auto w-full "
                    >
                      {slides[currentSlide].cta.text}
                      <motion.span
                        className="ml-2 "
                        animate={{ x: [0, 5, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      >
                        →
                      </motion.span>
                    </Button>
                  </Link>{" "}
                  <Link
                    href={slides[currentSlide].cta.link}
                    className="sm:hidden flex"
                  >
                    <Button
                      variant="luxury"
                      size="lg"
                      className="group sm:w-auto w-full "
                    >
                      {slides[currentSlide].cta.text}
                      <motion.span
                        className="ml-2 "
                        animate={{ x: [0, 5, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
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
                  </Button>{" "}
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
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute sm:inline-block hidden left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full glass-effect bg-white/20 transition-all duration-300 group"
      >
        <ChevronLeft className="w-6 h-6 text-cream-50 group-hover:text-luxury-400 transition-colors" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute sm:inline-block hidden right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full glass-effect bg-gray-600/20 transition-all duration-300 group"
      >
        <ChevronRight className="w-6 h-6 text-cream-50 group-hover:text-luxury-400 transition-colors" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute lg:bottom-8 md:bottom-8 sm:flex hidden bottom-4 left-1/2 -translate-x-1/2 z-20  space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-luxury-500 scale-125"
                : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

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
