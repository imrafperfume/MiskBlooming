import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ProductBreadcrumbProps {
  productName: string;
}

export default function ProductBreadcrumb({
  productName,
}: ProductBreadcrumbProps) {
  return (
    <motion.div
      className="flex items-center mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Link
        href="/products"
        className="flex items-center sm:text-base text-xs text-muted-foreground hover:text-primary  transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Collections
      </Link>
      <span className="mx-2 text-foreground ">/</span>
      <span className="text-foreground  font-medium text-xs sm:text-base">
        {productName}
      </span>
    </motion.div>
  );
}
