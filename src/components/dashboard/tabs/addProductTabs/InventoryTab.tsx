import React from "react";
import { TabProps } from "../types";
import { Input } from "@/src/components/ui/Input";

function InventoryTab({
  formData,
  handleInputChange,
  errors,
  handleDimensionChange,
}: TabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-cormorant font-bold text-charcoal-900 mb-4">
          Inventory Management
        </h2>
        <p className="text-gray-600">
          Track stock levels and product identifiers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="sku"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            SKU (Stock Keeping Unit) *
          </label>
          <Input
            id="sku"
            type="text"
            value={formData.sku}
            onChange={(e) => handleInputChange("sku", e.target.value)}
            placeholder="MB-RO001"
            className={errors?.sku ? "border-red-300" : ""}
          />
          {errors?.sku && (
            <p className="text-red-500 text-sm mt-1">{errors.sku}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Auto-generated from name and category
          </p>
        </div>

        <div>
          <label
            htmlFor="barcode"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Barcode
          </label>
          <Input
            id="barcode"
            type="text"
            value={formData.barcode}
            onChange={(e) => handleInputChange("barcode", e.target.value)}
            placeholder="1234567890123"
          />
        </div>
      </div>

      {/* Quantity Tracking */}
      <div className="space-y-4">
        <div className="flex items-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.trackQuantity}
              onChange={(e) =>
                handleInputChange("trackQuantity", e.target.checked)
              }
              className="rounded border-gray-300 text-luxury-600 focus:ring-luxury-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Track quantity for this product
            </span>
          </label>
        </div>

        {formData.trackQuantity && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Current Stock Quantity *
              </label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity || ""}
                onChange={(e) =>
                  handleInputChange(
                    "quantity",
                    Number.parseInt(e.target.value) || 0
                  )
                }
                placeholder="0"
                className={errors?.quantity ? "border-red-300" : ""}
              />
              {errors?.quantity && (
                <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="lowStockThreshold"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Low Stock Alert Threshold
              </label>
              <Input
                id="lowStockThreshold"
                type="number"
                min="0"
                value={formData.lowStockThreshold || ""}
                onChange={(e) =>
                  handleInputChange(
                    "lowStockThreshold",
                    Number.parseInt(e.target.value) || 0
                  )
                }
                placeholder="5"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get notified when stock is low
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Shipping Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          Shipping Information
        </h3>

        <div className="flex items-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.requiresShipping}
              onChange={(e) =>
                handleInputChange("requiresShipping", e.target.checked)
              }
              className="rounded border-gray-300 text-luxury-600 focus:ring-luxury-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              This product requires shipping
            </span>
          </label>
        </div>

        {formData.requiresShipping && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="weight"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Weight (kg)
              </label>
              <Input
                id="weight"
                type="number"
                min="0"
                value={formData?.dimensions?.weight || ""}
                onChange={(e) =>
                  handleDimensionChange &&
                  handleDimensionChange(
                    "weight",
                    Number.parseInt(e.target.value) || 0
                  )
                }
                placeholder="0"
              />
            </div>

            <div>
              <label
                htmlFor="length"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Length (cm)
              </label>
              <Input
                id="length"
                type="number"
                min="0"
                value={formData?.dimensions?.length || ""}
                onChange={(e) =>
                  handleDimensionChange &&
                  handleDimensionChange(
                    "length",
                    Number.parseInt(e.target.value) || 0
                  )
                }
                placeholder="0"
              />
            </div>

            <div>
              <label
                htmlFor="width"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Width (cm)
              </label>
              <Input
                id="width"
                type="number"
                min="0"
                value={formData?.dimensions?.width || ""}
                onChange={(e) =>
                  handleDimensionChange &&
                  handleDimensionChange(
                    "width",
                    Number.parseInt(e.target.value) || 0
                  )
                }
                placeholder="0"
              />
            </div>

            <div>
              <label
                htmlFor="height"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Height (cm)
              </label>
              <Input
                id="height"
                type="number"
                min="0"
                value={formData?.dimensions?.height || ""}
                onChange={(e) =>
                  handleDimensionChange &&
                  handleDimensionChange(
                    "height",
                    Number.parseInt(e.target.value) || 0
                  )
                }
                placeholder="0"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InventoryTab;
