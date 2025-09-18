import { Product } from "@/src/types";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface DescriptionTabProps {
  product: Product;
}

export default function DescriptionTab({ product }: DescriptionTabProps) {
  return (
    <motion.div
      key="description"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="prose prose-lg max-w-none"
    >
      <div className="bg-white rounded-2xl sm:p-8 shadow-sm">
        <h3 className="font-cormorant text-2xl font-bold text-charcoal-900 mb-4">
          Product Description
        </h3>
        <div
          className="all-unset safe-html"
          dangerouslySetInnerHTML={{
            __html: product.description || "",
          }}
        />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-charcoal-900 mb-3">
              Perfect For:
            </h4>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Special occasions
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Corporate gifts
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Home decoration
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-charcoal-900 mb-3">
              What's Included:
            </h4>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Premium arrangement
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Luxury packaging
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Care instructions
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
