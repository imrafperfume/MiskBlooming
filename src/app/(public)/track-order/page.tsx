"use client";

import { JSX, Suspense, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ORDER_BY_ID } from "@/src/modules/order/operations";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
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
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { formatDate } from "@/src/lib/utils";

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
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
    };
  }>;
}

function TrackOrderPage(): JSX.Element {
  const searchParams = useSearchParams();
  const prefillOrderId = searchParams?.get("orderId") || "";
  console.log("🚀 ~ TrackOrderPage ~ prefillOrderId:", prefillOrderId);
  const prefillOrderEmail = searchParams?.get("email") || "";
  console.log("🚀 ~ TrackOrderPage ~ prefillOrderEmail:", prefillOrderEmail);
  const [orderId, setOrderId] = useState(prefillOrderId || "");
  const [email, setEmail] = useState(prefillOrderEmail || "");
  const [searchOrderId, setSearchOrderId] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [error, setError] = useState("");

  const {
    data,
    loading,
    error: queryError,
  } = useQuery(GET_ORDER_BY_ID, {
    variables: { id: searchOrderId },
    skip: !searchOrderId,
    onCompleted: (data) => {
      if (data?.orderById) {
        // Verify email matches
        if (data.orderById.email.toLowerCase() === searchEmail.toLowerCase()) {
          setOrderDetails(data.orderById);
          setError("");
        } else {
          setError(
            "Email address does not match the order. Please check your email and try again."
          );
          setOrderDetails(null);
        }
      } else {
        setError("Order not found. Please check your order ID and try again.");
        setOrderDetails(null);
      }
    },
    onError: () => {
      setError("Order not found. Please check your order ID and try again.");
      setOrderDetails(null);
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !email.trim()) {
      setError("Please enter both Order ID and Email address.");
      return;
    }
    setSearchOrderId(orderId.trim());
    setSearchEmail(email.trim());
    setError("");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-luxury-100 mb-4">
            <Search className="h-8 w-8 text-luxury-600" />
          </div>
          <h1 className="text-3xl font-cormorant font-bold text-charcoal-900 mb-2">
            Track Your Order
          </h1>
          <p className="text-lg text-gray-600">
            Enter your order ID and email address to track your order status
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter your order ID"
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="luxury"
              className="w-full md:w-auto"
              disabled={loading}
            >
              {loading ? "Searching..." : "Track Order"}
            </Button>
          </form>
        </div>

        {/* Order Details */}
        {orderDetails && (
          <div className="space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-cormorant font-bold text-charcoal-900">
                  Order Status
                </h2>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    orderDetails.status
                  )}`}
                >
                  {getStatusIcon(orderDetails.status)}
                  <span className="ml-2">{orderDetails.status}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Order ID:</span>{" "}
                    {orderDetails.id}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Order Date:</span>{" "}
                    {formatDate(orderDetails?.createdAt)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Total Amount:</span> AED{" "}
                    {orderDetails.totalAmount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Payment Method:</span>{" "}
                    {orderDetails.paymentMethod}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Payment Status:</span>
                    <span className="ml-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {orderDetails.paymentStatus}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Delivery Type:</span>{" "}
                    {orderDetails.deliveryType}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-cormorant font-bold text-charcoal-900 mb-4">
                Customer Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center mb-2">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {orderDetails.email}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {orderDetails.phone}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                    <span className="text-sm text-gray-600">
                      {orderDetails.address}, {orderDetails.city},{" "}
                      {orderDetails.emirate}
                      {orderDetails.postalCode &&
                        `, ${orderDetails.postalCode}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-cormorant font-bold text-charcoal-900 mb-4">
                Delivery Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {orderDetails.deliveryType && (
                    <div className="flex items-center mb-2">
                      <Package className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        Delivery Type: {orderDetails.deliveryType}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  {orderDetails.deliveryDate && (
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        Delivery Date: {formatDate(orderDetails.deliveryDate)}
                      </span>
                    </div>
                  )}
                  {orderDetails.deliveryTime && (
                    <div className="flex items-center mb-2">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        Delivery Time: {formatTime(orderDetails.deliveryTime)}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  {orderDetails.specialInstructions && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Special Instructions
                      </h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {orderDetails.specialInstructions}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-cormorant font-bold text-charcoal-900 mb-4">
                Order Items
              </h2>

              <div className="space-y-4">
                {orderDetails.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        AED {(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        AED {item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Need Help?</h3>
          <p className="text-sm text-blue-700 mb-4">
            If you're having trouble tracking your order or have any questions,
            please contact our customer service team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => (window.location.href = "/contact")}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-800"
            >
              Contact Support
            </Button>
            <Button
              onClick={() => (window.location.href = "/")}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-800"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrackOrderWrapper() {
  return (
    <Suspense fallback={<div>Loading....</div>}>
      <TrackOrderPage />
    </Suspense>
  );
}
