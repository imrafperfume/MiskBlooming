import { Product } from "@/src/types";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface ImageModalProps {
  product: Product;
  selectedImage: number;
  isImageModalOpen: boolean;
  setIsImageModalOpen: (isOpen: boolean) => void;
}

export default function ImageModal({
  product,
  selectedImage,
  isImageModalOpen,
  setIsImageModalOpen,
}: ImageModalProps) {
  return (
    <AnimatePresence>
      {isImageModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsImageModalOpen(false)}
        >
          <motion.div
            className="relative max-w-4xl max-h-[90vh] w-full h-full"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={product.images[selectedImage].url || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain"
            />
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-background/20 hover:bg-background/30 rounded-full flex items-center justify-center text-white"
            >
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
