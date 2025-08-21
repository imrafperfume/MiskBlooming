import React from "react";
import { TabProps } from "../types";
import { Input } from "@/src/components/ui/Input";
import { Truck } from "lucide-react";

function DeliveryTab({
  formData,
  handleInputChange,
  errors,
  deliveryTimes,
  deliveryZones,
  toggleDeliveryZone,
}: TabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-cormorant font-bold text-charcoal-900 mb-4">
          Delivery Settings
        </h2>
        <p className="text-gray-600">Configure delivery options and zones</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Time
          </label>
          <select
            value={formData.deliveryTime}
            onChange={(e) => handleInputChange("deliveryTime", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
          >
            {deliveryTimes?.map((time: any) => (
              <option key={time.value} value={time.value}>
                {time.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="freeDeliveryThreshold"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Free Delivery Threshold (AED)
          </label>
          <Input
            id="freeDeliveryThreshold"
            type="number"
            min="0"
            value={formData.freeDeliveryThreshold || ""}
            onChange={(e) =>
              handleInputChange(
                "freeDeliveryThreshold",
                Number.parseFloat(e.target.value) || 0
              )
            }
            placeholder="100"
          />
          <p className="text-xs text-gray-500 mt-1">
            Minimum order value for free delivery
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Delivery Zones *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {deliveryZones?.map((zone: any) => (
              <label key={zone} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.deliveryZones.includes(zone)}
                  onChange={() =>
                    toggleDeliveryZone && toggleDeliveryZone(zone)
                  }
                  className="rounded border-gray-300 text-luxury-600 focus:ring-luxury-500"
                />
                <span className="ml-2 text-sm text-gray-700">{zone}</span>
              </label>
            ))}
          </div>
          {errors?.deliveryZones && (
            <p className="text-red-500 text-sm mt-2">{errors.deliveryZones}</p>
          )}
        </div>

        {/* Selected Zones Summary */}
        {formData.deliveryZones.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2 flex items-center">
              <Truck className="w-4 h-4 mr-2" />
              Selected Delivery Zones ({formData.deliveryZones.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {formData.deliveryZones.map((zone) => (
                <span
                  key={zone}
                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800"
                >
                  {zone}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DeliveryTab;
