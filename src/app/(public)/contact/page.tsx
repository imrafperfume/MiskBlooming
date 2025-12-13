"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Truck,
  Gift,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import MapEmbed from "@/src/components/Map";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Form submitted:", formData);
    setIsSubmitting(false);

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+971 4 123 4567", "+971 50 123 4567"],
      description: "Call us for immediate assistance",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@miskblooming.ae", "support@miskblooming.ae"],
      description: "Send us your questions anytime",
    },
    {
      icon: MapPin,
      title: "Address",
      details: ["Dubai Marina", "Dubai, UAE"],
      description: "Visit our showroom",
    },
    {
      icon: Clock,
      title: "Hours",
      details: ["Mon-Sat: 8AM-10PM", "Sun: 9AM-8PM"],
      description: "We're here when you need us",
    },
  ];

  const services = [
    {
      icon: Truck,
      title: "Same-Day Delivery",
      description: "Order by 2 PM for same-day delivery in Dubai",
    },
    {
      icon: Gift,
      title: "Custom Arrangements",
      description: "Personalized flowers and gifts for special occasions",
    },
    {
      icon: MessageCircle,
      title: "24/7 Support",
      description: "Customer service available around the clock",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-r from-luxury-500 to-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-cormorant text-5xl md:text-6xl font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              We're here to help make your special moments even more beautiful.
              Get in touch with our team today.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-background rounded-2xl p-8 shadow-luxury">
              <h2 className="font-cormorant text-3xl font-bold text-foreground  mb-6">
                Send us a Message
              </h2>
              <p className="text-muted-foreground mb-8">
                Have a question about our flowers, cakes, or delivery services?
                We'd love to hear from you.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+971 50 123 4567"
                  />
                  <div>
                    <label className="block text-sm font-medium text-foreground  mb-2">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border  rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Support</option>
                      <option value="delivery">Delivery Question</option>
                      <option value="custom">Custom Arrangement</option>
                      <option value="corporate">Corporate Orders</option>
                      <option value="complaint">Complaint</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground  mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-border  rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="Tell us how we can help you..."
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="luxury"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-charcoal-900 border-t-transparent rounded-full animate-spin mr-2" />
                      Sending...
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Contact Details */}
            <div className="bg-background rounded-2xl p-8 shadow-luxury">
              <h2 className="font-cormorant text-3xl font-bold text-foreground  mb-6">
                Get in Touch
              </h2>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-12 h-12 luxury-gradient rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <info.icon className="w-6 h-6 text-foreground " />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground  mb-1">
                        {info.title}
                      </h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-muted-foreground">
                          {detail}
                        </p>
                      ))}
                      <p className="text-sm text-primary  mt-1">
                        {info.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="bg-background rounded-2xl p-8 shadow-luxury">
              <h3 className="font-cormorant text-2xl font-bold text-foreground  mb-6">
                Our Services
              </h3>

              <div className="space-y-4">
                {services.map((service, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-10 h-10 bg-luxury-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <service.icon className="w-5 h-5 text-primary " />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground  mb-1">
                        {service.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-foregroundrounded-2xl p-6 border border-border ">
              <h3 className="font-cormorant text-xl font-bold text-foreground  mb-3">
                Need Urgent Help?
              </h3>
              <p className="text-muted-foreground mb-4">
                For urgent delivery issues or last-minute orders, call our
                emergency line:
              </p>
              <a
                href="tel:+971501234567"
                className="inline-flex items-center text-primary font-semibold hover:text-luxury-700 transition-colors"
              >
                <Phone className="w-4 h-4 mr-2" />
                +971 50 123 4567
              </a>
            </div>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-background rounded-2xl p-8 shadow-luxury">
            <h2 className="font-cormorant text-3xl font-bold text-foreground  mb-6 text-center">
              Visit Our Showroom
            </h2>
            <MapEmbed height={400} className="rounded-lg shadow-md" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
