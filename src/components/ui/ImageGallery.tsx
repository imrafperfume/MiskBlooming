"use client";

import type React from "react";

import { useState } from "react";
import { Star, X, Eye, Download, Move, Trash2, ImageIcon } from "lucide-react";
import { Button } from "./Button";

interface ImageGalleryProps {
  images: string[];
  featuredIndex: number;
  onImagesChange: (images: string[]) => void;
  onFeaturedChange: (index: number) => void;
  className?: string;
}

export function ImageGallery({
  images,
  featuredIndex,
  onImagesChange,
  onFeaturedChange,
  className = "",
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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

  const downloadImage = async (imageUrl: string, index: number) => {
    try {
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

  if (images.length === 0) {
    return (
      <div className={`text-center py-12 text-gray-500 ${className}`}>
        <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No images uploaded yet</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
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
            <div className="aspect-square bg-gray-100">
              <img
                src={image || "/placeholder.svg"}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
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
              src={selectedImage || "/placeholder.svg"}
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
          </div>
        </div>
      )}

      {/* Gallery Info */}
      <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
        <div className="flex items-center space-x-4">
          <span>
            {images.length} image{images.length !== 1 ? "s" : ""} uploaded
          </span>
          <span>•</span>
          <span>Featured: Image {featuredIndex + 1}</span>
        </div>
        <div className="text-xs text-gray-500">Drag images to reorder</div>
      </div>
    </div>
  );
}
