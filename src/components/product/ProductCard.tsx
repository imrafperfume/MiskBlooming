"use client";

import { memo, useCallback } from "react";
import Link from "next/link";
import { Star, Heart, ShoppingBag, Eye, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import type { Product } from "../../types";
import { formatPrice, calculateDiscount } from "../../lib/utils";
import { toast } from "sonner";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  index?: number;
  viewMode?: string;
}

const ProductCard = memo(
  ({ product, index = 0, viewMode }: ProductCardProps) => {
    const addItem = useCartStore((state) => state.addItem);
    const {
      addItem: addToWishlist,
      removeItem: removeFromWishlist,
      isInWishlist,
    } = useWishlistStore();

    const isWishlisted = isInWishlist(product.id);
    const averageRating =
      product?.Review?.length > 0
        ? product.Review.reduce((acc, r) => acc + r.rating, 0) /
          product.Review.length
        : 0;

    const handleAddToCart = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        const result = addItem(product);

        toast[result.success ? "success" : "error"](result.message);
      },
      [addItem, product]
    );

    const handleWishlistToggle = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        if (isWishlisted) {
          removeFromWishlist(product.id);
          toast.success("Item removed from wishlist");
        } else {
          addToWishlist(product);
          toast.success("Item added to wishlist");
        }
      },
      [isWishlisted, removeFromWishlist, addToWishlist, product]
    );

    const hasComparePrice =
      product?.compareAtPrice && product.compareAtPrice > product.price;
    const discountPercentage = hasComparePrice
      ? calculateDiscount(product.compareAtPrice ?? 0, product.price)
      : 0;

    const featuredImageIndex = product?.featuredImage || 0;
    const imageUrl = product.images?.[featuredImageIndex]?.url;
    const isValidUrl =
      imageUrl?.startsWith("http://") || imageUrl?.startsWith("https://");

    return (
      <motion.div
        className={`group relative bg-background rounded-md shadow-sm hover:shadow-luxury transition-all duration-700 overflow-hidden border border-border`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: true }}
        whileHover={{ y: -12, scale: 1.02 }}
      >
        {/* Image Container */}
        <div
          className={`relative overflow-hidden 
            "w-full aspect-square`}
        >
          <Image
            src={isValidUrl ? imageUrl : "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
            priority={index < 4}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges */}
          <div className="absolute sm:top-4 top-2 sm:left-4 left-2 flex flex-col space-y-2">
            {product.featured && (
              <motion.div
                className="flex items-center bg-primary  text-foreground  sm:px-3 px-2 py-1 rounded-full sm:text-sm text-xs font-bold"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Sparkles className="sm:w-3 sm:h-3 w-2 h-2 mr-1" />
                Featured
              </motion.div>
            )}
            {discountPercentage > 0 && (
              <motion.div
                className="bg-red-500 text-white sm:px-3 px-2 py-1 rounded-full sm:text-sm text-xs w-fit font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  delay: 0.1,
                }}
              >
                -{discountPercentage}%
              </motion.div>
            )}
            {!product.quantity && (
              <div className="bg-foreground  text-white px-3 py-1 rounded-full text-sm font-bold">
                Out of Stock
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute sm:top-4 top-2 sm:right-4 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
            <motion.button
              onClick={handleWishlistToggle}
              className={`sm:w-12 sm:h-12 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                isWishlisted
                  ? "bg-red-500 text-white"
                  : "bg-background/90 hover:bg-background text-foreground  hover:text-red-500"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart
                className={`sm:w-5 sm:h-5 w-4 h-4 ${
                  isWishlisted ? "fill-current" : ""
                }`}
              />
            </motion.button>
            <Link href={`/products/${product.slug}`}>
              <motion.button
                className="sm:w-12 sm:h-12 w-8 h-8 bg-background/90 hover:bg-background text-foreground  rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Eye className="sm:w-5 sm:h-5 w-4 h-4" />
              </motion.button>
            </Link>
          </div>

          {/* Quick Add Button */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
            <Button
              onClick={handleAddToCart}
              variant="luxury"
              className="w-full shadow-luxury flex sm:flex"
              size="sm"
              disabled={!product.quantity}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              {product.quantity ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className={`px-3 sm:px-6 py-3 flex flex-col justify-between`}>
          {/* Rating */}
          {product?.Review?.length > 0 ? (
            <div className="flex items-center justify-between sm:mb-3 mb-1 flex-wrap">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(averageRating)
                        ? "text-primary  fill-current"
                        : "text-cream-300"
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-2">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <div className="text-xs hidden sm:flex text-primary  font-medium bg-foregroundsm:px-2 px-0 py-1 rounded-full">
                {product.category.replace("-", " ").toUpperCase()}
              </div>
            </div>
          ) : (
            <div className="text-xs hidden sm:flex text-primary  font-medium bg-foregroundsm:px-2 px-0 py-1 rounded-full">
              {product.category.replace("-", " ").toUpperCase()}
            </div>
          )}

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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center flex-wrap sm:space-x-2">
              <span className="sm:text-xl text-lg font-bold text-foreground ">
                {formatPrice(product.price)}
              </span>
              {Number(product.compareAtPrice) > 0 && (
                <span className="sm:text-sm text-xs text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice!)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Luxury Border Effect */}
        <div className="absolute inset-0 rounded-md border-2 border-transparent group-hover:border-luxury-200 transition-all duration-500 pointer-events-none" />
      </motion.div>
    );
  }
);

ProductCard.displayName = "ProductCard";

export default ProductCard;
