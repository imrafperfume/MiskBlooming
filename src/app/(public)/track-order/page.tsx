"use client";

import { JSX, Suspense, useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  Copy,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

import { GET_ORDER_BY_ID } from "@/src/modules/order/operations";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { formatDate, formatTimestamp } from "@/src/lib/utils";
import { toast } from "sonner";

// --- Types ---
interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
  };
}

interface OrderDetails {
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
  deliveryType: string;
  deliveryDate?: string;
  deliveryTime?: string;
  specialInstructions?: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

// --- Order Status Logic ---
const STEPS = [
  { id: "PENDING", label: "Order Placed", icon: Calendar },
  { id: "PROCESSING", label: "Processing", icon: Package },
  { id: "SHIPPED", label: "On the Way", icon: Truck },
  { id: "DELIVERED", label: "Delivered", icon: CheckCircle },
];

const getStepStatus = (currentStatus: string, stepId: string) => {
  const statusOrder = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];
  const currentIndex = statusOrder.indexOf(currentStatus.toUpperCase());
  const stepIndex = statusOrder.indexOf(stepId);

  if (currentStatus.toUpperCase() === "CANCELLED") return "error";
  if (stepIndex < currentIndex) return "completed";
  if (stepIndex === currentIndex) return "current";
  return "upcoming";
};

// --- Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const s = status.toUpperCase();
  let styles = "bg-muted text-muted-foreground border-border";
  let icon = AlertCircle;

  if (s === "DELIVERED") {
    styles = "bg-primary/10 text-primary border-primary/20";
    icon = CheckCircle;
  } else if (s === "SHIPPED" || s === "PROCESSING") {
    styles = "bg-primary/5 text-primary border-primary/10";
    icon = Truck;
  } else if (s === "PENDING") {
    styles = "bg-muted text-foreground border-border";
    icon = Clock;
  } else if (s === "CANCELLED") {
    styles = "bg-destructive/10 text-destructive border-destructive/20";
    icon = AlertCircle;
  }

  const Icon = icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
};

function TrackOrderContent(): JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Prefill from URL
  useEffect(() => {
    const paramId = searchParams?.get("orderId");
    const paramEmail = searchParams?.get("email");
    if (paramId) setOrderId(paramId);
    if (paramEmail) setEmail(paramEmail);
    if (paramId && paramEmail) setHasSearched(true);
  }, [searchParams]);

  // Query
  const {
    data,
    loading,
    error: queryError,
  } = useQuery(GET_ORDER_BY_ID, {
    variables: { id: orderId },
    skip: !hasSearched || !orderId,
    notifyOnNetworkStatusChange: true,
  });

  const orderDetails: OrderDetails | null = data?.orderById || null;
  const isEmailMatch =
    orderDetails?.email.toLowerCase() === email.trim().toLowerCase();

  // Error Handling
  const showError = hasSearched && !loading && (!orderDetails || !isEmailMatch);
  const errorMessage = !orderDetails
    ? "Order not found. Please check your Order ID."
    : "Email address does not match the order records.";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !email.trim()) {
      toast.error("Please fill in both fields");
      return;
    }
    // Update URL without reload for shareability
    const params = new URLSearchParams();
    params.set("orderId", orderId.trim());
    params.set("email", email.trim());
    router.replace(`?${params.toString()}`, { scroll: false });
    setHasSearched(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-background py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero / Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary mb-6"
          >
            <Search className="w-8 h-8" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-cormorant font-bold text-foreground">
            Track Your Order
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter your order details below to see the current status and
            estimated delivery.
          </p>
        </div>

        {/* Search Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="max-w-xl mx-auto bg-card border border-border rounded-xl shadow-sm p-6 md:p-8"
        >
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g., ORD-123456"
                className="bg-background"
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="used during checkout"
                className="bg-background"
                required
              />
            </div>

            <Button
              type="submit"
              variant="luxury"
              className="w-full text-lg h-12"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Package className="animate-spin w-4 h-4" /> Tracking...
                </span>
              ) : (
                "Track Order"
              )}
            </Button>
          </form>

          {/* Error Message */}
          <AnimatePresence>
            {showError && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-4"
              >
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3 text-destructive text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {orderDetails && isEmailMatch && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* 1. Status Timeline Card */}
              <div className="bg-card border border-border rounded-xl shadow-sm p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-border pb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-xl font-bold font-cormorant text-foreground">
                        Order #{orderDetails.id}
                      </h2>
                      <StatusBadge status={orderDetails.status} />
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      Placed on{" "}
                      {formatTimestamp(Number(orderDetails.createdAt))}
                      <button
                        onClick={() => copyToClipboard(orderDetails.id)}
                        className="hover:text-primary transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-sm text-muted-foreground">
                      Total Amount
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      AED {orderDetails.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Progress Stepper */}
                <div className="relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted hidden md:block" />
                  <div className="absolute left-6 top-0 h-full w-1 bg-muted md:hidden" />{" "}
                  {/* Vertical line for mobile */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative">
                    {STEPS.map((step, index) => {
                      const status = getStepStatus(
                        orderDetails.status,
                        step.id
                      );
                      const isCompleted =
                        status === "completed" || status === "current";
                      const isCurrent = status === "current";
                      const isCancelled = orderDetails.status === "CANCELLED";

                      return (
                        <div
                          key={step.id}
                          className="flex md:flex-col items-center gap-4 md:gap-2 relative z-10"
                        >
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                              ${
                                isCancelled
                                  ? "bg-destructive/10 border-destructive text-destructive"
                                  : isCompleted
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-card border-muted text-muted-foreground"
                              }
                            `}
                          >
                            <step.icon className="w-5 h-5" />
                          </div>
                          <div className="text-left md:text-center pt-2 md:pt-0">
                            <p
                              className={`font-semibold text-sm ${
                                isCurrent ? "text-primary" : "text-foreground"
                              }`}
                            >
                              {step.label}
                            </p>
                            {isCurrent && !isCancelled && (
                              <p className="text-xs text-primary animate-pulse font-medium">
                                In Progress
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2. Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Items & Delivery Info */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Order Items */}
                  <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border bg-muted/20">
                      <h3 className="font-cormorant font-bold text-lg text-foreground flex items-center gap-2">
                        <Package className="w-4 h-4" /> Package Details
                      </h3>
                    </div>
                    <div className="divide-y divide-border">
                      {orderDetails.items.map((item) => (
                        <div
                          key={item.id}
                          className="p-6 flex items-center justify-between hover:bg-muted/10 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                              {/* Placeholder for Product Image */}
                              <Package className="w-8 h-8 opacity-20" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground text-lg">
                                {item.product.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-foreground">
                              AED {(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {orderDetails.specialInstructions && (
                      <div className="p-6 bg-muted/30 border-t border-border">
                        <p className="text-xs font-bold text-muted-foreground uppercase mb-2">
                          Note from you
                        </p>
                        <p className="text-sm text-foreground italic">
                          "{orderDetails.specialInstructions}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Delivery Info */}
                  <div className="bg-card border border-border rounded-xl shadow-sm p-6">
                    <h3 className="font-cormorant font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                      <Truck className="w-4 h-4" /> Delivery Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Method</p>
                        <p className="font-medium text-foreground">
                          {orderDetails.deliveryType}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Estimated Date
                        </p>
                        <p className="font-medium text-foreground flex items-center gap-2">
                          {orderDetails.deliveryDate
                            ? formatDate(orderDetails.deliveryDate)
                            : "Pending Schedule"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Time Slot
                        </p>
                        <p className="font-medium text-foreground">
                          {orderDetails.deliveryTime || "Standard Delivery"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Customer & Payment */}
                <div className="space-y-8">
                  {/* Customer Info */}
                  <div className="bg-card border border-border rounded-xl shadow-sm p-6">
                    <h3 className="font-cormorant font-bold text-lg text-foreground mb-4">
                      Customer Details
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-primary mt-1 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Shipping Address
                          </p>
                          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                            {orderDetails.address}
                            <br />
                            {orderDetails.city}, {orderDetails.emirate}
                            <br />
                            {orderDetails.postalCode}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-primary shrink-0" />
                        <div className="overflow-hidden">
                          <p className="text-sm font-medium text-foreground">
                            Email
                          </p>
                          <p
                            className="text-sm text-muted-foreground truncate"
                            title={orderDetails.email}
                          >
                            {orderDetails.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-primary shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Phone
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {orderDetails.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-card border border-border rounded-xl shadow-sm p-6">
                    <h3 className="font-cormorant font-bold text-lg text-foreground mb-4">
                      Payment
                    </h3>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-muted-foreground">
                        Method
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {orderDetails.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-border">
                      <span className="text-sm text-muted-foreground">
                        Status
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          orderDetails.paymentStatus === "PAID"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {orderDetails.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Help Box */}
                  <div className="bg-muted/30 border border-border rounded-xl p-6 text-center">
                    <p className="text-sm font-medium text-foreground mb-2">
                      Need assistance?
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Our support team is here to help with your order.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="w-full text-xs"
                        onClick={() => router.push("/contact")}
                      >
                        Support
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full text-xs"
                        onClick={() => router.push("/")}
                      >
                        Shop
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Wrapper for Suspense (required for useSearchParams)
export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
