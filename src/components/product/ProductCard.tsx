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

    const handleAddToCart = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        addItem(product);
        toast.success("Item added to cart");
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
      product?.compareAtPrice && product?.compareAtPrice > product.price;
    const discountPercentage = hasComparePrice
      ? calculateDiscount(product?.compareAtPrice ?? 0, product?.price)
      : 0;
    const feayturedImageIndex = product?.featuredImage || 0;

    const imageUrl =
      product.images?.[feayturedImageIndex]?.url || "/placeholder.svg";
    const isValidUrl =
      imageUrl.startsWith("http://") || imageUrl.startsWith("https://");

    return (
      <motion.div
        className={`${
          viewMode !== "grid" && "flex gap-5 justify-between"
        } group relative bg-white rounded-3xl shadow-lg hover:shadow-luxury transition-all duration-700 overflow-hidden border border-cream-200`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: true }}
        whileHover={{ y: -12, scale: 1.02 }}
      >
        {/* Image Container */}
        <div
          className={`relative w-full overflow-hidden ${
            viewMode === "grid" ? "aspect-square" : "aspect-[4/3]"
          }`}
        >
          <Image
            src={isValidUrl ? imageUrl : "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority={index < 4}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            {product.featured && (
              <motion.div
                className="flex items-center bg-luxury-500 text-charcoal-900 px-3 py-1 rounded-full text-sm font-bold"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Featured
              </motion.div>
            )}
            {discountPercentage > 0 && (
              <motion.div
                className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold"
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
              <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                Out of Stock
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
            <motion.button
              onClick={handleWishlistToggle}
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                isWishlisted
                  ? "bg-red-500 text-white"
                  : "bg-white/90 hover:bg-white text-charcoal-900 hover:text-red-500"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart
                className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
              />
            </motion.button>
            <Link href={`/products/${product.slug}`}>
              <motion.button
                className="w-12 h-12 bg-white/90 hover:bg-white text-charcoal-900 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Eye className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>

          {/* Quick Add Button */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
            <Button
              onClick={handleAddToCart}
              variant="luxury"
              className="w-full shadow-luxury"
              disabled={!product.quantity}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              {product.quantity ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-3">
          {/* Rating */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(4)
                      ? "text-luxury-500 fill-current"
                      : "text-cream-300"
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                ({product.reviewCount || 0})
              </span>
            </div>
            <div className="text-xs text-luxury-500 font-medium bg-luxury-50 px-2 py-1 rounded-full">
              {product.category.replace("-", " ").toUpperCase()}
            </div>
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-cormorant text-xl font-semibold text-charcoal-900 mb-2 hover:text-luxury-500 transition-colors line-clamp-2 group-hover:text-luxury-600">
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-charcoal-900">
                {formatPrice(product.price)}
              </span>
              {hasComparePrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice!)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Luxury Border Effect */}
        <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-luxury-200 transition-all duration-500 pointer-events-none" />
      </motion.div>
    );
  }
);

ProductCard.displayName = "ProductCard";

export default ProductCard;
