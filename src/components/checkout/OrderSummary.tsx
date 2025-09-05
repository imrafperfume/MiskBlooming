"use client";

import Image from "next/image";
import { Shield, Truck, Phone, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice } from "../../lib/utils";
import type { CartItem } from "../../types";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  codFee: number;
  tax: number;
  total: number;
}

export function OrderSummary({ 
  items, 
  subtotal, 
  deliveryFee, 
  codFee, 
  tax, 
  total 
}: OrderSummaryProps) {
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg sticky top-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <h2 className="font-cormorant text-xl font-bold text-charcoal-900 mb-6">
        Order Summary
      </h2>

      {/* Items */}
      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-center space-x-3">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={item.product?.images[0].url || "/placeholder.svg"}
                alt={item.product?.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-charcoal-900 sm:text-sm text-xs line-clamp-2">
                {item.product.name}
              </h4>
              <p className="text-muted-foreground text-sm">
                Qty: {item.quantity}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-charcoal-900">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-3 border-t border-cream-300 pt-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery</span>
          <span className="font-medium">
            {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
          </span>
        </div>

        {codFee > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">COD Fee</span>
            <span className="font-medium">{formatPrice(codFee)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-muted-foreground">VAT (5%)</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>

        <div className="border-t border-cream-300 pt-3">
          <div className="flex justify-between">
            <span className="text-lg font-semibold text-charcoal-900">Total</span>
            <span className="text-lg font-bold text-charcoal-900">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-6 pt-6 border-t border-cream-300">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <Shield className="w-6 h-6 text-green-600 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Secure</p>
          </div>
          <div>
            <Truck className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Fast Delivery</p>
          </div>
          <div>
            <Phone className="w-6 h-6 text-purple-600 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">24/7 Support</p>
          </div>
        </div>
      </div>

      {/* Satisfaction Guarantee */}
      <div className="mt-4 p-3 bg-luxury-50 rounded-lg">
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 text-luxury-600 mr-2" />
          <span className="text-sm font-medium text-luxury-800">
            100% Satisfaction Guarantee
          </span>
        </div>
        <p className="text-xs text-luxury-700 mt-1">
          Fresh flowers or your money back
        </p>
      </div>
    </motion.div>
  );
}
