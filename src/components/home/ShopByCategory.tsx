"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import { useCategories } from "@/src/hooks/useCategories";

const ShopByCategory = ({
  caTitle,
  caDesc,
}: {
  caTitle: string;
  caDesc: string;
}) => {
  const {
    data: categories,
    isLoading,
    error,
  } = useCategories(["id", "name", "description", "imageUrl"]);

  // Memoize motion props to prevent unnecessary re-renders
  const motionProps = useMemo(
    () => ({
      header: {
        initial: { opacity: 0, y: 15 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
        viewport: { once: true, margin: "50px" },
      },
      category: (index: number) => ({
        initial: { opacity: 0, y: 15 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: index * 0.05 },
        viewport: { once: true, margin: "50px" },
      }),
    }),
    []
  );

  // Memoize swiper configuration
  const swiperConfig = useMemo(
    () => ({
      slidesPerView: 5,
      spaceBetween: 30,
      autoplay: {
        delay: 3000, // Increased for better UX
        disableOnInteraction: false,
        pauseOnMouseEnter: true, // Better UX
      },
      breakpoints: {
        320: { slidesPerView: 2.2, spaceBetween: 12 }, // mobile - fractional for better peek
        480: { slidesPerView: 2.5, spaceBetween: 15 },
        640: { slidesPerView: 3, spaceBetween: 20 },
        768: { slidesPerView: 3.5, spaceBetween: 22 },
        1024: { slidesPerView: 4, spaceBetween: 25 },
        1280: { slidesPerView: 5, spaceBetween: 30 },
      },
      modules: [Autoplay],
      className: "category-swiper outline-none",
      speed: 500, // Faster transitions
    }),
    []
  );

  // Fallback image for categories without images
  const getImageUrl = (category: any) =>
    category?.imageUrl || "/images/placeholder-category.jpg";

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="aspect-square bg-gray-200 rounded-full mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-full mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error || !categories) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-foreground ">Failed to load categories</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            className="font-cormorant text-3xl sm:text-4xl font-bold text-primary  mb-4"
            {...motionProps.header}
          >
            {caTitle || "Shop by Category"}
          </motion.h2>
          <motion.p
            className="text-muted-foreground  text-base sm:text-lg max-w-2xl mx-auto"
            {...motionProps.header}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {caDesc ||
              "Explore our diverse range of categories to find the perfect blooms for every occasion."}
          </motion.p>
        </div>

        {/* Categories Slider */}
        {categories.length > 0 ? (
          <Swiper {...swiperConfig}>
            {categories.map((category: any, index) => (
              <SwiperSlide key={category.id}>
                <motion.div className="group" {...motionProps.category(index)}>
                  <Link
                    href={`/products?category=${encodeURIComponent(
                      category.name
                    )}`}
                    className="block overflow-hidden bg-transparent transition-all duration-300 "
                  >
                    {/* Image Container */}
                    <div className="relative aspect-square bg-transparent overflow-hidden rounded-2xl sm:rounded-full mb-4">
                      <Image
                        src={getImageUrl(category)}
                        alt={category.name || "Category"}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover transition-transform rounded-2xl duration-500 group-hover:scale-110"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaUMk9SQ3T4bMptoXUu6kPmY6f3aA6sSmI"
                      />

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />

                      {/* Explore Button - Desktop only */}
                      <div className="absolute inset-0 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="bg-primary  text-secondary  px-6 py-2 rounded-full text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          Explore
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center px-2">
                      <h3 className="font-cormorant text-lg sm:text-xl font-semibold text-primary  mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground  text-sm hidden sm:block line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center py-8">
            <p className="text-foreground ">No categories available</p>
          </div>
        )}

        {/* View All Button */}
        {categories.length > 0 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <Link href="/products" className="inline-block">
              <Button
                variant="outline"
                size="lg"
                className="group bg-transparent sm:text-base text-sm"
              >
                View All Categories
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
          </motion.div>
        )}
      </div>

      <style jsx>{`
        .category-swiper {
          padding: 10px 5px 30px !important;
        }

        /* Custom scrollbar for better UX */
        .category-swiper::-webkit-scrollbar {
          height: 4px;
        }

        .category-swiper::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .category-swiper::-webkit-scrollbar-thumb {
          background: #d1a570;
          border-radius: 10px;
        }
      `}</style>
    </section>
  );
};

export default React.memo(ShopByCategory);
