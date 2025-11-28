import React from "react";
import { TabProps } from "../types";
import { Calendar, Gift, Heart } from "lucide-react";

function FeaturesTab({
  formData,
  handleInputChange,
  occasionsList,
  toggleOccasion,
}: TabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-cormorant font-bold text-foreground  mb-4">
          Product Features
        </h2>
        <p className="text-foreground ">
          Additional features and care instructions
        </p>
      </div>

      <div className="space-y-6">
        {/* Product Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.giftWrapping}
                onChange={(e) =>
                  handleInputChange("giftWrapping", e.target.checked)
                }
                className="rounded border-border  text-primary focus:ring-ring"
              />
              <span className="ml-2 text-sm font-medium text-gray-700 flex items-center">
                <Gift className="w-4 h-4 mr-1" />
                Gift Wrapping Available
              </span>
            </label>
          </div>

          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.personalization}
                onChange={(e) =>
                  handleInputChange("personalization", e.target.checked)
                }
                className="rounded border-border  text-primary focus:ring-ring"
              />
              <span className="ml-2 text-sm font-medium text-gray-700 flex items-center">
                <Heart className="w-4 h-4 mr-1" />
                Personalization Available
              </span>
            </label>
          </div>
        </div>

        {/* Occasions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Suitable Occasions
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {occasionsList?.map((occasion: any) => (
              <label key={occasion} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.occasions.includes(occasion)}
                  onChange={() => toggleOccasion && toggleOccasion(occasion)}
                  className="rounded border-border  text-primary focus:ring-ring"
                />
                <span className="ml-2 text-sm text-gray-700">{occasion}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Selected Occasions */}
        {formData.occasions.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-2 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Selected Occasions ({formData.occasions.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {formData.occasions.map((occasion) => (
                <span
                  key={occasion}
                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-100 text-purple-800"
                >
                  {occasion}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Care Instructions */}
        <div>
          <label
            htmlFor="careInstructions"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Care Instructions
          </label>
          <textarea
            id="careInstructions"
            value={formData.careInstructions}
            onChange={(e) =>
              handleInputChange("careInstructions", e.target.value)
            }
            placeholder="Provide care instructions for the product (e.g., watering schedule for plants, storage instructions for chocolates, etc.)"
            rows={4}
            className="w-full px-3 py-2 border border-border  rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}

export default FeaturesTab;
