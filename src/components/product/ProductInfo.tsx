import { formatPrice } from "@/src/lib/utils";
import { Product, Review } from "@/src/types";
import { motion } from "framer-motion";
import {
  Star,
  Minus,
  Plus,
  ShoppingBag,
  Heart,
  Share2,
  Truck,
  Shield,
  Gift,
  CheckCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import Button from "../ui/Button";

interface ProductInfoProps {
  product: Product;
  quantity: number;
  setQuantity: (quantity: number) => void;
  isWishlisted: boolean;
  handleAddToCart: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleWishlistToggle: () => void;
  reviews: Review[];
}

export default function ProductInfo({
  product,
  quantity,
  setQuantity,
  isWishlisted,
  handleAddToCart,
  handleWishlistToggle,
  reviews,
}: ProductInfoProps) {
  const discountPercentage =
    product.price &&
    product.compareAtPrice &&
    product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100
        )
      : 0;

  const totalReviews = reviews?.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;
  const handleShare = async () => {
    const shareData = {
      title: product?.name,
      text: `Check out this product: ${product?.name}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      // Fallback for unsupported browsers
      navigator.clipboard.writeText(shareData.url);
    }
  };

  return (
    <motion.div
      className="sm:space-y-6 space-y-2"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* Category & Stock Status */}
      <div className="flex items-center justify-between">
        <span className="text-primary  font-medium text-sm uppercase tracking-wide">
          {product.category.replace("-", " ")}
        </span>
        {product.quantity ? (
          <div className="flex items-center text-green-600 text-sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            In Stock
          </div>
        ) : (
          <div className="flex items-center text-red-600 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            Out of Stock
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`w-5 h-5 ${
                index < Math.floor(averageRating)
                  ? "text-primary  fill-current"
                  : "text-cream-400"
              }`}
            />
          ))}
        </div>
        <span className="text-muted-foreground">{totalReviews} reviews</span>
      </div>

      {/* Title */}
      <h1 className="font-cormorant text-display-sm font-bold text-foreground  leading-tight">
        {product.name}
      </h1>

      {/* Price */}
      <div className="flex flex-wrap items-center sm:space-x-4 gap-2">
        <span className="sm:text-3xl text-xl font-bold text-foreground ">
          {formatPrice(product.price)}
        </span>
        {product.compareAtPrice && (
          <span className="sm:text-xl text-muted-foreground line-through">
            {formatPrice(product.compareAtPrice)}
          </span>
        )}
        {discountPercentage > 0 && (
          <span className="sm:text-lg text-sm font-semibold text-green-600">
            Save {formatPrice(product.compareAtPrice! - product.price)}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-muted-foreground text-lg line-clamp-4 leading-relaxed">
        {product.shortDescription}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {product.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-luxury-100 text-luxury-700 rounded-full text-sm font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Quantity Selector */}
      <div className="flex flex-wrap sm:flex-nowrap col-span-2 items-center sm:space-x-6">
        <div className="flex-1 sm:flex-none sm:mr-0 mr-2">
          <div className="flex items-center space-x-3">
            <span className="font-medium text-foreground ">Quantity:</span>
            <div className="flex items-center border border-border  rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-cream-100 transition-colors rounded-l-lg"
                disabled={!product.quantity}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-3 font-medium min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => {
                  if (quantity < product.quantity) {
                    setQuantity(quantity + 1);
                  } else {
                    toast.error(
                      `Only ${product.quantity} items available in stock.`
                    );
                  }
                }}
                className="p-3 hover:bg-cream-100 transition-colors rounded-r-lg"
                disabled={!product.quantity}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="sm:text-right flex-1 sm:flex-none sm:w-auto w-full">
          <p className="text-sm text-muted-foreground">Total Price</p>
          <p className="text-xl font-bold text-foreground ">
            {formatPrice(product.price * quantity)}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap sm:flex-nowrap sm:col-span-3 sm:pt-0 pt-6 col-span-2 gap-4">
        <Button
          onClick={handleAddToCart}
          variant="luxury"
          size="xl"
          className="flex-1 sm:flex-none"
          disabled={!product.quantity}
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          {product.quantity ? "Add to Cart" : "Out of Stock"}
        </Button>

        <Button
          onClick={handleWishlistToggle}
          variant="outline"
          size="xl"
          className={`flex-1 sm:flex-none ${
            isWishlisted
              ? "bg-red-50 border-red-200 text-red-600"
              : "bg-background"
          }`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
        </Button>

        <Button
          onClick={() => handleShare()}
          variant="outline"
          size="xl"
          className="flex-1 sm:flex-none bg-background"
        >
          <Share2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Features */}
      <div className="grid sm:grid-cols-3 gap-4 pt-6 border-t border-border ">
        <div className="text-center border py-3 rounded-md border-border ">
          <Truck className="w-6 h-6 text-primary  mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground ">Free Delivery</p>
          <p className="text-xs text-muted-foreground">Orders over AED 500</p>
        </div>
        <div className="text-center border py-3 rounded-md border-border ">
          <Shield className="w-6 h-6 text-primary  mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground ">
            Freshness Guarantee
          </p>
          <p className="text-xs text-muted-foreground">100% fresh flowers</p>
        </div>
        <div className="text-center border py-3 rounded-md border-border ">
          <Gift className="w-6 h-6 text-primary  mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground ">Gift Wrapping</p>
          <p className="text-xs text-muted-foreground">
            Luxury packaging included
          </p>
        </div>
      </div>
    </motion.div>
  );
}
