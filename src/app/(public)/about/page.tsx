"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Truck, Award, Leaf, Gift } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import Link from "next/link";

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Passion for Beauty",
      description:
        "We believe in the power of flowers to express emotions and create memorable moments.",
    },
    {
      icon: Leaf,
      title: "Fresh & Quality",
      description:
        "Only the freshest flowers and finest ingredients make it into our arrangements and treats.",
    },
    {
      icon: Truck,
      title: "Reliable Delivery",
      description:
        "Same-day delivery across Dubai ensures your gifts arrive fresh and on time.",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "We strive for perfection in every arrangement, cake, and gift we create.",
    },
  ];

  const stats = [
    { number: "50,000+", label: "Happy Customers" },
    { number: "100,000+", label: "Flowers Delivered" },
    { number: "5", label: "Years of Service" },
    { number: "99.5%", label: "On-Time Delivery" },
  ];

  const team = [
    {
      name: " Sahab Uddin",
      role: "Founder",
      image: "/placeholder.svg?height=300&width=300&text=Amira",
      description:
        "Sahab Uddin is the visionary Founder of Misk Blooming UAE, a leading luxury flower, chocolate, and gifting brand based in Ajman",
    },
    {
      name: "Kazi Imraf Hossain",
      role: "CEO",
      image: "/placeholder.svg?height=300&width=300&text=Hassan",
      description:
        "As the Chief Executive Officer (CEO) of Misk Blooming UAE, Kazi Imraf Hossain leads with strategic vision, innovation, and a deep understanding of the UAE’s growing floral and gifting market",
    },
    {
      name: "Asifur Rahman Noyon",
      role: "IT Expert & Digital Marketing Strategist",
      image: "/placeholder.svg?height=300&width=300&text=Layla",
      description:
        "Asifur Rahman Noyon is the official Web Developer, Android App Developer, IT Expert, and Digital Marketing Strategist at Misk Blooming UAE, and the Founder of Enoy Tech, a professional IT agency providing cutting-edge technology solutions",
    },
    {
      name: "Jubayed Ahmed",
      role: "Floral & Product Specialist",
      image: "/placeholder.svg?height=300&width=300&text=Layla",
      description:
        "As a Floral & Product Specialist, Jubayed blends traditional craftsmanship with modern floral trends to design luxury flower arrangements, elegant chocolate boxes, and premium gifts that define the Misk Blooming brand.",
    },
    {
      name: "Mariya",
      role: "Brand Ambassador & Model",
      image: "/placeholder.svg?height=300&width=300&text=Layla",
      description:
        "Mariya is the official Brand Ambassador and model for Misk Blooming UAE, representing the brand’s elegance, sophistication, and creative spirit",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-100">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-r from-luxury-500 to-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-cormorant text-5xl md:text-6xl font-bold mb-6">
              About Misk Blooming
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Dubai's premier flower and gift delivery service, bringing beauty,
              joy, and sweetness to your special moments since 2019.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="font-cormorant text-4xl font-bold text-foreground  mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Misk Blooming was born from a simple belief: that flowers have
                  the power to transform moments into memories. Founded in Dubai
                  in 2019, we started as a small local florist with a big dream
                  - to bring the beauty of fresh flowers and the joy of sweet
                  treats to every doorstep in the UAE.
                </p>
                <p>
                  What began as a passion project has grown into Dubai's most
                  trusted flower and gift delivery service. We've expanded our
                  offerings to include premium chocolates, fresh cakes,
                  thoughtful gift sets, and beautiful plants, all while
                  maintaining our commitment to quality and freshness.
                </p>
                <p>
                  Today, we're proud to serve thousands of customers across the
                  UAE, helping them celebrate life's precious moments with our
                  carefully curated collection of flowers, treats, and gifts.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-luxury">
                <Image
                  src="/placeholder.svg?height=600&width=600&text=Our+Story"
                  alt="Our Story"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-cormorant text-4xl font-bold text-foreground  mb-6">
              Our Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The principles that guide everything we do at Misk Blooming
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 luxury-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-8 h-8 text-foreground " />
                </div>
                <h3 className="font-cormorant text-xl font-semibold text-foreground  mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
            <h2 className="font-cormorant text-4xl font-bold text-foreground  mb-6">
              Our Impact
            </h2>
            <p className="text-xl text-charcoal-700 max-w-3xl mx-auto">
              Numbers that reflect our commitment to excellence
            </p>
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
                <div className="text-4xl lg:text-5xl font-bold text-foreground  mb-2">
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

      {/* Our Team */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-cormorant text-4xl font-bold text-foreground  mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              At Misk Blooming UAE, our success blooms from the dedication,
              creativity, and leadership of our talented team. Each member plays
              a vital role in bringing premium flowers, chocolates, and gifts to
              life across the UAE with excellence, passion, and innovation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-luxury transition-shadow duration-300">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-cormorant text-xl font-semibold text-foreground  mb-2">
                  {member.name}
                </h3>
                <p className="text-primary  font-medium mb-3">{member.role}</p>
                <p className="text-muted-foreground">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section className="py-24 bg-gradient-to-br from-cream-50 to-cream-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center mb-6">
              <Gift className="w-8 h-8 text-primary  mr-3" />
              <h2 className="font-cormorant text-4xl font-bold text-foreground ">
                Our Promise to You
              </h2>
              <Gift className="w-8 h-8 text-primary  ml-3" />
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              At Misk Blooming, we promise to deliver not just flowers and
              gifts, but moments of joy, expressions of love, and celebrations
              of life's beautiful occasions. Every arrangement is crafted with
              care, every delivery made with precision, and every customer
              treated like family.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button variant="luxury" size="lg">
                  Explore Our Collections
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="bg-background">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
