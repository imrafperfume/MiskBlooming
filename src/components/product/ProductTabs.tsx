import { Product } from "@/src/types";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Leaf, Truck, Star } from "lucide-react";
import DescriptionTab from "./Tabs/DescriptionTab";
import CareTab from "./Tabs/CareTab";
import DeliveryTab from "./Tabs/DeliveryTab";
import ReviewsTab from "./Tabs/ReviewsTab";

interface ProductTabsProps {
  product: Product;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  rating: number;
  setRating: (rating: number) => void;
  hover: number;
  setHover: (hover: number) => void;
  comment: string;
  setComment: (comment: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  user: any;
}

export default function ProductTabs({
  product,
  activeTab,
  setActiveTab,
  rating,
  setRating,
  hover,
  setHover,
  comment,
  setComment,
  handleSubmit,
  user,
}: ProductTabsProps) {
  const tabs = [
    { id: "description", label: "Description", icon: MessageCircle },
    { id: "care", label: "Care Instructions", icon: Leaf },
    { id: "delivery", label: "Delivery Info", icon: Truck },
    {
      id: "reviews",
      label: `Reviews (${product.Review?.length || 0})`,
      icon: Star,
    },
  ];

  return (
    <motion.div
      className="sm:mt-16 mt-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <div className="">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center ${
                activeTab === tab.id
                  ? "border-luxury-500 text-luxury-500"
                  : "border-transparent text-muted-foreground hover:text-charcoal-900"
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="py-8">
        <AnimatePresence mode="wait">
          {activeTab === "description" && <DescriptionTab product={product} />}

          {activeTab === "care" && <CareTab product={product} />}

          {activeTab === "delivery" && <DeliveryTab />}

          {activeTab === "reviews" && (
            <ReviewsTab
              product={product}
              rating={rating}
              setRating={setRating}
              hover={hover}
              setHover={setHover}
              comment={comment}
              setComment={setComment}
              handleSubmit={handleSubmit}
              user={user}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
