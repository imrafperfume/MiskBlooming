"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export function CheckoutHeader() {
  return (
    <motion.div
      className="flex items-center mb-6 lg:mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Link
        href="/cart"
        className="flex items-center text-luxury-500 hover:text-luxury-600 transition-colors mr-4 lg:mr-6"
      >
        <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
        <span className="text-sm lg:text-base">Back to Cart</span>
      </Link>
      <h1 className="font-cormorant text-2xl lg:text-3xl font-bold text-charcoal-900">
        Secure Checkout
      </h1>
    </motion.div>
  );
}
