"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface CheckoutStepProps {
  children: ReactNode;
  className?: string;
}

export function CheckoutStep({ children, className = "" }: CheckoutStepProps) {
  return (
    <motion.div
      className={`bg-white rounded-2xl p-6 lg:p-8 shadow-lg ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}
