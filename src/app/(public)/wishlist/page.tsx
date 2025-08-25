"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowLeft, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../../components/ui/Button";
import { useWishlistStore } from "../../../store/wishlistStore";
import { useCartStore } from "../../../store/cartStore";
import { formatPrice } from "../../../lib/utils";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  const handleRemoveItem = async (productId: string) => {
    setRemovingItems((prev) => new Set(prev).add(productId));
    // Add a small delay for animation
    setTimeout(() => {
      removeItem(productId);
      setRemovingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }, 300);
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
    // Optional: Show success message
  };

  const handleMoveAllToCart = () => {
    items.forEach((product) => {
      addToCart(product);
    });
    clearWishlist();
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Heart className="w-24 h-24 text-cream-300 mx-auto mb-6" />
              <h1 className="font-cormorant text-3xl font-bold text-charcoal-900 mb-4">
                Your Wishlist is Empty
              </h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Save your favorite luxury arrangements and gifts to your
                wishlist for easy access later.
              </p>
              <Link href="/products">
                <Button variant="luxury" size="lg">
                  Discover Collections
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-br from-cream-50 to-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="flex flex-wrap sm:flex-nowrap items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex-1 sm:flex-none">
            <div className="flex flex-col sm:flex-row  items-center justify-center">
              <Link
                href="/products"
                className="flex items-center text-luxury-500 hover:text-luxury-600 transition-colors mr-6"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Continue Shopping
              </Link>
              <div className="flex sm:block sm:mt-0 mt-4 flex-col items-center justify-center">
                <h1 className="font-cormorant sm:text-3xl text-xl font-bold text-charcoal-900">
                  My Wishlist ({items.length} items)
                </h1>
                <p className="text-muted-foreground mt-1">
                  Your saved luxury arrangements and gifts
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 sm:flex-none sm:mt-0 mt-4">
            <div className="flex justify-center items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleMoveAllToCart}
                className="bg-white"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Move All to Cart
              </Button>
              <Button
                variant="outline"
                onClick={clearWishlist}
                className="bg-white text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Wishlist Grid */}
        <div className="grid mt-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence>
            {items.map((product, index) => (
              <motion.div
                key={product.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-luxury transition-all duration-500 overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                layout
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.images[0].url || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Discount Badge */}
                  {product.price && (
                    <div className="absolute top-4 left-4 bg-luxury-500 text-charcoal-900 px-3 py-1 rounded-full text-sm font-bold">
                      Save{" "}
                      {Math.round(
                        ((product.price - (product.compareAtPrice ?? 0)) /
                          product.price) *
                          100
                      )}
                      %
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(product.id)}
                    disabled={removingItems.has(product.id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-red-600 hover:text-red-700 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0"
                  >
                    {removingItems.has(product.id) ? (
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Heart className="w-5 h-5 fill-current" />
                    )}
                  </button>

                  {/* Quick Add Button */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <Button
                      onClick={() => handleAddToCart(product)}
                      variant="luxury"
                      className="w-full"
                      disabled={!product.quantity}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      {product.quantity ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(5)
                              ? "text-luxury-500 fill-current"
                              : "text-cream-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({product.reviewCount || 0})
                    </span>
                  </div>

                  {/* Title */}
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-cormorant text-lg font-semibold text-charcoal-900 mb-2 hover:text-luxury-500 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {product.shortDescription}
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-charcoal-900">
                        {formatPrice(product.price)}
                      </span>
                      {product?.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(product?.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {product?.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-cream-100 text-charcoal-700 text-xs rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Recommendations */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="font-cormorant text-2xl font-bold text-charcoal-900 mb-4">
            You Might Also Like
          </h2>
          <p className="text-muted-foreground mb-8">
            Discover more luxury arrangements curated just for you
          </p>
          <Link href="/products">
            <Button variant="outline" size="lg" className="bg-white">
              Explore More Collections
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
