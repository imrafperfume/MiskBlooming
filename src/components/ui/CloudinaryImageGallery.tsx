"use client";

import type React from "react";

import { useState } from "react";
import {
  Star,
  X,
  Eye,
  Download,
  Move,
  Trash2,
  ImageIcon,
  Cloud,
  Zap,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import { Button } from "./Button";
import {
  getOptimizedImageUrl,
  type getResponsiveImageUrls,
} from "../../lib/cloudinary";

interface CloudinaryImage {
  url: string;
  publicId: string;
  optimizedUrls?: ReturnType<typeof getResponsiveImageUrls>;
}

interface CloudinaryImageGalleryProps {
  images: CloudinaryImage[];
  featuredIndex: number;
  onImagesChange: (images: CloudinaryImage[]) => void;
  onFeaturedChange: (index: number) => void;
  className?: string;
}

export function CloudinaryImageGallery({
  images,
  featuredIndex,
  onImagesChange,
  onFeaturedChange,
  className = "",
}: CloudinaryImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<CloudinaryImage | null>(
    null
  );
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [previewSize, setPreviewSize] = useState<
    "thumbnail" | "small" | "medium" | "large"
  >("medium");

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);

    // Adjust featured index if necessary
    if (featuredIndex === index) {
      onFeaturedChange(0);
    } else if (featuredIndex > index) {
      onFeaturedChange(featuredIndex - 1);
    }
  };

  const setFeatured = (index: number) => {
    onFeaturedChange(index);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];

    // Remove dragged image
    newImages.splice(draggedIndex, 1);

    // Insert at new position
    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newImages.splice(insertIndex, 0, draggedImage);

    onImagesChange(newImages);

    // Update featured index if necessary
    if (featuredIndex === draggedIndex) {
      onFeaturedChange(insertIndex);
    } else if (featuredIndex > draggedIndex && featuredIndex <= dropIndex) {
      onFeaturedChange(featuredIndex - 1);
    } else if (featuredIndex < draggedIndex && featuredIndex >= dropIndex) {
      onFeaturedChange(featuredIndex + 1);
    }

    setDraggedIndex(null);
  };

  const downloadImage = async (image: CloudinaryImage, index: number) => {
    try {
      const imageUrl = image.optimizedUrls?.large || image.url;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `product-image-${index + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const getImageUrl = (
    image: CloudinaryImage,
    size: "thumbnail" | "small" | "medium" | "large" = "medium"
  ) => {
    if (image.optimizedUrls) {
      return image.optimizedUrls[size];
    }
    // Fallback to generating optimized URL if not available
    if (image.publicId) {
      const dimensions = {
        thumbnail: { width: 150, height: 150 },
        small: { width: 400, height: 400 },
        medium: { width: 800, height: 800 },
        large: { width: 1200, height: 1200 },
      };
      return getOptimizedImageUrl(image.publicId, dimensions[size]);
    }
    return image.url;
  };

  if (images.length === 0) {
    return (
      <div className={`text-center py-12 text-gray-500 ${className}`}>
        <div className="flex items-center justify-center mb-4">
          <ImageIcon className="w-12 h-12 text-gray-300 mr-2" />
          <Cloud className="w-8 h-8 text-blue-300" />
        </div>
        <p>No images uploaded yet</p>
        <p className="text-sm text-blue-600 mt-1">
          Upload images to see Cloudinary optimization in action
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Preview Size Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Image Gallery</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Preview size:</span>
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setPreviewSize("thumbnail")}
              className={`p-1 rounded ${
                previewSize === "thumbnail" ? "bg-white shadow-sm" : ""
              }`}
              title="Thumbnail (150x150)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewSize("small")}
              className={`p-1 rounded ${
                previewSize === "small" ? "bg-white shadow-sm" : ""
              }`}
              title="Small (400x400)"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewSize("medium")}
              className={`p-1 rounded ${
                previewSize === "medium" ? "bg-white shadow-sm" : ""
              }`}
              title="Medium (800x800)"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewSize("large")}
              className={`p-1 rounded ${
                previewSize === "large" ? "bg-white shadow-sm" : ""
              }`}
              title="Large (1200x1200)"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={`${image.publicId}-${index}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`
              relative group cursor-move rounded-lg overflow-hidden border-2 transition-all duration-200
              ${
                featuredIndex === index
                  ? "border-luxury-400 ring-2 ring-luxury-200"
                  : "border-gray-200 hover:border-gray-300"
              }
              ${draggedIndex === index ? "opacity-50 scale-95" : ""}
            `}
          >
            {/* Image */}
            <div className="aspect-square bg-gray-100 relative">
              <img
                src={getImageUrl(image, previewSize) || "/placeholder.svg"}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Cloudinary Badge */}
              <div className="absolute bottom-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs flex items-center">
                <Cloud className="w-3 h-3 mr-1" />
                <Zap className="w-3 h-3" />
              </div>
            </div>

            {/* Featured Badge */}
            {featuredIndex === index && (
              <div className="absolute top-2 left-2 bg-luxury-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Featured
              </div>
            )}

            {/* Drag Handle */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black bg-opacity-50 text-white p-1 rounded">
                <Move className="w-4 h-4" />
              </div>
            </div>

            {/* Action Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex space-x-2">
                {/* Preview */}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="bg-white text-gray-900 hover:bg-gray-100"
                  onClick={() => setSelectedImage(image)}
                >
                  <Eye className="w-4 h-4" />
                </Button>

                {/* Set Featured */}
                {featuredIndex !== index && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="bg-white text-gray-900 hover:bg-gray-100"
                    onClick={() => setFeatured(index)}
                  >
                    <Star className="w-4 h-4" />
                  </Button>
                )}

                {/* Download */}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="bg-white text-gray-900 hover:bg-gray-100"
                  onClick={() => downloadImage(image, index)}
                >
                  <Download className="w-4 h-4" />
                </Button>

                {/* Remove */}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="bg-white text-red-600 hover:bg-red-50 border-red-200"
                  onClick={() => removeImage(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Image Index */}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={getImageUrl(selectedImage, "large") || "/placeholder.svg"}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 bg-white"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-sm">
                <Cloud className="w-4 h-4 text-blue-400" />
                <span>Cloudinary Optimized</span>
                {selectedImage.publicId && (
                  <>
                    <span>•</span>
                    <span className="font-mono text-xs">
                      {selectedImage.publicId}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Info */}
      <div className="flex items-center justify-between text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <Cloud className="w-4 h-4 mr-1 text-blue-500" />
            {images.length} optimized image{images.length !== 1 ? "s" : ""}
          </span>
          <span>•</span>
          <span>Featured: Image {featuredIndex + 1}</span>
          <span>•</span>
          <span className="flex items-center">
            <Zap className="w-4 h-4 mr-1 text-yellow-500" />
            WebP format
          </span>
        </div>
        <div className="text-xs text-gray-500">Drag images to reorder</div>
      </div>

      {/* Responsive URLs Info */}
      {images.length > 0 && images[featuredIndex]?.optimizedUrls && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <ImageIcon className="w-4 h-4 mr-2" />
            Available Image Sizes (Featured Image)
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <div className="font-medium text-gray-700">
                Thumbnail (150×150)
              </div>
              <div className="text-gray-500 font-mono break-all">
                {images[featuredIndex].optimizedUrls?.thumbnail}
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-gray-700">Small (400×400)</div>
              <div className="text-gray-500 font-mono break-all">
                {images[featuredIndex].optimizedUrls?.small}
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-gray-700">Medium (800×800)</div>
              <div className="text-gray-500 font-mono break-all">
                {images[featuredIndex].optimizedUrls?.medium}
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-gray-700">Large (1200×1200)</div>
              <div className="text-gray-500 font-mono break-all">
                {images[featuredIndex].optimizedUrls?.large}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
