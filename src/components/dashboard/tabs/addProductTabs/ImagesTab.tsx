import { CloudinaryFileUpload } from "@/src/components/ui/CloudinaryFileUpload";
import { CloudinaryImageGallery } from "@/src/components/ui/CloudinaryImageGallery";
import { Cloud, Zap } from "lucide-react";
import React from "react";
import { TabProps } from "../types";

function ImagesTab({
  formData,
  handleInputChange,
  errors,
  handleImagesUploaded,
}: TabProps) {
  return (
    <div className="space-y-6 l">
      <div>
        <h2 className="text-xl font-cormorant font-bold text-charcoal-900 mb-4 flex items-center">
          Product Images
          <Cloud className="w-6 h-6 ml-2 text-blue-500" />
          {errors?.images && (
            <span className="text-red-500 ml-2 text-sm">{errors.images}</span>
          )}
        </h2>
        <p className="text-gray-600">
          Upload high-quality images with automatic Cloudinary optimization
        </p>
      </div>

      {/* Cloudinary File Upload Component */}
      <CloudinaryFileUpload
        onFilesUploaded={handleImagesUploaded ? handleImagesUploaded : () => {}}
        maxFiles={10}
        maxFileSize={10}
        existingFiles={formData.images.map((img) => ({
          url: img.url,
          publicId: img.publicId,
        }))}
        className={errors?.images ? "border-red-300" : ""}
        folder="misk-blooming/products"
        tags={[
          "product",
          "misk-blooming",
          formData.category || "uncategorized",
        ]}
      />

      {/* Cloudinary Image Gallery */}
      {formData.images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              Optimized Images
              <Cloud className="w-5 h-5 ml-2 text-blue-500" />
              <Zap className="w-4 h-4 ml-1 text-yellow-500" />
            </h3>
            <div className="text-sm text-gray-500">
              {formData.images.length} of 10 images
            </div>
          </div>

          <CloudinaryImageGallery
            images={formData.images}
            featuredIndex={formData.featuredImage}
            onImagesChange={(images) => handleInputChange("images", images)}
            onFeaturedChange={(index) =>
              handleInputChange("featuredImage", index)
            }
          />
        </div>
      )}

      {/* Image Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2 flex items-center">
          <Zap className="w-4 h-4 mr-2" />
          Image Optimization Features
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Automatic WebP conversion for faster loading</li>
          <li>• Multiple size variants (thumbnail, small, medium, large)</li>
          <li>• Quality optimization based on content</li>
          <li>• CDN delivery for global performance</li>
          <li>• Drag & drop reordering with featured image selection</li>
        </ul>
      </div>
    </div>
  );
}

export default ImagesTab;
