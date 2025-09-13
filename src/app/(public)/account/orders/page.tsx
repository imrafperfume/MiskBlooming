"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Eye,
  Download,
  Star,
  Calendar,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Phone,
  Mail,
  Navigation,
  Package2,
  Home,
} from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { useQuery } from "@apollo/client";
import { GET_ORDERS_BY_USER } from "@/src/modules/order/operations";
import { useAuth } from "@/src/hooks/useAuth";
import Loading from "@/src/components/layout/Loading";
import Link from "next/link";
import { formatDate, handleDownload } from "@/src/lib/utils";

const orders = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15",
    status: "delivered",
    total: 450,
    trackingNumber: "MB2024001567",
    estimatedDelivery: "2024-01-16",
    actualDelivery: "2024-01-16",
    courierName: "Ahmed Al-Rashid",
    courierPhone: "+971-50-123-4567",
    items: [
      {
        name: "Premium Red Rose Bouquet",
        quantity: 1,
        price: 350,
        image: "/placeholder-ziv6p.png",
      },
      {
        name: "Belgian Chocolate Box",
        quantity: 1,
        price: 100,
        image: "/placeholder-qre65.png",
      },
    ],
    deliveryAddress: "Downtown Dubai, UAE",
    paymentMethod: "Credit Card",
    trackingHistory: [
      {
        status: "Order Placed",
        timestamp: "2024-01-15T10:00:00Z",
        description: "Your order has been confirmed and is being prepared",
        icon: Package2,
        completed: true,
      },
      {
        status: "Preparing",
        timestamp: "2024-01-15T14:30:00Z",
        description: "Our florists are carefully arranging your flowers",
        icon: Package,
        completed: true,
      },
      {
        status: "Out for Delivery",
        timestamp: "2024-01-16T09:00:00Z",
        description: "Your order is on its way with our delivery partner",
        icon: Truck,
        completed: true,
      },
      {
        status: "Delivered",
        timestamp: "2024-01-16T15:30:00Z",
        description: "Successfully delivered to your address",
        icon: Home,
        completed: true,
      },
    ],
  },
  {
    id: "ORD-2024-002",
    date: "2024-01-10",
    status: "out_for_delivery",
    total: 280,
    trackingNumber: "MB2024002891",
    estimatedDelivery: "2024-01-12",
    courierName: "Fatima Hassan",
    courierPhone: "+971-55-987-6543",
    items: [
      {
        name: "Mixed Seasonal Arrangement",
        quantity: 1,
        price: 280,
        image: "/placeholder-jh2wj.png",
      },
    ],
    deliveryAddress: "Business Bay, Dubai",
    paymentMethod: "Apple Pay",
    trackingHistory: [
      {
        status: "Order Placed",
        timestamp: "2024-01-10T11:15:00Z",
        description: "Your order has been confirmed and is being prepared",
        icon: Package2,
        completed: true,
      },
      {
        status: "Preparing",
        timestamp: "2024-01-10T16:45:00Z",
        description: "Our florists are carefully arranging your flowers",
        icon: Package,
        completed: true,
      },
      {
        status: "Out for Delivery",
        timestamp: "2024-01-12T08:30:00Z",
        description: "Your order is on its way with our delivery partner",
        icon: Truck,
        completed: true,
      },
      {
        status: "Delivered",
        timestamp: null,
        description: "Will be delivered to your address",
        icon: Home,
        completed: false,
      },
    ],
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-05",
    status: "preparing",
    total: 180,
    trackingNumber: "MB2024003445",
    estimatedDelivery: "2024-01-06",
    items: [
      {
        name: "Birthday Cake Special",
        quantity: 1,
        price: 180,
        image: "/placeholder-ziv6p.png",
      },
    ],
    deliveryAddress: "Marina, Dubai",
    paymentMethod: "Credit Card",
    trackingHistory: [
      {
        status: "Order Placed",
        timestamp: "2024-01-05T13:20:00Z",
        description: "Your order has been confirmed and is being prepared",
        icon: Package2,
        completed: true,
      },
      {
        status: "Preparing",
        timestamp: "2024-01-05T17:00:00Z",
        description: "Our florists are carefully arranging your flowers",
        icon: Package,
        completed: true,
      },
      {
        status: "Out for Delivery",
        timestamp: null,
        description: "Will be dispatched for delivery",
        icon: Truck,
        completed: false,
      },
      {
        status: "Delivered",
        timestamp: null,
        description: "Will be delivered to your address",
        icon: Home,
        completed: false,
      },
    ],
  },
];

const statusColors = {
  DELIVERED: "bg-green-100 text-green-800",
  out_for_delivery: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-yellow-100 text-yellow-800",
  CANCELLED: "bg-red-100 text-red-800",
  PENDING: "bg-gray-100 text-gray-800",
};

const statusIcons = {
  delivered: CheckCircle,
  out_for_delivery: Truck,
  preparing: Clock,
  cancelled: AlertCircle,
  pending: Package,
};
export default function OrdersPage() {
  // const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  // const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const { data: user, isLoading } = useAuth();
  const userId = user?.id;

  const { data, loading } = useQuery(GET_ORDERS_BY_USER, {
    variables: { userId: userId },
  });

  if (isLoading || loading) return <Loading />;
  if (!userId)
    return (
      <div className="min-h-screen flex flex-col gap-2 items-center justify-center">
        Please log in to view your orders.
        <Link
          href="/auth/login"
          className="bg-luxury-500 px-8 py-4 font-cormorant text-lg text-charcoal-900 rounded-md "
        >
          Login
        </Link>
      </div>
    );

  const orders = data?.ordersByUser || [];
  // const openTracking = (orderId: string) => {
  //   setSelectedOrder(orderId);
  //   setTrackingModalOpen(true);
  // };

  // const selectedOrderData = orders.find((order) => order.id === selectedOrder);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-100 pt-32 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-cormorant font-bold text-charcoal-900 mb-4">
              My Orders
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track your orders and view your purchase history
            </p>
          </div>

          <div className="space-y-6">
            {orders?.map((order: any, index: any) => {
              const StatusIcon =
                statusIcons[
                  order?.status?.toLowerCase() as keyof typeof statusIcons
                ] ?? Package;

              return (
                <motion.div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-luxury p-6 hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                      <div className="bg-luxury-50 p-3 rounded-full">
                        <StatusIcon className="w-6 h-6 text-luxury-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-cormorant font-bold text-charcoal-900">
                          Order {order?.id}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {order?.createdAt
                              ? new Date(
                                  Number(order.createdAt)
                                ).toLocaleDateString()
                              : "Not available"}
                          </span>
                          <span className="flex items-center">
                            <CreditCard className="w-4 h-4 mr-1" />
                            {order?.paymentMethod}
                          </span>
                          {order?.trackingNumber && (
                            <span className="flex items-center">
                              <Navigation className="w-4 h-4 mr-1" />
                              {order.trackingNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          statusColors[
                            order?.status as keyof typeof statusColors
                          ]
                        }`}
                      >
                        {order?.status
                          .replace("_", " ")
                          .replace(/\b\w/g, (l: any) => l.toUpperCase())}
                      </span>
                      <div className="text-right">
                        <div className="text-2xl font-cormorant font-bold text-charcoal-900">
                          AED {order?.totalAmount}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Status Progress */}
                  {/* <div className="mb-4 p-4 bg-cream-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-charcoal-900">
                        Order Progress
                      </span>
                      {order.estimatedDelivery && (
                        <span className="text-sm text-muted-foreground">
                          Est. Delivery:{" "}
                          {new Date(
                            order.estimatedDelivery
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {order.trackingHistory.map(
                        (step: any, stepIndex: any) => (
                          <div key={stepIndex} className="flex items-center">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                step.completed ? "bg-luxury-500" : "bg-gray-300"
                              }`}
                            />
                            {stepIndex < order.trackingHistory.length - 1 && (
                              <div
                                className={`w-8 h-0.5 ${
                                  order.trackingHistory[stepIndex + 1]
                                    ?.completed
                                    ? "bg-luxury-500"
                                    : "bg-gray-300"
                                }`}
                              />
                            )}
                          </div>
                        )
                      )}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      {order.trackingHistory.map(
                        (step: any, stepIndex: any) => (
                          <span key={stepIndex} className="text-center">
                            {step.status}
                          </span>
                        )
                      )}
                    </div>
                  </div> */}

                  {/* Courier Information */}
                  {/* {order.courierName && order.status === "out_for_delivery" && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-charcoal-900 mb-1">
                            Your Delivery Partner
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {order.courierName}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent border-blue-300 text-blue-600 hover:bg-blue-50"
                          >
                            <Phone className="w-4 h-4 mr-1" />
                            Call
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent border-blue-300 text-blue-600 hover:bg-blue-50"
                          >
                            <Mail className="w-4 h-4 mr-1" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  )} */}

                  <div className="border-t border-cream-200 pt-4">
                    {/* <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>Delivery to: {order.deliveryAddress}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          {order.actualDelivery
                            ? `Delivered: ${new Date(
                                order.actualDelivery
                              ).toLocaleDateString()}`
                            : `Est. Delivery: ${new Date(
                                order.estimatedDelivery
                              ).toLocaleDateString()}`}
                        </span>
                      </div>
                    </div> */}

                    <div className="space-y-3 mb-4">
                      {order?.items.map((item: any, itemIndex: any) => (
                        <div
                          key={itemIndex}
                          className="flex items-center space-x-4 p-3 bg-cream-50 rounded-lg"
                        >
                          {/* <img
                            src={item.product?.images[0] || "/placeholder.svg"}
                            alt={item.product?.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          /> */}
                          <div className="flex-1">
                            <h4 className="font-medium text-charcoal-900">
                              {item.product?.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-charcoal-900">
                              AED {item.price}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/track-order?orderId=${order.id}&email=${order.email}`}
                        className="flex items-center bg-luxury-500 px-4 py-2 text-charcoal-900 rounded-lg hover:bg-luxury-600 transition"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Track Order
                      </Link>
                      <Button
                        size={"sm"}
                        onClick={() => handleDownload(order?.id)}
                        className="flex items-center bg-transparent"
                        variant={"outline"}
                      >
                        Download Invoice
                      </Button>
                      {/* <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center bg-transparent"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button> */}
                      {order.status === "DELIVERED" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center bg-transparent"
                          >
                            <Star className="w-4 h-4 mr-2" />
                            Leave Review
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-luxury-50 text-luxury-600 border-luxury-200 hover:bg-luxury-100"
                          >
                            Reorder
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {orders.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-cormorant font-bold text-charcoal-900 mb-2">
                No Orders Yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start shopping to see your orders here
              </p>
              <Button variant="luxury" size="lg">
                Browse Products
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Detailed Tracking Modal */}
    </div>
  );
}
