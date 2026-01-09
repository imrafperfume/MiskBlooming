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
  Check,
  Hash,
} from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import Button from "../ui/button";

interface ProductInfoProps {
  product: Product;
  quantity: number;
  setQuantity: (quantity: number) => void;
  setVariant: (variants: Record<string, string>) => void;
  selectedVariants: Record<string, string>;
  isWishlisted: boolean;
  handleAddToCart: (
    e: React.MouseEvent<HTMLButtonElement>,
    selectedVariants: Record<string, string>
  ) => void;
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
  setVariant,
  selectedVariants,
}: ProductInfoProps) {
  // Initialize default variants using Option Names instead of IDs
  useEffect(() => {
    // Only set defaults if product has options AND no variants are currently selected
    if (
      product.variantOptions &&
      product.variantOptions.length > 0 &&
      Object.keys(selectedVariants).length === 0
    ) {
      const defaults: Record<string, string> = {};
      product.variantOptions.forEach((option: any) => {
        if (option.values && option.values.length > 0) {
          // CHANGE: Use option.name (e.g., "Color") instead of option.id
          defaults[option.name] = option.values[0];
        }
      });
      setVariant(defaults);
    }
  }, [product, selectedVariants, setVariant]);

  const handleVariantChange = (optionName: string, value: string) => {
    const newVariants = { ...selectedVariants, [optionName]: value };
    setVariant(newVariants);
  };

  const discountPercentage =
    product.price &&
    product.compareAtPrice &&
    product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100
        )
      : 0;

  const totalReviews = reviews?.length || 0;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

  const handleShare = async () => {
    const shareData = {
      title: product?.name,
      text: `Check out: ${product?.name}`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error(err);
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      toast.success("Link copied to clipboard");
    }
  };

  const hasVariants =
    product.variantOptions && product.variantOptions.length > 0;

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* --- Top Metadata --- */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-primary/80 bg-primary/5 px-2 py-1 rounded-md">
            {product.category?.replace("-", " ")}
          </span>
          {product?.sku && (
            <div className="flex items-center text-xs text-muted-foreground/60 font-mono">
              <Hash className="w-3 h-3 mr-0.5" />
              {product?.sku}
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="flex items-center gap-2 group cursor-default">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="ml-1.5 font-semibold text-foreground text-sm">
              {averageRating.toFixed(1)}
            </span>
          </div>
          <span className="text-xs text-muted-foreground underline decoration-dotted underline-offset-2">
            {totalReviews} reviews
          </span>
        </div>
      </div>

      {/* --- Title & Price --- */}
      <div className="space-y-4">
        <h1 className="font-cormorant text-4xl sm:text-5xl font-bold text-foreground leading-[1.1] tracking-tight">
          {product.name}
        </h1>

        <div className="flex flex-wrap items-end gap-3">
          <span className="text-3xl font-semibold text-foreground tracking-tight">
            {formatPrice(product.price)}
          </span>

          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-lg text-muted-foreground/60 line-through mb-1">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}

          {discountPercentage > 0 && (
            <span className="mb-1.5 px-2.5 py-0.5 bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider rounded-full">
              Save {discountPercentage}%
            </span>
          )}
        </div>

        <div
          className="text-muted-foreground text-base leading-relaxed max-w-xl"
          dangerouslySetInnerHTML={{ __html: product.shortDescription || "" }}
        />
      </div>

      {/* --- Modern Variants Section --- */}
      {hasVariants && (
        <div className="space-y-6 py-2">
          {product.variantOptions?.map((option: any) => (
            <div key={option.id} className="space-y-3">
              {/* Option Label & Selected Value */}
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-foreground tracking-wide">
                  {option.name === "Size" ? "Box Size" : "Box Color"}
                </span>
                <span className="text-primary font-medium text-xs uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded">
                  {/* CHANGE: Look up value using option.name */}
                  {selectedVariants[option.name]}
                </span>
              </div>

              {/* Option Values */}
              <div className="flex flex-wrap gap-3">
                {option.values.map((value: string) => {
                  // CHANGE: Check selection using option.name
                  const isSelected = selectedVariants[option.name] === value;

                  return (
                    <motion.button
                      key={value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      // CHANGE: Pass option.name instead of option.id
                      onClick={() => handleVariantChange(option.name, value)}
                      className={`
                        relative group flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-full border transition-all duration-300 ease-out
                        ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
                            : "border-border bg-background/50 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-secondary/40"
                        }
                      `}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {isSelected && (
                          <motion.span
                            initial={{ width: 0, opacity: 0, scale: 0 }}
                            animate={{ width: "auto", opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Check className="w-3.5 h-3.5" strokeWidth={3} />
                          </motion.span>
                        )}
                        {value}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="h-px w-full bg-border/60" />

      {/* --- Quantity & Actions --- */}
      <div className="space-y-6">
        {/* Quantity Row */}
        <div className="flex items-center justify-between">
          <div>
            <span className="block text-sm font-semibold text-foreground mb-2">
              Quantity
            </span>
            <div className="flex items-center p-1 border border-border rounded-xl bg-secondary/20 w-fit">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="p-2.5 rounded-lg hover:bg-background shadow-sm disabled:opacity-50 disabled:shadow-none transition-colors"
              >
                <Minus className="w-4 h-4" />
              </motion.button>
              <span className="w-12 text-center font-semibold text-lg tabular-nums">
                {quantity}
              </span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (quantity < product.quantity) setQuantity(quantity + 1);
                  else toast.error(`Max stock reached`);
                }}
                disabled={quantity >= product.quantity}
                className="p-2.5 rounded-lg hover:bg-background shadow-sm disabled:opacity-50 disabled:shadow-none transition-colors"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Total Price Display */}
          <div className="text-right">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              Subtotal
            </p>
            <p className="text-2xl font-bold text-foreground">
              {formatPrice(product.price * quantity)}
            </p>
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="flex gap-3">
          <Button
            onClick={(e) => handleAddToCart(e, selectedVariants)}
            variant="luxury"
            size="xl"
            className="flex-[3] text-base h-14 rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all"
            disabled={!product.quantity}
          >
            <div className="flex items-center justify-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              {product.quantity ? "Add to Cart" : "Out of Stock"}
            </div>
          </Button>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleWishlistToggle}
            className={`flex-1 h-14 rounded-xl border flex items-center justify-center transition-colors ${
              isWishlisted
                ? "bg-rose-50 border-rose-200 text-rose-500"
                : "bg-background border-border hover:bg-secondary/50 text-foreground"
            }`}
          >
            <Heart
              className={`w-6 h-6 ${isWishlisted ? "fill-current" : ""}`}
            />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleShare}
            className="flex-1 h-14 rounded-xl border border-border bg-background hover:bg-secondary/50 flex items-center justify-center text-foreground transition-colors"
          >
            <Share2 className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
