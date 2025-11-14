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
      <div className="min-h-screen mt-14 bg-gradient-to-br from-cream-50 to-cream-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Heart className="w-24 h-24 text-cream-300 mx-auto mb-6" />
              <h1 className="font-cormorant text-3xl font-bold text-foreground  mb-4">
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
    <div className="min-h-screen sm:mt-14 mt-20 bg-gradient-to-br from-cream-50 to-cream-100">
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
                className="flex items-center text-primary  hover:text-primary transition-colors mr-6"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Continue Shopping
              </Link>
              <div className="flex sm:block sm:mt-0 mt-4 flex-col items-center justify-center">
                <h1 className="font-cormorant sm:text-3xl text-xl font-bold text-foreground ">
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
                className="bg-background"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Move All to Cart
              </Button>
              <Button
                variant="outline"
                onClick={clearWishlist}
                className="bg-background text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Wishlist Grid */}
        <div className="grid mt-10 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-8 gap-2">
          <AnimatePresence>
            {items.map((product, index) => (
              <motion.div
                key={product.id}
                className="group bg-background rounded-md shadow-md hover:shadow-luxury transition-all duration-500 overflow-hidden"
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
                    <div className="absolute top-4 sm:left-4 left-2 bg-foreground 0 text-foreground  px-3 py-1 rounded-full sm:text-sm text-xs font-bold">
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
                    className="absolute top-4 sm:right-4 right-2 sm:w-10 sm:h-10 w-8 h-8 bg-background/90 hover:bg-background rounded-full flex items-center justify-center text-red-600 hover:text-red-700 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0"
                  >
                    {removingItems.has(product.id) ? (
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Heart className="sm:w-5 sm:h-5 w-4 h-4 fill-current" />
                    )}
                  </button>

                  {/* Quick Add Button */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <Button
                      onClick={() => handleAddToCart(product)}
                      variant="luxury"
                      className="w-full hidden sm:flex"
                      disabled={!product.quantity}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      {product.quantity ? "Add to Cart" : "Out of Stock"}
                    </Button>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      variant="luxury"
                      size={"sm"}
                      className="w-full sm:hidden flex"
                      disabled={!product.quantity}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      {product.quantity ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="sm:px-6 px-3 sm:py-3 py-1">
                  {/* Rating */}
                  <div className="flex items-center justify-between sm:mb-3 mb-1 flex-wrap">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(4)
                              ? "text-primary  fill-current"
                              : "text-cream-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-2">
                        ({product.reviewCount || 0})
                      </span>
                    </div>
                    <div className="text-xs hidden sm:flex text-primary  font-medium bg-foregroundsm:px-2 px-0 py-1 rounded-full">
                      {product.category.replace("-", " ").toUpperCase()}
                    </div>
                  </div>

                  {/* Title */}
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-cormorant sm:text-xl text-base font-semibold text-foreground  sm:mb-2 mb-0 hover:text-primary  transition-colors line-clamp-2 group-hover:text-primary ">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Description */}
                  <p className="text-muted-foreground sm:text-sm text-xs sm:mb-4 mb-2 sm:line-clamp-2 line-clamp-1 leading-relaxed">
                    {product.shortDescription}
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-between  mb-4">
                    <div className="flex items-center flex-wrap sm:space-x-2">
                      <span className="sm:text-xl text-lg font-bold text-foreground ">
                        {formatPrice(product.price)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="sm:text-sm text-xs text-muted-foreground line-through">
                          {formatPrice(product.compareAtPrice!)}
                        </span>
                      )}
                    </div>
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
          <h2 className="font-cormorant text-2xl font-bold text-foreground  mb-4">
            You Might Also Like
          </h2>
          <p className="text-muted-foreground mb-8">
            Discover more luxury arrangements curated just for you
          </p>
          <Link href="/products">
            <Button variant="outline" size="lg" className="bg-background">
              Explore More Collections
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
