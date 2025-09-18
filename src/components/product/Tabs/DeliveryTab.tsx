import { motion } from "framer-motion";
import { Truck, Clock, Calendar } from "lucide-react";

export default function DeliveryTab() {
  return (
    <motion.div
      key="delivery"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h3 className="font-cormorant text-2xl font-bold text-charcoal-900 mb-6">
          Delivery Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-luxury-50 rounded-xl">
            <Truck className="w-8 h-8 text-luxury-500 mx-auto mb-3" />
            <h4 className="font-semibold text-charcoal-900 mb-2">
              Standard Delivery
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              Next day across UAE
            </p>
            <p className="text-sm font-medium text-luxury-600">
              Free over AED 500
            </p>
          </div>
          <div className="text-center p-6 bg-luxury-50 rounded-xl">
            <Clock className="w-8 h-8 text-luxury-500 mx-auto mb-3" />
            <h4 className="font-semibold text-charcoal-900 mb-2">
              Same Day Delivery
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              Fresh flowers today in Dubai
            </p>
            <p className="text-sm font-medium text-luxury-600">AED 50</p>
          </div>
          <div className="text-center p-6 bg-luxury-50 rounded-xl">
            <Calendar className="w-8 h-8 text-luxury-500 mx-auto mb-3" />
            <h4 className="font-semibold text-charcoal-900 mb-2">
              Scheduled Delivery
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              Perfect for special occasions
            </p>
            <p className="text-sm font-medium text-luxury-600">AED 25</p>
          </div>
        </div>
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Freshness Guarantee:</strong> All flowers are sourced fresh
            daily and arranged by our expert florists. We guarantee the
            freshness and quality of every arrangement delivered.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
