"use client";

import { JSX, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_ORDER_BY_ID } from "@/src/modules/order/operations";
import { CheckCircle, Package, Mail, Phone, MapPin, Calendar, Clock } from "lucide-react";
import { Button } from "@/src/components/ui/Button";

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

export default function GuestCheckoutSuccessPage(): JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const email = searchParams.get("email");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  const { data, loading, error } = useQuery(GET_ORDER_BY_ID, {
    variables: { id: orderId },
    skip: !orderId,
    onCompleted: (data) => {
      if (data?.orderById) {
        setOrderDetails(data.orderById);
      }
    },
  });

  useEffect(() => {
    if (!orderId) {
      router.push("/");
    }
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-luxury-500"></div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find your order details.</p>
          <Button onClick={() => router.push("/")} variant="luxury">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-cormorant font-bold text-charcoal-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
        </div>

        {/* Order Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <Package className="h-5 w-5 text-luxury-500 mr-2" />
            <h2 className="text-xl font-cormorant font-bold text-charcoal-900">
              Order Details
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Order Information</h3>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Order ID:</span> {orderDetails.id}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Order Date:</span> {formatDate(orderDetails.createdAt)}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Status:</span> 
                <span className="ml-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  {orderDetails.status}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Total Amount:</span> AED {orderDetails.totalAmount.toFixed(2)}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
              <div className="flex items-center mb-1">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">{orderDetails.email}</span>
              </div>
              <div className="flex items-center mb-1">
                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">{orderDetails.phone}</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                <span className="text-sm text-gray-600">
                  {orderDetails.address}, {orderDetails.city}, {orderDetails.emirate}
                  {orderDetails.postalCode && `, ${orderDetails.postalCode}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <Calendar className="h-5 w-5 text-luxury-500 mr-2" />
            <h2 className="text-xl font-cormorant font-bold text-charcoal-900">
              Delivery Information
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Delivery Type:</span> {orderDetails.deliveryType}
              </p>
              {orderDetails.deliveryDate && (
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Delivery Date:</span> {formatDate(orderDetails.deliveryDate)}
                </p>
              )}
              {orderDetails.deliveryTime && (
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Delivery Time:</span> {formatTime(orderDetails.deliveryTime)}
                </p>
              )}
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Payment Method:</span> {orderDetails.paymentMethod}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Payment Status:</span>
                <span className="ml-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  {orderDetails.paymentStatus}
                </span>
              </p>
            </div>
          </div>

          {orderDetails.specialInstructions && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Special Instructions</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {orderDetails.specialInstructions}
              </p>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-cormorant font-bold text-charcoal-900 mb-4">
            Order Items
          </h2>
          
          <div className="space-y-4">
            {orderDetails.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                <div>
                  <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">AED {(item.price * item.quantity).toFixed(2)}</p>
                  <p className="text-sm text-gray-600">AED {item.price.toFixed(2)} each</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guest Checkout Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Guest Checkout - Order Tracking
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p className="mb-2">
                  Since you checked out as a guest, you can track your order using:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Order ID: <span className="font-mono font-medium">{orderDetails.id}</span></li>
                  <li>Email: <span className="font-medium">{orderDetails.email}</span></li>
                </ul>
                <p className="mt-2">
                  We'll send you email updates about your order status.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => router.push("/")} 
            variant="luxury"
            className="w-full sm:w-auto"
          >
            Continue Shopping
          </Button>
          <Button 
            onClick={() => window.print()} 
            variant="outline"
            className="w-full sm:w-auto"
          >
            Print Order Details
          </Button>
        </div>
      </div>
    </div>
  );
}
