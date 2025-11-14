import Button from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Plus, Search, X } from "lucide-react";
import React from "react";
import { TabProps } from "../types";

function SEOTab({
  formData,
  handleInputChange,
  errors,
  removeKeyword,
  newKeyword,
  addKeyword,
  setNewKeyword,
}: TabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-cormorant font-bold text-foreground  mb-4">
          SEO Optimization
        </h2>
        <p className="text-foreground ">
          Optimize your product for search engines
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="seoTitle"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            SEO Title *
          </label>
          <Input
            id="seoTitle"
            type="text"
            value={formData.seoTitle}
            onChange={(e) => handleInputChange("seoTitle", e.target.value)}
            placeholder="Premium Red Rose Bouquet - Dubai Flower Delivery"
            maxLength={60}
            className={errors?.seoTitle ? "border-red-300" : ""}
          />
          <div className="flex justify-between items-center mt-1">
            {errors?.seoTitle && (
              <p className="text-red-500 text-sm">{errors.seoTitle}</p>
            )}
            <p className="text-xs text-foreground ml-auto">
              {formData.seoTitle.length}/60
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="seoDescription"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            SEO Description *
          </label>
          <textarea
            id="seoDescription"
            value={formData.seoDescription}
            onChange={(e) =>
              handleInputChange("seoDescription", e.target.value)
            }
            placeholder="Beautiful premium red roses arranged in an elegant bouquet. Perfect for anniversaries, birthdays, and special occasions. Same-day delivery in Dubai."
            rows={4}
            maxLength={160}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-luxury-500 focus:border-transparent ${
              errors?.seoDescription ? "border-red-300" : "border-gray-300"
            }`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors?.seoDescription && (
              <p className="text-red-500 text-sm">{errors.seoDescription}</p>
            )}
            <p className="text-xs text-foreground ml-auto">
              {formData.seoDescription.length}/160
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SEO Keywords
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.seoKeywords.map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                <Search className="w-3 h-3 mr-1" />
                {keyword}
                <button
                  type="button"
                  onClick={() => removeKeyword && removeKeyword(keyword)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword && setNewKeyword(e.target.value)}
              placeholder="Add SEO keyword..."
              onKeyPress={(e) =>
                e.key === "Enter" &&
                (e.preventDefault(), addKeyword && addKeyword())
              }
            />
            <Button type="button" onClick={addKeyword} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-foreground mt-1">
            Add relevant keywords for better search visibility
          </p>
        </div>

        {/* SEO Preview */}
        <div className="bg-gray-50 border border-border  rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">
            Search Engine Preview
          </h4>
          <div className="space-y-2">
            <div className="text-blue-600 text-lg font-medium hover:underline cursor-pointer">
              {formData.seoTitle || "Your SEO Title"}
            </div>
            <div className="text-green-700 text-sm">
              https://miskblooming.com/products/
              {formData.slug || "product-slug"}
            </div>
            <div className="text-foreground  text-sm">
              {formData.seoDescription ||
                "Your SEO description will appear here..."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SEOTab;
