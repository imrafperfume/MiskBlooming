"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Heart,
  Star,
  Gift,
  Truck,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../../components/ui/Button";
import { useCartStore } from "../../../store/cartStore";
import { useWishlistStore } from "../../../store/wishlistStore";
import { useCoupon } from "../../../hooks/useCoupon";
import { formatPrice } from "../../../lib/utils";
import { toast } from "sonner";

export default function CartPage() {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    getTotalPrice, 
    getTotalItems,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    getDiscountedTotal
  } = useCartStore();
  const { addItem: addToWishlist } = useWishlistStore();
  const { validateCouponCode, isValidating } = useCoupon();
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [couponCode, setCouponCode] = useState("");

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      handleRemoveItem(productId);
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = async (productId: string) => {
    setRemovingItems((prev) => new Set(prev).add(productId));
    setTimeout(() => {
      removeItem(productId);
      setRemovingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }, 300);
  };

  const handleMoveToWishlist = (productId: string) => {
    const item = items.find((item) => item.product.id === productId);
    if (item) {
      addToWishlist(item.product);
      removeItem(productId);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    const subtotal = getTotalPrice();
    const result = await validateCouponCode(couponCode, subtotal);

    if (result.isValid && result.coupon) {
      applyCoupon(result.coupon);
      toast.success(`Coupon "${result.coupon.code}" applied successfully!`);
      setCouponCode("");
    } else {
      toast.error(result.error || "Invalid coupon code");
    }
  };

  const subtotal = getTotalPrice();
  const shipping = subtotal > 1000 ? 0 : 25;
  const tax = (subtotal - couponDiscount) * 0.05; // 5% VAT
  const total = subtotal - couponDiscount + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen mt-10 bg-gradient-to-br from-cream-50 to-cream-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ShoppingBag className="w-24 h-24 text-cream-300 mx-auto mb-6" />
            <h1 className="font-cormorant text-3xl font-bold text-charcoal-900 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Discover our exquisite collection of fresh flowers, luxury
              chocolates, beautiful cakes, and thoughtful gift sets.
            </p>
            <Link href="/products">
              <Button variant="luxury" size="lg">
                Explore Our Collections
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-br from-cream-50 to-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="sm:flex items-center">
            <Link
              href="/products"
              className="flex items-center text-luxury-500 hover:text-luxury-600 transition-colors mr-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
            <div className="sm:mt-0 mt-2">
              <h1 className="font-cormorant text-3xl font-bold text-charcoal-900">
                Shopping Cart ({getTotalItems()} items)
              </h1>
              <p className="text-muted-foreground mt-1">
                Review your luxury selections
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={item.product.id}
                  className="bg-white border border-cream-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  layout
                >
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.images[0].url || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                      {item.product.featured && (
                        <div className="absolute top-1 left-1 bg-luxury-500 text-charcoal-900 text-xs px-2 py-1 rounded-full font-bold">
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product.id}`}
                        className=" hidden sm:block"
                      >
                        <h3 className="font-cormorant text-lg font-semibold text-charcoal-900 hover:text-luxury-500 transition-colors line-clamp-2">
                          {item.product.name}
                        </h3>
                      </Link>

                      <p className="text-muted-foreground hidden sm:block text-sm mt-1 line-clamp-2">
                        {item.product.shortDescription}
                      </p>

                      <div className="sm:block hidden">
                        {/* Rating */}
                        <div className="flex  items-center mt-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(5)
                                    ? "text-luxury-500 fill-current"
                                    : "text-cream-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground ml-2">
                            ({item.product.reviewCount || 0})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex flex-wrap sm:flex-nowrap items-center mt-2">
                          <span className="text-lg font-bold text-charcoal-900">
                            {formatPrice(item.product.price)}
                          </span>
                          {item.product.price && (
                            <span className="text-sm text-muted-foreground line-through ml-2">
                              {formatPrice(item.product.price)}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-4 mt-3">
                          <button
                            onClick={() =>
                              handleMoveToWishlist(item.product.id)
                            }
                            className="flex items-center text-sm text-luxury-500 hover:text-luxury-600 transition-colors"
                          >
                            <Heart className="w-4 h-4 mr-1" />
                            Save for Later
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-center space-y-3">
                      <div className="flex items-center border border-cream-300 rounded-lg">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                          className="p-2 hover:bg-cream-100 transition-colors rounded-l-lg"
                          disabled={removingItems.has(item.product.id)}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                          className="p-2 hover:bg-cream-100 transition-colors rounded-r-lg"
                          disabled={removingItems.has(item.product.id)}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-medium text-charcoal-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.product.id)}
                      disabled={removingItems.has(item.product.id)}
                      className="p-2 text-muted-foreground hover:text-red-600 transition-colors"
                    >
                      {removingItems.has(item.product.id) ? (
                        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <div className="block sm:hidden">
                    {/* Rating */}
                    <div className="flex  items-center mt-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(5)
                                ? "text-luxury-500 fill-current"
                                : "text-cream-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({item.product.reviewCount})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center mt-2">
                      <span className="text-lg font-bold text-charcoal-900">
                        {formatPrice(item.product.price)}
                      </span>
                      {item.product.price && (
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          {formatPrice(item.product.price)}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-4 mt-3">
                      <button
                        onClick={() => handleMoveToWishlist(item.product.id)}
                        className="flex items-center text-sm text-luxury-500 hover:text-luxury-600 transition-colors"
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        Save for Later
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Coupon Section */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <Gift className="w-5 h-5 text-luxury-500 mr-2" />
                <h3 className="font-cormorant text-lg font-semibold text-charcoal-900">
                  Promo Code
                </h3>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="font-medium text-green-800">
                      {appliedCoupon.code} - {appliedCoupon.discountType === 'PERCENTAGE' 
                        ? `${appliedCoupon.discountValue}% off`
                        : appliedCoupon.discountType === 'FIXED_AMOUNT'
                        ? `${appliedCoupon.discountValue} AED off`
                        : 'Free shipping'
                      } applied
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="sm:flex sm:space-x-3">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    className="flex-1 px-4 py-3 border border-cream-400 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
                  />
                  <Button
                    className="sm:mt-0 mt-4 hover:bg-black"
                    onClick={handleApplyCoupon}
                    variant="outline"
                    disabled={!couponCode.trim() || isValidating}
                  >
                    {isValidating ? "Validating..." : "Apply"}
                  </Button>
                </div>
              )}

              <div className="mt-3 text-sm text-muted-foreground">
                <p>Try: WELCOME10, LUXURY15, or FIRST20</p>
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg sticky top-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="font-cormorant text-xl font-bold text-charcoal-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Subtotal ({getTotalItems()} items)
                  </span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">VAT (5%)</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>

                {shipping === 0 && (
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <Truck className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm text-green-800 font-medium">
                      Free shipping applied!
                    </span>
                  </div>
                )}

                <div className="border-t border-cream-300 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-charcoal-900">
                      Total
                    </span>
                    <span className="text-lg font-bold text-charcoal-900">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              <Link href="/checkout">
                <Button variant="luxury" size="lg" className="w-full mt-6">
                  Proceed to Checkout
                </Button>
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-cream-300">
                <div className="grid sm:grid-cols-3 gap-4 text-center">
                  <div className="py-4  border border-cream-400 rounded-md">
                    <Shield className="w-6 h-6 text-green-600 mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">
                      Secure Payment
                    </p>
                  </div>
                  <div className="py-4  border border-cream-400 rounded-md">
                    <Truck className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">
                      Fast Delivery
                    </p>
                  </div>
                  <div className="py-4  border border-cream-400 rounded-md">
                    <Gift className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">
                      Gift Wrapping
                    </p>
                  </div>
                </div>
              </div>

              {/* Estimated Delivery */}
              <div className="mt-4 p-4 bg-luxury-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Truck className="w-4 h-4 text-luxury-600 mr-2" />
                  <span className="font-medium text-charcoal-900 text-sm">
                    Estimated Delivery
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(
                    Date.now() + 1 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-xs text-luxury-600 mt-1">
                  Same-day delivery available in Dubai
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
