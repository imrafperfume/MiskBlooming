"use client";

import Image from "next/image";
import { useState } from "react";
import { IMAGE_CONFIG } from "../../lib/performance";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  fill?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  quality = IMAGE_CONFIG.quality,
  sizes = IMAGE_CONFIG.sizes,
  fill = false,
  placeholder = "blur",
  blurDataURL = IMAGE_CONFIG.blurDataURL,
}: OptimizedImageProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  const handleLoad = () => setStatus("loaded");
  const handleError = () => setStatus("error");

  if (status === "error") {
    return (
      <div
        className={`bg-cream-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-muted-foreground text-sm">Image failed to load</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {status === "loading" && <div className="absolute inset-0 bg-cream-200 animate-pulse" />}
      
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        sizes={sizes}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        className={`transition-opacity duration-300 ${
          status === "loading" ? "opacity-0" : "opacity-100"
        }`}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  );
}
