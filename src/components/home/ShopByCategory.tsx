"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";

const categories = [
  {
    id: 1,
    name: "Premium Roses",
    description: "Elegant rose arrangements",
    image: "/images/product1.jpg",
    href: "/products?category=roses",
    itemCount: 45,
  },
  {
    id: 2,
    name: "Mixed Arrangements",
    description: "Beautiful seasonal bouquets",
    image: "/images/product2.jpg",
    href: "/products?category=mixed",
    itemCount: 32,
  },
  {
    id: 3,
    name: "Luxury Chocolates",
    description: "Premium Belgian chocolates",
    image: "/images/product3.jpg",
    href: "/products?category=chocolates",
    itemCount: 28,
  },
  {
    id: 4,
    name: "Fresh Cakes",
    description: "Made fresh daily",
    image: "/images/product4.jpg",
    href: "/products?category=cakes",
    itemCount: 18,
  },
  {
    id: 5,
    name: "Gift Hampers",
    description: "Curated gift collections",
    image: "/images/product5.jpg",
    href: "/products?category=hampers",
    itemCount: 24,
  },
  {
    id: 6,
    name: "Indoor Plants",
    description: "Beautiful houseplants",
    image: "/images/product6.jpg",
    href: "/products?category=plants",
    itemCount: 36,
  },
];

const ShopByCategory = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const getItemsPerSlide = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1280) return 4; // xl
      if (window.innerWidth >= 1024) return 3; // lg
      if (window.innerWidth >= 768) return 2; // md
      return 1; // sm
    }
    return 3; // default for SSR
  };

  const itemsPerSlide = getItemsPerSlide();
  const totalSlides = Math.ceil(categories.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            className="text-4xl font-cormorant font-bold text-charcoal-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Shop by Category
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Discover our carefully curated collections of premium flowers,
            gifts, and treats
          </motion.p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-cream-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-cream-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Cards Container */}
          <div className="overflow-hidden mx-12">
            <motion.div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${
                  currentSlide * (100 / totalSlides)
                }%)`,
                width: `${totalSlides * 100}%`,
              }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div
                  key={slideIndex}
                  className="flex gap-6"
                  style={{ width: `${100 / totalSlides}%` }}
                >
                  {categories
                    .slice(
                      slideIndex * itemsPerSlide,
                      (slideIndex + 1) * itemsPerSlide
                    )
                    .map((category, index) => (
                      <motion.div
                        key={category.id}
                        className="flex-1 group"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="bg-white rounded-2xl shadow-lg border border-cream-300 overflow-hidden hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2">
                          {/* Image Container */}
                          <div className="relative h-64 overflow-hidden">
                            <Image
                              src={category.image}
                              alt={category.name}
                              fill
                              className="object-cover w-full h-full scale-105 transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Item Count Badge */}
                            <div className="absolute top-4 right-4 bg-luxury-500 text-charcoal-900 px-3 py-1 rounded-full text-sm font-semibold">
                              {category.itemCount} items
                            </div>

                            {/* Explore Button */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Link href={category.href}>
                                <Button className="bg-white text-charcoal-900 hover:bg-cream-50 font-semibold px-6 py-2 rounded-full shadow-lg">
                                  Explore Collection
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                              </Link>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-6">
                            <h3 className="text-xl font-cormorant font-semibold text-charcoal-900 mb-2 group-hover:text-luxury-600 transition-colors">
                              {category.name}
                            </h3>
                            <p className="text-charcoal-700 mb-4">
                              {category.description}
                            </p>
                            <Link
                              href={category.href}
                              className="inline-flex items-center text-luxury-600 hover:text-luxury-700 font-medium transition-colors"
                            >
                              View Collection
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-luxury-500 w-8"
                    : "bg-cream-300 hover:bg-cream-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/products">
            <Button
              size="lg"
              className="bg-luxury-500 hover:bg-luxury-600 text-charcoal-900 font-semibold px-8 py-3"
            >
              View All Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
