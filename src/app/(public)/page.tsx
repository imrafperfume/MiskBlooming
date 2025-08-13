"use client"

import { motion } from "framer-motion"
import HeroSlider from "../../components/home/HeroSlider"
import ShopByCategory from "../../components/home/ShopByCategory"
import SpecialOccasions from "../../components/home/SpecialOccasions"
import InSeason from "../../components/home/InSeason"
import TestimonialSection from "../../components/home/TestimonialSection"
import ProductCard from "../../components/product/ProductCard"
import { Button } from "../../components/ui/Button"
import { useFeaturedProducts } from "../../hooks/useProducts"
import { ArrowRight, Truck, Shield, Headphones, Award, Sparkles, Crown } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { data: featuredProducts, isLoading } = useFeaturedProducts()

  const features = [
    {
      icon: Crown,
      title: "Luxury Curation",
      description: "Hand-selected premium blooms from the world's finest growers",
    },
    {
      icon: Truck,
      title: "White-Glove Delivery",
      description: "Complimentary luxury delivery service for orders above AED 500",
    },
    {
      icon: Shield,
      title: "Excellence Guarantee",
      description: "Uncompromising quality assurance with our satisfaction promise",
    },
    {
      icon: Headphones,
      title: "Concierge Service",
      description: "Dedicated luxury customer service available 24/7",
    },
  ]

  const stats = [
    { number: "15,000+", label: "Distinguished Clients" },
    { number: "100,000+", label: "Luxury Arrangements" },
    { number: "8", label: "Years of Excellence" },
    { number: "99.9%", label: "Satisfaction Rate" },
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Shop by Category */}
      <ShopByCategory />

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-cream-50 to-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-cormorant text-display-md font-bold text-charcoal-900 mb-6">
              The <span className="luxury-text">MiskBlooming</span> Experience
            </h2>
            <p className="text-charcoal-600 text-xl max-w-3xl mx-auto">
              Where artistry meets nature, creating unforgettable moments
              through the language of flowers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-20 h-20 luxury-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-luxury">
                  <feature.icon className="w-10 h-10 text-charcoal-900" />
                </div>
                <h3 className="font-cormorant text-xl font-semibold text-charcoal-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Occasions */}
      <SpecialOccasions />

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-luxury-500 mr-2" />
              <span className="text-luxury-500 font-medium tracking-wide">
                SIGNATURE COLLECTIONS
              </span>
              <Sparkles className="w-6 h-6 text-luxury-500 ml-2" />
            </div>
            <h2 className="font-cormorant text-display-md font-bold text-charcoal-900 mb-6">
              Masterpieces in <span className="luxury-text">Bloom</span>
            </h2>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto">
              Discover our curated selection of premium arrangements, each a
              testament to luxury and artistry
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-cream-100 rounded-2xl h-96 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts?.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}

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
                Explore All Collections
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* In Season */}
      <InSeason />

      {/* Stats Section */}
      <section className="py-24 luxury-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-cormorant text-display-md font-bold text-charcoal-900 mb-6">
              A Legacy of <span className="text-charcoal-900">Excellence</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl lg:text-5xl font-bold text-charcoal-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-charcoal-700 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSection />

      {/* Newsletter */}
      <section className="py-24 bg-gradient-to-br from-cream-50 to-cream-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center mb-6">
              <Award className="w-8 h-8 text-luxury-500 mr-3" />
              <h2 className="font-cormorant text-display-sm font-bold text-charcoal-900">
                Join Our Exclusive Circle
              </h2>
              <Award className="w-8 h-8 text-luxury-500 ml-3" />
            </div>
            <p className="text-muted-foreground text-xl mb-8 max-w-2xl mx-auto">
              Be the first to discover our latest collections, exclusive offers,
              and seasonal inspirations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-xl border border-cream-400 focus:ring-2 focus:ring-luxury-500 focus:border-transparent transition-all duration-300 bg-white"
              />
              <Button variant="luxury" size="lg">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
