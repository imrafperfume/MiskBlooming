"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, Heart, Star } from "lucide-react";
import { toast } from "sonner";
import { useWishlistStore } from "../store/wishlistStore";
import { formatPrice } from "../lib/utils";

interface CartItemProps {
  item: any;
  removingItems: Set<string>;
  handleUpdateQuantity: (productId: string, newQuantity: number) => void;
  handleRemoveItem: (productId: string) => void;
}

export default function CartItem({
  item,
  removingItems,
  handleUpdateQuantity,
  handleRemoveItem,
}: CartItemProps) {
  const { addItem: addToWishlist } = useWishlistStore();

  const handleMoveToWishlist = () => {
    addToWishlist(item.product);
    handleRemoveItem(item.product.id);
  };

  return (
    <motion.div
      key={item.product.id}
      className="bg-background rounded-2xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100, scale: 0.95 }}
      layout
    >
      <div className="flex items-start space-x-4 p-4">
        {/* Product Image */}
        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
          <Image
            src={item.product.images[0].url || "/placeholder.svg"}
            alt={item.product.name}
            fill
            className="object-cover"
          />
          {item.product.featured && (
            <div className="absolute top-1 left-1 bg-foreground 0 text-foreground  text-xs px-2 py-1 rounded-full font-bold">
              Featured
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <Link href={`/products/${item.product.id}`}>
            <h3 className="font-cormorant text-lg font-semibold text-foreground  hover:text-primary  transition-colors line-clamp-2">
              {item.product.name}
            </h3>
          </Link>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
            {item.product.shortDescription}
          </p>

          <div className="flex items-center mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(5)
                    ? "text-primary  fill-current"
                    : "text-cream-300"
                }`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-2">
              ({item?.product.Review?.length || 0})
            </span>
          </div>

          <div className="flex items-center mt-2">
            <span className="text-lg font-bold text-foreground ">
              {formatPrice(item.product.price)}
            </span>
            {item.product.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through ml-2">
                {formatPrice(item.product.compareAtPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleMoveToWishlist}
            className="flex items-center text-sm text-primary  hover:text-primary transition-colors mt-3"
          >
            <Heart className="w-4 h-4 mr-1" />
            Save for Later
          </button>
        </div>

        {/* Quantity Controls */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center border border-border  rounded-lg">
            <button
              onClick={() =>
                handleUpdateQuantity(item.product.id, item.quantity - 1)
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
              onClick={() => {
                if (item.quantity < item.product.quantity) {
                  handleUpdateQuantity(item.product.id, item.quantity + 1);
                } else {
                  toast.error(
                    `Only ${item.product.quantity} items available in stock.`
                  );
                }
              }}
              className="p-2 hover:bg-cream-100 transition-colors rounded-r-lg"
              disabled={removingItems.has(item.product.id)}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm font-medium text-foreground ">
            {formatPrice(item.product.price * item.quantity)}
          </p>

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
      </div>
    </motion.div>
  );
}
