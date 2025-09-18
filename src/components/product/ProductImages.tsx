import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Eye, Award } from "lucide-react";
import { Product } from "@/src/types";

interface ProductImagesProps {
  product: Product;
  selectedImage: number;
  setSelectedImage: (index: number) => void;
  nextImage: () => void;
  prevImage: () => void;
  setIsImageModalOpen: (isOpen: boolean) => void;
}

export default function ProductImages({
  product,
  selectedImage,
  setSelectedImage,
  nextImage,
  prevImage,
  setIsImageModalOpen,
}: ProductImagesProps) {
  const discountPercentage =
    product.price &&
    product.compareAtPrice &&
    product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100
        )
      : 0;

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Main Image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-luxury group">
        <Image
          src={product.images[selectedImage].url || "/placeholder.svg"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority
          className="object-cover cursor-zoom-in"
          onClick={() => setIsImageModalOpen(true)}
        />

        {/* Image Navigation */}
        {product.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          {product.featured && (
            <div className="bg-luxury-500 text-charcoal-900 px-3 py-1 rounded-full text-sm font-bold flex items-center">
              <Award className="w-3 h-3 mr-1" />
              Featured
            </div>
          )}
          {discountPercentage > 0 && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              -{discountPercentage}% OFF
            </div>
          )}
          {!product.quantity && (
            <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              Out of Stock
            </div>
          )}
        </div>

        {/* Zoom Icon */}
        <div className="absolute top-4 right-4 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
          <Eye className="w-5 h-5" />
        </div>
      </div>

      {/* Thumbnail Images */}
      <div className="flex items-center gap-4 h-fit py-3 overflow-x-auto px-2 sm:px-0 sm:pb-2 aspect-auto">
        {product.images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 ${
              selectedImage === index
                ? "ring-2 ring-luxury-500 scale-105"
                : "hover:scale-105 opacity-70 hover:opacity-100"
            }`}
          >
            <Image
              src={image.url || "/placeholder.svg"}
              alt={`${product.name} ${index + 1}`}
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover aspect-square"
            />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
