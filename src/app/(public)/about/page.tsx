"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Truck, Award, Leaf, Gift, ArrowRight } from "lucide-react";
import { Button } from "../../../components/ui/Button";

// Animation Variants for cleaner code and performance
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Data extracted outside component to prevent re-creation on render
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
  { number: "50k+", label: "Happy Customers" },
  { number: "100k+", label: "Delivered Joy" },
  { number: "5+", label: "Years of Service" },
  { number: "99%", label: "On-Time Rate" },
];

const team = [
  {
    name: "Sahab Uddin",
    role: "Founder",
    image: "/placeholder.svg?height=400&width=400&text=Sahab",
    description:
      "The visionary Founder of Misk Blooming UAE, leading with a passion for luxury gifting.",
  },
  {
    name: "Kazi Imraf Hossain",
    role: "CEO",
    image: "/placeholder.svg?height=400&width=400&text=Kazi",
    description:
      "Leading with strategic vision and a deep understanding of the UAE’s floral market.",
  },
  {
    name: "Asifur Rahman Noyon",
    role: "IT & Digital Strategy",
    image: "/placeholder.svg?height=400&width=400&text=Asifur",
    description:
      "The technological backbone and digital strategist ensuring a seamless customer experience.",
  },
  {
    name: "Jubayed Ahmed",
    role: "Floral Specialist",
    image: "/placeholder.svg?height=400&width=400&text=Jubayed",
    description:
      "Blending traditional craftsmanship with modern trends to design luxury arrangements.",
  },
  {
    name: "Mariya",
    role: "Brand Ambassador",
    image: "/placeholder.svg?height=400&width=400&text=Mariya",
    description:
      "Representing the brand’s elegance, sophistication, and creative spirit.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full bg-primary/5 -z-10" />
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            // variants={fadeInUp}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 tracking-wide">
              Est. 2019 • Dubai, UAE
            </span>
            <h1 className="font-cormorant text-5xl md:text-7xl font-bold mb-8 leading-tight text-foreground">
              Cultivating Moments of{" "}
              <span className="text-primary italic">Pure Joy</span>
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed">
              Dubai's premier destination for luxury flowers and gifts. Bringing
              elegance and sweetness to your doorstep.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              // variants={fadeInUp}
            >
              <h2 className="font-cormorant text-4xl md:text-5xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Misk Blooming was born from a simple belief: that flowers have
                  the power to transform moments into memories. Founded in Dubai
                  in 2019, we started as a small local florist with a big dream.
                </p>
                <p>
                  What began as a passion project has grown into Dubai's most
                  trusted flower and gift delivery service. We've expanded our
                  offerings to include premium chocolates, fresh cakes, and
                  thoughtful gift sets, without compromising on quality.
                </p>
                <div className="pt-4">
                  <Link
                    href="/products"
                    className="inline-flex items-center text-primary font-semibold hover:underline"
                  >
                    View our collections <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              // variants={fadeInUp}
            >
              {/* Decorative Border */}
              <div className="absolute inset-0 border-2 border-primary/20 rounded-2xl transform translate-x-4 translate-y-4 z-0" />
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted z-10 shadow-xl">
                <Image
                  src="/placeholder.svg?height=800&width=600&text=Our+Story"
                  alt="Misk Blooming Flower Arrangement"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-4"
                // variants={fadeInUp}
              >
                <div className="font-cormorant text-4xl md:text-6xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-foreground/80 font-medium text-sm md:text-base uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            // variants={fadeInUp}
          >
            <h2 className="font-cormorant text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The principles that guide every bouquet we arrange and every
              delivery we make.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                // variants={fadeInUp}
                className="bg-card text-card-foreground p-8 rounded-2xl border border-border/50 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="font-cormorant text-2xl font-semibold mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            // variants={fadeInUp}
          >
            <h2 className="font-cormorant text-4xl md:text-5xl font-bold text-foreground mb-6">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              The passionate individuals behind Misk Blooming UAE.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                // variants={fadeInUp}
                className="group relative bg-card rounded-2xl overflow-hidden border border-border/40 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="relative h-80 w-full bg-muted overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Gradient Overlay for better text readability if needed */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6 text-center">
                  <h3 className="font-cormorant text-2xl font-bold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium text-sm mb-4 uppercase tracking-wider">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Promise / CTA Section */}
      <section className="py-20 bg-muted/50 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            // variants={fadeInUp}
          >
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
              <Gift className="w-6 h-6 text-primary" />
            </div>

            <h2 className="font-cormorant text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our Promise to You
            </h2>

            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Every arrangement is crafted with care, every delivery made with
              precision, and every customer treated like family. Experience the
              Misk Blooming difference today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/products" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto font-semibold px-8 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Shop Collections
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto font-semibold px-8 py-6 text-lg border-primary text-primary hover:bg-primary/5"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
