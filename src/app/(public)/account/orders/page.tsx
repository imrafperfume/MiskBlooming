"use client";

import { motion } from "framer-motion";
import {
  Package,
  Download,
  Star,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Navigation,
  ArrowRight,
} from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { useQuery } from "@apollo/client";
import { GET_ORDERS_BY_USER } from "@/src/modules/order/operations";
import { useAuth } from "@/src/hooks/useAuth";
import Link from "next/link";
import { handleDownload } from "@/src/lib/utils";

// --- Components ---

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    DELIVERED: "bg-green-500/10 text-green-600 border-green-500/20",
    OUT_FOR_DELIVERY: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    PROCESSING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    CANCELLED: "bg-destructive/10 text-destructive border-destructive/20",
    PENDING: "bg-muted text-muted-foreground border-border",
  };

  const icons = {
    DELIVERED: CheckCircle,
    OUT_FOR_DELIVERY: Truck,
    PROCESSING: Clock,
    CANCELLED: AlertCircle,
    PENDING: Package,
  };

  const normalizedStatus = status.toUpperCase().replace(/ /g, "_");
  const style =
    styles[normalizedStatus as keyof typeof styles] || styles.PENDING;
  const Icon = icons[normalizedStatus as keyof typeof icons] || Package;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${style}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="capitalize">
        {status.replace(/_/g, " ").toLowerCase()}
      </span>
    </span>
  );
};

// Skeleton Loader
const OrderSkeleton = () => (
  <div className="space-y-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <div className="h-10 bg-muted/50 rounded-lg w-1/3 mx-auto mb-12 animate-pulse" />
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="h-64 bg-card rounded-2xl border border-border animate-pulse"
      />
    ))}
  </div>
);

export default function OrdersPage() {
  const { data: user, isLoading: authLoading } = useAuth();
  const userId = user?.id;

  const { data, loading: ordersLoading } = useQuery(GET_ORDERS_BY_USER, {
    variables: { userId: userId },
    skip: !userId,
    fetchPolicy: "cache-and-network",
  });

  if (authLoading || ordersLoading) return <OrderSkeleton />;

  if (!userId) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 px-4 text-center">
        <div className="bg-muted p-4 rounded-full">
          <Package className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold font-cormorant text-foreground">
          Access Restricted
        </h2>
        <p className="text-muted-foreground max-w-md">
          Please log in to view your order history and track active shipments.
        </p>
        <Link href="/auth/login">
          <Button variant="luxury">Log In Now</Button>
        </Link>
      </div>
    );
  }

  const orders = data?.ordersByUser || [];

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-cormorant font-bold text-foreground mb-4">
            My Orders
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your orders and view your purchase history
          </p>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order: any, index: number) => (
            <motion.div
              key={order.id}
              className="bg-card rounded-2xl border border-border shadow-sm p-6 hover:shadow-md hover:border-primary/20 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Card Header */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0 hidden sm:flex">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-cormorant font-bold text-foreground flex items-center gap-2">
                      Order #{order.id.slice(-6).toUpperCase()}
                      <span className="text-sm font-sans font-normal text-muted-foreground hidden sm:inline-block">
                        ({order.id})
                      </span>
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {new Date(Number(order.createdAt)).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4" />
                        {order.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-4 w-full lg:w-auto mt-2 lg:mt-0">
                  <StatusBadge status={order.status} />
                  <div className="text-2xl font-cormorant font-bold text-primary">
                    {/* Currency Formatter */}
                    {new Intl.NumberFormat("en-AE", {
                      style: "currency",
                      currency: "AED",
                    }).format(order.totalAmount)}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-border pt-6 mb-6">
                <div className="space-y-4">
                  {order.items.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      {/* Product Image Placeholder - Replace with real Image if available */}
                      <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center shrink-0">
                        <Package className="w-6 h-6 text-muted-foreground/40" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">
                          {item.product?.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="font-semibold text-foreground shrink-0">
                        {new Intl.NumberFormat("en-AE", {
                          style: "currency",
                          currency: "AED",
                        }).format(item.price)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                <Link
                  href={`/track-order?orderId=${order.id}&email=${order.email}`}
                  className="flex-1 sm:flex-none"
                >
                  <Button className="w-full sm:w-auto" variant="luxury">
                    <Navigation className="w-4 h-4 mr-2" />
                    Track Order
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none"
                  onClick={() => handleDownload(order.id)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Invoice
                </Button>

                {order.status === "DELIVERED" && (
                  <Button
                    variant="ghost"
                    className="flex-1 sm:flex-none hover:bg-muted"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Review
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {orders.length === 0 && !ordersLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-3xl border border-border border-dashed"
          >
            <div className="bg-muted p-6 rounded-full mb-6">
              <Package className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-cormorant font-bold text-foreground mb-2">
              No Orders Yet
            </h3>
            <p className="text-muted-foreground mb-8 max-w-sm">
              You haven't placed any orders yet. Explore our collection to find
              the perfect gift.
            </p>
            <Link href="/products">
              <Button
                variant="luxury"
                size="lg"
                className="shadow-lg hover:shadow-xl transition-shadow"
              >
                Start Shopping <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
