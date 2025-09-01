"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Heart,
  Gift,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import occasionsData from "../../data/occasions.json";

interface Occasion {
  id: string;
  name: string;
  description: string;
  image: string;
  color: string;
  products: string[];
}

const SpecialOccasions = () => {
  const occasions = occasionsData as Occasion[];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  // Responsive items per slide
  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth < 640) {
        setItemsPerSlide(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(2);
      } else if (window.innerWidth < 1280) {
        setItemsPerSlide(3);
      } else {
        setItemsPerSlide(4);
      }
    };

    updateItemsPerSlide();
    window.addEventListener("resize", updateItemsPerSlide);
    return () => window.removeEventListener("resize", updateItemsPerSlide);
  }, []);

  const totalSlides = Math.ceil(occasions.length / itemsPerSlide);
  const currentOccasions = occasions.slice(
    currentSlide * itemsPerSlide,
    (currentSlide + 1) * itemsPerSlide
  );

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getOccasionIcon = (id: string) => {
    switch (id) {
      case "valentines":
      case "mothers-day":
      case "anniversary":
      case "sympathy":
        return <Heart className="w-5 h-5" />;
      case "birthday":
      case "congratulations":
        return <Gift className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <section className="py-20 bg-white h-full">
      <div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-luxury-500 mr-2" />
            <span className="text-luxury-500 font-medium tracking-wide text-sm uppercase">
              SPECIAL OCCASIONS
            </span>
            <Calendar className="w-6 h-6 text-luxury-500 ml-2" />
          </div>
          <h2 className="font-cormorant text-4xl md:text-5xl font-bold text-charcoal-900 mb-6">
            Celebrate Life's{" "}
            <span className="text-luxury-500">Precious Moments</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            From intimate celebrations to grand occasions, find the perfect
            arrangement to express your emotions
          </p>
        </motion.div>

        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-cream-200 flex items-center justify-center text-charcoal-900 hover:bg-luxury-50 hover:border-luxury-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-cream-200 flex items-center justify-center text-charcoal-900 hover:bg-luxury-50 hover:border-luxury-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {currentOccasions.map((occasion, index) => (
                  <motion.div
                    key={occasion.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-cream-200 transition-all duration-500 hover:-translate-y-2"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={
                          occasion.image ||
                          "/placeholder.svg?height=300&width=400"
                        }
                        alt={occasion.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Icon Badge */}
                      <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-luxury-500 shadow-sm">
                        {getOccasionIcon(occasion.id)}
                      </div>

                      {/* Product Count Badge */}
                      <div className="absolute top-4 left-4 bg-luxury-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {occasion.products.length} items
                      </div>

                      {/* Hover Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Link href={`/occasions/${occasion.id}`}>
                          <Button
                            variant="luxury"
                            size="sm"
                            className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                          >
                            Explore Collection
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <h3 className="font-cormorant text-xl font-semibold text-charcoal-900 mb-2 group-hover:text-luxury-500 transition-colors duration-300">
                        {occasion.name}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
                        {occasion.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-medium">
                          Starting from AED 150
                        </span>
                        <Link
                          href={`/occasions/${occasion.id}`}
                          className="text-luxury-500 hover:text-luxury-600 text-sm font-medium transition-colors duration-200"
                        >
                          View All →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-luxury-500 w-8"
                  : "bg-cream-300 hover:bg-cream-400"
              }`}
            />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Link href="/occasions">
            <Button
              variant="outline"
              size="lg"
              className="group border-luxury-200 text-luxury-500 hover:bg-luxury-500 hover:border-luxury-300 bg-transparent"
            >
              View All Occasions
              <Calendar className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default SpecialOccasions;
