"use client";

import { User, Truck, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

interface CheckoutProgressProps {
  currentStep: number;
}

const steps = [
  { id: 1, name: "Information", icon: User },
  { id: 2, name: "Shipping", icon: Truck },
  { id: 3, name: "Payment", icon: CreditCard },
];

export function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  return (
    <motion.div
      className="mb-6 lg:mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-center space-x-4 lg:space-x-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                currentStep >= step.id
                  ? "bg-luxury-500 text-charcoal-900"
                  : "bg-cream-200 text-muted-foreground"
              }`}
            >
              <step.icon className="w-4 h-4 lg:w-6 lg:h-6" />
            </div>
            <span
              className={`ml-2 lg:ml-3 font-medium text-sm lg:text-base ${
                currentStep >= step.id
                  ? "text-charcoal-900"
                  : "text-muted-foreground"
              }`}
            >
              {step.name}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`w-12 lg:w-16 h-0.5 ml-4 lg:ml-8 transition-all duration-300 ${
                  currentStep > step.id ? "bg-luxury-500" : "bg-cream-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
