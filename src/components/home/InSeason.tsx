"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";

const InSeason = () => {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const seasonalItems = [
    {
      id: 1,
      name: "Spring Tulip Bouquet",
      description: "Fresh tulips in vibrant spring colors",
      image: "/images/occasions/Congratulations.jpg",
      category: "Seasonal Flowers",
      badge: "Limited Time",
    },
    {
      id: 2,
      name: "Mother's Day Special",
      description: "Strawberry vanilla cake with fresh berries",
      price: 250,
      image: "/images/occasions/mothersday.jpg",
      category: "Fresh Flowers & Cakes",
      badge: "Pre-Order",
    },
    {
      id: 3,
      name: "Birthday special gift set",
      description: "Collection of flowering plants for spring",
      price: 280,
      originalPrice: 320,
      image: "/images/occasions/birthday.jpg",
      category: "Birthday Gifts",
      badge: "New Arrival",
    },
    {
      id: 4,
      name: "Anniversary Easter Chocolates",
      description: "Artisanal chocolates in Easter themes",
      price: 150,
      image: "/images/occasions/Anniversary.jpg",
      category: "Aniversary & Chocolates",
      badge: "Seasonal",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-primary  mr-2" />
            <span className="text-primary  font-medium tracking-wide">
              SEASONAL COLLECTION
            </span>
            <Sparkles className="w-6 h-6 text-primary  ml-2" />
          </div>
          <h2 className="font-cormorant text-display-md font-bold text-foreground  mb-6">
            Fresh <span className="luxury-text">In Season</span>
          </h2>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto">
            Discover our seasonal collection featuring the freshest flowers,
            special occasion cakes, and limited-time treats
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {seasonalItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="group relative bg-background rounded-2xl overflow-hidden shadow-lg hover:shadow-luxury transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              onHoverStart={() => setHoveredItem(item.id)}
              onHoverEnd={() => setHoveredItem(null)}
              whileHover={{ y: -8 }}
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-foreground  px-3 py-1 rounded-full text-sm font-bold">
                    {item.badge}
                  </span>
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Quick Action */}
                <Link
                  href={`/products?category=${item.category}`}
                  className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                >
                  <Button variant="luxury" size="sm" className="w-full">
                    Quick View
                  </Button>
                </Link>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-primary  font-medium uppercase tracking-wide">
                    {item.category}
                  </span>
                  <Calendar className="w-4 h-4 text-primary " />
                </div>

                <h3 className="font-cormorant text-lg font-semibold text-foreground  mb-2 group-hover:text-primary  transition-colors">
                  {item.name}
                </h3>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Link href="/products">
            <Button
              variant="outline"
              size="xl"
              className="group bg-transparent"
            >
              View All Seasonal Items
              <Calendar className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default InSeason;
