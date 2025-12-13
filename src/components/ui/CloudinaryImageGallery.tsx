"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Star, X, Move, Eye, Download, Cloud, Settings } from "lucide-react";
import { Button } from "./Button";
import type { getResponsiveImageUrls } from "../../lib/cloudinary";

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
  showOptimizedUrls?: boolean;
}

export function CloudinaryImageGallery({
  images,
  featuredIndex,
  onImagesChange,
  onFeaturedChange,
  className = "",
  showOptimizedUrls = true,
}: CloudinaryImageGalleryProps) {
  const [previewImage, setPreviewImage] = useState<CloudinaryImage | null>(
    null
  );

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onImagesChange(items);

    // Update featured index if needed
    if (featuredIndex === result.source.index) {
      onFeaturedChange(result.destination.index);
    } else if (
      featuredIndex > result.source.index &&
      featuredIndex <= result.destination.index
    ) {
      onFeaturedChange(featuredIndex - 1);
    } else if (
      featuredIndex < result.source.index &&
      featuredIndex >= result.destination.index
    ) {
      onFeaturedChange(featuredIndex + 1);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);

    // Update featured index
    if (featuredIndex === index) {
      onFeaturedChange(0);
    } else if (featuredIndex > index) {
      onFeaturedChange(featuredIndex - 1);
    }
  };

  const setFeaturedImage = (index: number) => {
    onFeaturedChange(index);
  };

  const downloadImage = (image: CloudinaryImage) => {
    const link = document.createElement("a");
    link.href = image.optimizedUrls?.original || image.url;
    link.download = `${image.publicId.split("/").pop()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getImageUrl = (
    image: CloudinaryImage,
    size: "thumbnail" | "small" | "medium" = "medium"
  ) => {
    if (image.optimizedUrls) {
      return image.optimizedUrls[size];
    }
    return image.url;
  };

  const isMockImage = (image: CloudinaryImage) => {
    return image.publicId.includes("mock_") || image.url.startsWith("blob:");
  };

  if (images.length === 0) {
    return (
      <div className={`text-center py-8 text-foreground ${className}`}>
        <Cloud className="w-12 h-12 mx-auto mb-2 text-gray-400" />
        <p>No images uploaded yet</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="images" direction="horizontal">
          {(provided: any) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {images.map((image, index) => (
                <Draggable
                  key={image.publicId}
                  draggableId={image.publicId}
                  index={index}
                >
                  {(provided: any, snapshot: any) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`relative group bg-background rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                        featuredIndex === index
                          ? "border-yellow-400 shadow-lg"
                          : "border-border  hover:border-border "
                      } ${snapshot.isDragging ? "shadow-xl scale-105" : ""}`}
                    >
                      {/* Drag Handle */}
                      <div
                        {...provided.dragHandleProps}
                        className="absolute top-2 left-2 z-10 bg-black bg-opacity-50 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
                      >
                        <Move className="w-3 h-3" />
                      </div>

                      {/* Featured Badge */}
                      {featuredIndex === index && (
                        <div className="absolute top-2 right-2 z-10 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Featured
                        </div>
                      )}

                      {/* Mock Mode Indicator */}
                      {isMockImage(image) && (
                        <div className="absolute top-2 right-2 z-10 bg-orange-500 text-white p-1 rounded">
                          <Settings className="w-3 h-3" />
                        </div>
                      )}

                      {/* Image */}
                      <div className="aspect-square relative overflow-hidden">
                        <img
                          src={
                            getImageUrl(image, "medium") || "/placeholder.svg"
                          }
                          alt={`Product image ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />

                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => setPreviewImage(image)}
                              className="bg-background bg-opacity-90 hover:bg-opacity-100"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => downloadImage(image)}
                              className="bg-background bg-opacity-90 hover:bg-opacity-100"
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => removeImage(index)}
                              className="bg-red-500 bg-opacity-90 hover:bg-opacity-100 text-white border-red-500"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Image Info */}
                      <div className="p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-foreground truncate">
                            {isMockImage(image)
                              ? "Mock Image"
                              : image.publicId.split("/").pop()}
                          </span>
                          {isMockImage(image) && (
                            <Settings className="w-3 h-3 text-orange-500" />
                          )}
                        </div>

                        {/* Set as Featured Button */}
                        {featuredIndex !== index && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setFeaturedImage(index)}
                            className="w-full text-xs"
                          >
                            <Star className="w-3 h-3 mr-1" />
                            Set as Featured
                          </Button>
                        )}

                        {/* Optimized URLs Info */}
                        {showOptimizedUrls &&
                          image.optimizedUrls &&
                          !isMockImage(image) && (
                            <div className="text-xs text-blue-600 flex items-center">
                              <Cloud className="w-3 h-3 mr-1" />
                              Optimized
                            </div>
                          )}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </Button>
            <img
              src={getImageUrl(previewImage, "thumbnail") || "/placeholder.svg"}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {isMockImage(previewImage)
                      ? "Mock Image"
                      : previewImage.publicId.split("/").pop()}
                  </p>
                  {previewImage.optimizedUrls && !isMockImage(previewImage) && (
                    <p className="text-sm text-gray-300 flex items-center">
                      <Cloud className="w-3 h-3 mr-1" />
                      Cloudinary Optimized
                    </p>
                  )}
                  {isMockImage(previewImage) && (
                    <p className="text-sm text-orange-300 flex items-center">
                      <Settings className="w-3 h-3 mr-1" />
                      Mock Mode
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => downloadImage(previewImage)}
                  className="bg-background bg-opacity-20 hover:bg-opacity-30 text-white border-white border-opacity-30"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Stats */}
      <div className="bg-background rounded-lg p-4">
        <div className="flex items-center justify-between text-sm text-foreground ">
          <div className="flex items-center space-x-4">
            <span>{images.length} images total</span>
            <span>Featured: Image {featuredIndex + 1}</span>
            {images.some(isMockImage) && (
              <span className="text-orange-600 flex items-center">
                <Settings className="w-3 h-3 mr-1" />
                {images.filter(isMockImage).length} mock images
              </span>
            )}
          </div>
          <div className="text-xs text-foreground ">
            Drag to reorder • Click star to set featured
          </div>
        </div>
      </div>
    </div>
  );
}
