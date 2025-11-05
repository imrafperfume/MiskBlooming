"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import type { Testimonial } from "../../types";
import testimonialsData from "../../data/testimonials.json";
import { useQuery } from "@apollo/client";
import { GET_REVIEWS } from "@/src/modules/review/reviewType";
import Loading from "../layout/Loading";

const TestimonialSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  // const testimonials = testimonialsData as Testimonial[];
  const { data, loading, error } = useQuery(GET_REVIEWS);
  const testimonials = data?.reviews;

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="py-24 bg-gradient-to-br from-charcoal-900 to-charcoal-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100&text=Pattern')] bg-repeat"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-cormorant text-display-md font-bold text-cream-50 mb-6">
            Voices of <span className="luxury-text">Excellence</span>
          </h2>
          <p className="text-cream-200 text-xl max-w-3xl mx-auto leading-relaxed">
            Discover what our distinguished clientele says about their
            extraordinary experiences with MiskBlooming
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Testimonial Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <Quote className="absolute -top-4 -left-4 w-12 h-12 text-luxury-500 opacity-50" />
              <motion.blockquote
                key={activeTestimonial}
                className="text-cream-100 text-2xl leading-relaxed font-light italic pl-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                "
                {testimonials?.[activeTestimonial]?.comment ||
                  "No testimonial available."}
                "
              </motion.blockquote>
            </div>

            <motion.div
              key={`author-${activeTestimonial}`}
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={"/placeholder.jpg"}
                  alt={"Testimonial"}
                  // width={64}
                  // height={64}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div> */}
              <div>
                <h4 className="font-cormorant text-xl font-semibold text-cream-50">
                  {testimonials[activeTestimonial]?.user.firstName}
                  {testimonials[activeTestimonial]?.user.lastName}
                </h4>

                <div className="flex items-center mt-2">
                  {[...Array(testimonials[activeTestimonial]?.rating)].map(
                    (_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-luxury-500 fill-current"
                      />
                    )
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Testimonial Navigation */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {testimonials?.map((testimonial: any, index: any) => (
              <motion.button
                key={testimonial.id}
                onClick={() => setActiveTestimonial(index)}
                className={`w-full text-left p-6 rounded-xl transition-all duration-300 ${
                  index === activeTestimonial
                    ? "glass-effect border  border-luxury-500/30"
                    : "bg-charcoal-800/50  hover:bg-charcoal-700/50"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-4">
                  {/* <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={testimonial?.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div> */}
                  <div className="flex-1">
                    <h5 className="font-semibold text-charcoal-900 text-sm">
                      {testimonial.user.firstName} {testimonial.user.lastName}
                    </h5>
                    {/* <p className="text-cream-300 text-xs">{testimonial.role}</p> */}
                  </div>
                  <div className="flex items-center">
                    {[...Array(testimonial?.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 text-luxury-500 fill-current"
                      />
                    ))}
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
