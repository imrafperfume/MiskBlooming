/**
 * Performance optimization utilities
 */

// Image optimization configuration
export const IMAGE_CONFIG = {
  // Next.js Image component optimization
  placeholder: "blur" as const,
  blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
  
  // Responsive image sizes
  sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  
  // Quality settings
  quality: 85,
  
  // Formats to generate
  formats: ["image/webp", "image/avif"] as const,
};

// Bundle optimization
export const BUNDLE_CONFIG = {
  // Dynamic imports for heavy components
  dynamicImports: [
    "RichTextEditor",
    "CloudinaryFileUpload", 
    "CloudinaryImageGallery",
    "StripePayment",
  ],
  
  // Preload critical resources
  // preload: [
  //   "/fonts/inter.woff2",
  //   "/images/hero-bg.webp",
  // ],
};

// Caching strategies
export const CACHE_CONFIG = {
  // Static assets cache
  staticAssets: {
    maxAge: 31536000, // 1 year
    immutable: true,
  },
  
  // API responses cache
  apiResponses: {
    maxAge: 300, // 5 minutes
    staleWhileRevalidate: 86400, // 1 day
  },
  
  // Page cache
  pages: {
    maxAge: 3600, // 1 hour
    staleWhileRevalidate: 86400, // 1 day
  },
};

// Performance monitoring
export const PERFORMANCE_CONFIG = {
  // Core Web Vitals thresholds
  thresholds: {
    LCP: 2500, // Largest Contentful Paint
    FID: 100,  // First Input Delay
    CLS: 0.1,  // Cumulative Layout Shift
    FCP: 1800, // First Contentful Paint
    TTFB: 800, // Time to First Byte
  },
  
  // Performance budgets
  budgets: {
    js: 250000,  // 250KB
    css: 50000,  // 50KB
    images: 1000000, // 1MB
    fonts: 100000,   // 100KB
  },
};

// Lazy loading configuration
export const LAZY_LOADING_CONFIG = {
  // Intersection Observer options
  rootMargin: "50px",
  threshold: 0.1,
  
  // Components to lazy load
  components: [
    "ProductCard",
    "ImageGallery", 
    "TestimonialSection",
    "FeaturedProducts",
  ],
};

// Resource hints
export const RESOURCE_HINTS = {
  // DNS prefetch for external domains
  dnsPrefetch: [
    "https://res.cloudinary.com",
    "https://js.stripe.com",
  ],
  
  // Preconnect to critical origins
  preconnect: [
    "https://api.stripe.com",
    "https://res.cloudinary.com",
  ],
  
  // Prefetch critical pages
  prefetch: [
    "/products",
    "/cart",
    "/checkout",
  ],
};

// Bundle analyzer configuration
export const BUNDLE_ANALYZER_CONFIG = {
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
  generateStatsFile: true,
  statsFilename: "bundle-stats.json",
};

// Service Worker configuration
export const SW_CONFIG = {
  // Cache strategies for different resource types
  strategies: {
    static: "CacheFirst",
    api: "NetworkFirst", 
    images: "CacheFirst",
    fonts: "CacheFirst",
  },
  
  // Cache version for updates
  version: "1.0.0",
  
  // Offline fallback
  offlineFallback: "/offline.html",
};
