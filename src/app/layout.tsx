import type React from "react";
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "../providers/QueryProvider";
import { Toaster } from "sonner";
// import { RESOURCE_HINTS } from "../lib/performance";
import { PerformanceMonitor } from "../components/ui/PerformanceMonitor";

// Optimized font loading with preload
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Reduced to essential weights only
  style: ["normal"],
  variable: "--font-cormorant",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "serif"],
  adjustFontFallback: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"], // Reduced to most used weights
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["Arial", "system-ui", "sans-serif"],
  adjustFontFallback: true,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"], // Only keep regular and semi-bold
  style: ["normal"],
  variable: "--font-playfair",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "serif"],
  adjustFontFallback: true,
});

// Optimized metadata for better SEO and performance
export const metadata: Metadata = {
  metadataBase: new URL("https://misk-blooming.vercel.app"),
  title: {
    default: "MiskBlooming - Luxury Flowers & Exquisite Gifts",
    template: "%s | MiskBlooming",
  },
  description:
    "Experience the pinnacle of floral artistry with MiskBlooming. Premium flower arrangements, luxury gifts, and bespoke creations delivered with unparalleled elegance.",
  keywords: [
    "luxury flowers",
    "premium gifts",
    "flower delivery UAE",
    "elegant arrangements",
    "corporate gifting",
  ],
  authors: [{ name: "MiskBlooming" }],
  creator: "MiskBlooming",
  publisher: "MiskBlooming",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "MiskBlooming - Luxury Flowers & Exquisite Gifts",
    description:
      "Experience the pinnacle of floral artistry with premium arrangements and luxury gifts.",
    type: "website",
    locale: "en_US",
    siteName: "MiskBlooming",
    url: "https://misk-blooming.vercel.app",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MiskBlooming - Luxury Flowers",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MiskBlooming - Luxury Flowers & Exquisite Gifts",
    description:
      "Premium flower arrangements and luxury gifts delivered with elegance.",
    images: ["/twitter-image.jpg"],
    creator: "@miskblooming",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#d4af37" },
    ],
  },
  category: "florist",
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

// Optimized viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#d4af37",
  colorScheme: "light",
};

// Conditional loading for performance monitor (production only)
const PerformanceMonitorWrapper = () => {
  if (process.env.NODE_ENV === "production") {
    return <PerformanceMonitor />;
  }
  return null;
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${playfair.variable}`}
      style={{ scrollBehavior: "smooth" }}
    >
      <head>
        {/* Preconnect and DNS prefetch for critical domains */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Preload critical images for LCP improvement */}
        <link
          rel="preload"
          href="/og-image.jpg"
          as="image"
          type="image/jpeg"
          media="(min-width: 768px)"
        />
        <link
          rel="preload"
          href="/twitter-image.jpg"
          as="image"
          type="image/jpeg"
        />

        {/* Preload critical font files */}
        <link
          rel="preload"
          href={cormorant.style.fontFamily}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Critical CSS for above-the-fold content */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Prevent layout shift during font loading */
              html {
                scroll-behavior: smooth;
                font-family: ${inter.style.fontFamily}, Arial, system-ui, sans-serif;
              }
              
              /* Ensure body takes full height without layout shift */
              body {
                margin: 0;
                padding: 0;
                min-height: 100vh;
                position: relative;
                font-family: ${inter.style.fontFamily}, Arial, system-ui, sans-serif;
              }
              
              /* Optimize font rendering */
              * {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                text-rendering: optimizeSpeed;
              }
              
              /* Hide loading skeleton when content loads */
              [data-loading] {
                display: block;
              }
              
              .loaded [data-loading] {
                display: none;
              }
            `,
          }}
        />

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Florist",
              name: "MiskBlooming",
              description: "Luxury Flowers & Exquisite Gifts",
              url: "https://misk-blooming.vercel.app",
              telephone: "+971-XXX-XXXX",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Dubai",
                addressCountry: "UAE",
              },
              openingHours: "Mo-Su 09:00-22:00",
              priceRange: "$$$",
            }),
          }}
        />
      </head>

      <body
        suppressHydrationWarning
        className="min-h-screen overflow-x-hidden bg-gradient-to-br from-cream-50 to-cream-100 antialiased"
        style={{
          position: "relative",
          minHeight: "100vh",
        }}
      >
        {/* Loading skeleton for better perceived performance */}
        <div
          id="loading-skeleton"
          data-loading
          style={{
            display: "none",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)",
            zIndex: 9999,
          }}
        />

        <PerformanceMonitorWrapper />
        <Toaster position="top-center" richColors />
        <QueryProvider>{children}</QueryProvider>

        {/* Deferred non-critical scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Performance optimization scripts
              if (typeof window !== 'undefined') {
                // Mark page as loaded to hide skeleton
                window.addEventListener('load', function() {
                  document.body.classList.add('loaded');
                  
                  // Defer non-critical operations
                  setTimeout(function() {
                    // Lazy load analytics or non-critical scripts
                    if (typeof window.gtag !== 'undefined') {
                      // Initialize analytics here
                    }
                  }, 3000);
                });
                
                // Fallback to hide skeleton after 5 seconds
                setTimeout(function() {
                  document.body.classList.add('loaded');
                }, 5000);
                
                // Optimize scrolling performance
                window.addEventListener('scroll', function() {
                  // Add any scroll optimizations here
                }, { passive: true });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
