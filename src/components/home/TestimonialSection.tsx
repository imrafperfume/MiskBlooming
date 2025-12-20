"use client";

import { useState } from "react";
import { Star, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@apollo/client";
import { GET_REVIEWS } from "@/src/modules/review/reviewType";
import Loading from "../layout/Loading";

// Define strict types for production safety
interface User {
  firstName: string;
  lastName: string;
}

interface Review {
  id: string;
  comment: string;
  rating: number;
  user: User;
}

const TestimonialSection = ({
  taTitle,
  taDesc,
}: {
  taTitle?: string;
  taDesc?: string;
}) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { data, loading, error } = useQuery(GET_REVIEWS);

  // Defensive: Ensure default empty array
  const testimonials: Review[] = data?.reviews || [];

  if (loading) return <Loading />;

  // Production Check: Don't render section if data fails or is empty
  if (error || !testimonials.length) return null;

  const current = testimonials[activeTestimonial];

  return (
    <section className="py-24 bg-charcoal-900 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-charcoal-800/20 skew-x-12 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-cormorant text-display-md font-bold text-cream-50 mb-4">
            {taTitle || "Client Experiences"}
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6" />
          <p className="text-cream-200 text-lg max-w-2xl mx-auto leading-relaxed opacity-90">
            {taDesc ||
              "Discover why our clients trust us with their most precious moments."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT: Active Testimonial Display (Takes up 7 columns) */}
          <div className="lg:col-span-7 flex flex-col justify-center min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <Quote className="absolute -top-8 -left-6 w-16 h-16 text-primary opacity-20 rotate-180" />

                <blockquote className="relative z-10">
                  <p className="font-cormorant text-3xl md:text-4xl leading-tight text-cream-50 italic mb-8">
                    "{current?.comment}"
                  </p>
                </blockquote>

                <div className="flex flex-col border-l-2 border-primary pl-6">
                  <span className="text-xl font-bold text-cream-50 uppercase tracking-wide">
                    {current?.user?.firstName} {current?.user?.lastName}
                  </span>
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < (current?.rating || 0)
                            ? "text-primary fill-primary"
                            : "text-charcoal-800 fill-charcoal-800"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT: Navigation List (Takes up 5 columns) */}
          <motion.div
            className="lg:col-span-5 flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.id || index}
                onClick={() => setActiveTestimonial(index)}
                className={`
                  group w-full text-left p-5 rounded-lg transition-all duration-300 border
                  flex items-start gap-4
                  ${
                    index === activeTestimonial
                      ? "bg-charcoal-800 border-primary shadow-lg scale-[1.02]"
                      : "bg-transparent border-charcoal-800 hover:bg-charcoal-800/50 hover:border-charcoal-700"
                  }
                `}
              >
                {/* Avatar Placeholder / Initial */}
                <div
                  className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                  ${
                    index === activeTestimonial
                      ? "bg-primary text-charcoal-900"
                      : "bg-charcoal-700 text-cream-200"
                  }
                `}
                >
                  {testimonial.user?.firstName?.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h5
                      className={`font-semibold text-sm truncate ${
                        index === activeTestimonial
                          ? "text-cream-50"
                          : "text-cream-200"
                      }`}
                    >
                      {testimonial.user?.firstName} {testimonial.user?.lastName}
                    </h5>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < testimonial.rating
                              ? "text-primary fill-primary"
                              : "text-charcoal-700 fill-charcoal-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-cream-200/60 line-clamp-2 font-light">
                    {testimonial.comment}
                  </p>
                </div>
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
