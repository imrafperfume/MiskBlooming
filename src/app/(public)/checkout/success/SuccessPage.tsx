"use client";

import Button from "@/src/components/ui/Button";
import { formatPrice, handleDownload } from "@/src/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Gift,
  Mail,
  Package,
  Phone,
  Star,
  Truck,
  Download,
  Calendar,
} from "lucide-react";
import Link from "next/link";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
  };
}

interface Order {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  emirate: string;
  postalCode?: string;
  paymentMethod: string;
  paymentStatus: string;
  cardLast4?: string;
  deliveryType: string;
  deliveryDate?: string;
  deliveryTime?: string;
  specialInstructions?: string;
  status: string;
  totalAmount: number;
  vatAmount?: number;
  codFee?: number;
  discount?: number;
  deliveryCost?: number;
  createdAt: string;
  items: OrderItem[];
}

export default function SuccessPage({ order }: { order: Order }) {
  // Helper to safely format dates from strings or timestamps
  const formatDate = (dateInput?: string) => {
    if (!dateInput) return "TBA";
    const date = isNaN(Number(dateInput))
      ? new Date(dateInput)
      : new Date(Number(dateInput));
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* --- Success Header --- */}
        <header className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6"
          >
            <CheckCircle className="w-10 h-10 text-primary" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-cormorant text-4xl md:text-5xl font-bold text-foreground mb-3">
              Order Confirmed
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Thank you,{" "}
              <span className="text-foreground font-medium">
                {order.firstName}
              </span>
              . Your floral arrangement is now being handcrafted.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-8 print:hidden">
              <Button
                onClick={() => handleDownload(order?.id)}
                variant="luxury"
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download Invoice
              </Button>
              <Link href="/track-order">
                <Button variant="outline" className="bg-background">
                  Track Status
                </Button>
              </Link>
            </div>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 gap-8">
          {/* --- Main Order Card --- */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border border-border bg-card rounded-3xl overflow-hidden shadow-sm"
          >
            {/* Order Meta Header */}
            <div className="bg-muted/30 px-8 py-6 border-b border-border flex flex-wrap justify-between items-center gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                  Order Number
                </p>
                <p className="text-lg font-medium">#{order.id.toUpperCase()}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                  Order Date
                </p>
                <p className="text-lg font-medium">
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>

            <div className="p-8">
              {/* Items List */}
              <div className="space-y-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
                  Purchased Items
                </h3>
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start gap-4"
                  >
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-10 pt-8 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Delivery Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Truck className="w-5 h-5" />
                    <h4 className="font-semibold uppercase tracking-tight text-sm">
                      Delivery Details
                    </h4>
                  </div>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p className="text-foreground font-medium">
                      {order.firstName} {order.lastName}
                    </p>
                    <p>{order.address}</p>
                    <p>
                      {order.city}, {order.emirate}
                    </p>
                    <div className="pt-2 flex flex-col gap-1">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />{" "}
                        {formatDate(order.deliveryDate)}
                      </span>
                      <span className="text-foreground font-medium italic">
                        {order.deliveryTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Totals */}
                <div className="bg-muted/20 rounded-2xl p-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>
                      {formatPrice(
                        order.totalAmount +
                          (order.discount || 0) -
                          (order.deliveryCost || 0) -
                          (order.codFee || 0) -
                          (order.vatAmount || 0)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">VAT (5%)</span>
                    <span>{formatPrice(order.vatAmount || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span
                      className={
                        order.deliveryCost === 0
                          ? "text-green-600 font-medium"
                          : ""
                      }
                    >
                      {order.deliveryCost && order.deliveryCost > 0
                        ? formatPrice(order.deliveryCost)
                        : "Free"}
                    </span>
                  </div>
                  {order.discount ? (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount Applied</span>
                      <span>-{formatPrice(order.discount)}</span>
                    </div>
                  ) : null}
                  <div className="border-t border-border pt-3 flex justify-between items-center">
                    <span className="font-bold text-foreground">
                      Total Paid
                    </span>
                    <span className="text-2xl font-bold text-primary font-cormorant">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* --- Next Steps Timeline --- */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border p-8 rounded-3xl">
              <h3 className="font-cormorant text-2xl font-bold mb-6">
                What to expect?
              </h3>
              <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-muted">
                {[
                  { t: "Preparation", d: "Florists selecting fresh blooms." },
                  {
                    t: "Quality Check",
                    d: "Reviewing arrangement perfection.",
                  },
                  { t: "On its Way", d: "Carefully handled transit." },
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center text-xs font-bold text-primary">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{step.t}</h4>
                      <p className="text-xs text-muted-foreground">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- Support & Help --- */}
            <div className="flex flex-col gap-6">
              <div className="bg-card border border-border p-6 rounded-3xl flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Phone className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold">Support</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Questions about your order? We are available 24/7.
                </p>
                <div className="space-y-2 text-sm font-medium">
                  <p className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                    <Phone className="w-4 h-4" /> +971 4 123 4567
                  </p>
                  <p className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                    <Mail className="w-4 h-4" /> support@miskblooming.ae
                  </p>
                </div>
              </div>

              <div className="bg-primary text-primary-foreground p-6 rounded-3xl flex items-center justify-between">
                <div>
                  <h3 className="font-bold">Share the love</h3>
                  <p className="text-xs opacity-80">
                    Refer a friend and get 15% off
                  </p>
                </div>
                <Gift className="w-8 h-8 opacity-20" />
              </div>
            </div>
          </section>

          {/* --- Feedback --- */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center py-10 border-t border-border mt-10"
          >
            <Star className="w-6 h-6 text-primary mx-auto mb-4" />
            <h3 className="font-cormorant text-2xl font-bold mb-2">
              How was your experience?
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Your feedback helps us bloom better.
            </p>
            <Button variant="outline" size="sm" className="rounded-full px-8">
              Leave a Review
            </Button>
          </motion.div>

          <div className="flex justify-center gap-4 print:hidden">
            <Link href="/products">
              <Button variant="ghost" className="gap-2 group">
                <ArrowRight className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
