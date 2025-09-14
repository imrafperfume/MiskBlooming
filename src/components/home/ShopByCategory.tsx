"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

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
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-8 sm:px-6 lg:px-8">
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
            className="sm:text-lg text-muted-foreground max-w-2xl mx-auto"
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
        <Swiper
          slidesPerView={5}
          spaceBetween={30}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            320: { slidesPerView: 3, spaceBetween: 20 }, // mobile
            640: { slidesPerView: 4, spaceBetween: 20 }, // small devices
            1024: { slidesPerView: 4, spaceBetween: 25 }, // tablet
            1280: { slidesPerView: 5, spaceBetween: 30 }, // desktop
          }}
          modules={[Autoplay]}
          className="mySwiper outline-none border-none"
        >
          {categories.map((category, index) => (
            <SwiperSlide key={index}>
              <motion.div
                key={category.id}
                className=" group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={category.href}
                  className="overflow-hidden transition-all duration-500"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden rounded-full">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover w-full h-full scale-105 transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Explore Button */}
                    <div className="absolute inset-0 sm:flex hidden items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button className="bg-white text-charcoal-900 hover:bg-luxury-500 font-semibold sm:px-6 py-2 pz-2 rounded-full ">
                        Explore Collection
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="sm:p-6 p-2 text-center flex flex-col items-center justify-center">
                    <h3 className="sm:text-xl text-base text-center font-cormorant font-semibold text-charcoal-900 mb-2 group-hover:text-luxury-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-charcoal-700 text-center hidden sm:flex mb-4">
                      {category.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* View All Button */}
        <div className="text-center sm:mt-12 mt-6">
          <Link href="/products" className="hidden sm:inline-block">
            <Button
              size="lg"
              className="bg-luxury-500 hover:bg-luxury-600 text-charcoal-900 font-semibold px-8 py-3"
            >
              View All Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>{" "}
          <Link href="/products" className="inline-block sm:hidden">
            <Button
              size="sm"
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
