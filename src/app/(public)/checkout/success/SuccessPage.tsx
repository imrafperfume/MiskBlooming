import Button from "@/src/components/ui/Button";
import { formatPrice } from "@/src/lib/utils";
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
  createdAt: string;
  items: OrderItem[];
}
export default function SuccessPage({ order }: { order: Order }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              delay: 0.2,
            }}
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>

          <h1 className="font-cormorant text-4xl font-bold text-charcoal-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Thank you for choosing Misk Blooming
          </p>
          <p className="text-muted-foreground">
            Your beautiful arrangement is being prepared with love and care
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="sm:flex items-center  justify-between mb-6">
            <div>
              <h2 className="font-cormorant text-2xl font-bold text-charcoal-900">
                Order Details
              </h2>
              <p className="text-muted-foreground">Order #{order?.id}</p>
            </div>
            <div className="sm:text-right sm:mt-0 mt-2">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold text-charcoal-900">
                {formatPrice(order?.totalAmount)}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4 mb-6">
            {order?.items.map((item: any, index: any) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-cream-200 last:border-b-0"
              >
                <div className="flex items-center">
                  <Package className="w-5 h-5 text-luxury-500 mr-3" />
                  <div>
                    <p className="font-medium text-sm sm:text-base text-charcoal-900">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-medium text-charcoal-900">
                  {formatPrice(item.price)}
                </p>
              </div>
            ))}
          </div>

          {/* Delivery Information */}
          <div className="bg-luxury-50 rounded-xl p-6">
            <h3 className="font-semibold text-charcoal-900 mb-4 flex items-center">
              <Truck className="w-5 h-5 text-luxury-500 mr-2" />
              Delivery Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Delivery Address
                </p>
                <p className="font-medium text-charcoal-900">
                  {order?.address}, {order?.emirate}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Delivery Type</p>
                <p className="font-medium text-charcoal-900">
                  {order?.deliveryType}
                </p>
              </div>
              {order?.deliveryDate && (
                <div className="flex items-center gap-4 justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Estimated Delivery
                    </p>
                    <p className="font-medium text-charcoal-900">
                      {order?.deliveryDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Delivery Time
                    </p>
                    <p className="font-medium text-charcoal-900">
                      {order?.deliveryTime}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* What Happens Next */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="font-cormorant text-2xl font-bold text-charcoal-900 mb-6">
            What Happens Next?
          </h2>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-luxury-500 text-charcoal-900 rounded-full flex items-center justify-center font-bold text-sm mr-4 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-charcoal-900 mb-1">
                  Order Confirmation
                </h3>
                <p className="text-muted-foreground">
                  You'll receive an email confirmation with your order details
                  and tracking information.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-luxury-500 text-charcoal-900 rounded-full flex items-center justify-center font-bold text-sm mr-4 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-charcoal-900 mb-1">
                  Fresh Preparation
                </h3>
                <p className="text-muted-foreground">
                  Our expert florists will carefully prepare your arrangement
                  using the freshest flowers.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-luxury-500 text-charcoal-900 rounded-full flex items-center justify-center font-bold text-sm mr-4 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-charcoal-900 mb-1">
                  Quality Check & Packaging
                </h3>
                <p className="text-muted-foreground">
                  Each arrangement undergoes quality inspection and is packaged
                  in our signature luxury packaging.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-luxury-500 text-charcoal-900 rounded-full flex items-center justify-center font-bold text-sm mr-4 flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-semibold text-charcoal-900 mb-1">
                  Delivery
                </h3>
                <p className="text-muted-foreground">
                  Your order will be delivered fresh to your specified address
                  within the selected time frame.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact & Support */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Phone className="w-6 h-6 text-luxury-500 mr-3" />
              <h3 className="font-cormorant text-xl font-bold text-charcoal-900">
                Need Help?
              </h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Our customer service team is here to assist you with any questions
              about your order.
            </p>
            <div className="space-y-2">
              <p className="flex items-center text-sm">
                <Phone className="w-4 h-4 text-luxury-500 mr-2" />
                <span className="font-medium">+971 4 123 4567</span>
              </p>
              <p className="flex items-center text-sm">
                <Mail className="w-4 h-4 text-luxury-500 mr-2" />
                <span className="font-medium">support@miskblooming.ae</span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Gift className="w-6 h-6 text-luxury-500 mr-3" />
              <h3 className="font-cormorant text-xl font-bold text-charcoal-900">
                Special Occasions
              </h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Planning ahead? Schedule deliveries for birthdays, anniversaries,
              and special events.
            </p>
            <Link href="/products">
              <Button variant="outline" className="w-full bg-white">
                Browse Collections
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link href="/products">
            <Button variant="luxury" size="lg" className="w-full sm:w-auto">
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>

          <Link href="/account/orders">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto bg-white"
            >
              Track Your Order
            </Button>
          </Link>
        </motion.div>

        {/* Review Prompt */}
        <motion.div
          className="text-center mt-12 p-6 bg-luxury-50 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Star className="w-8 h-8 text-luxury-500 mx-auto mb-3" />
          <h3 className="font-cormorant text-xl font-bold text-charcoal-900 mb-2">
            Love Your Experience?
          </h3>
          <p className="text-muted-foreground mb-4">
            Share your experience and help others discover the beauty of Misk
            Blooming
          </p>
          <Button variant="outline" className="bg-white">
            Leave a Review
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
