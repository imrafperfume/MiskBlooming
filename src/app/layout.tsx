import type React from "react";
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "../providers/QueryProvider";
import { Toaster } from "sonner";
import { RESOURCE_HINTS } from "../lib/performance";
import { PerformanceMonitor } from "../components/ui/PerformanceMonitor";
// Optimized font loading with preload
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Reduced weights for better performance
  style: ["normal"],
  variable: "--font-cormorant",
  display: "swap",
  preload: true,
  fallback: ["serif"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Reduced weights
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Reduced weights
  style: ["normal"],
  variable: "--font-playfair",
  display: "swap",
  preload: true,
  fallback: ["serif"],
});

// Optimized metadata for better SEO and performance
export const metadata: Metadata = {
   metadataBase: new URL("https://miskblooming.com"),
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
    "bespoke florals",
    "Dubai flowers",
    "Abu Dhabi delivery"
  ],
  authors: [{ name: "MiskBlooming" }],
  creator: "MiskBlooming",
  publisher: "MiskBlooming",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
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
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MiskBlooming - Luxury Flowers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MiskBlooming - Luxury Flowers & Exquisite Gifts",
    description: "Premium flower arrangements and luxury gifts delivered with elegance.",
    images: ["/twitter-image.jpg"],
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
  manifest: "/site.webmanifest",
  verification: {
    google: "your-google-verification-code",
  },
};

// Viewport configuration for better mobile performance
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#d4af37" },
    { media: "(prefers-color-scheme: dark)", color: "#d4af37" },
  ],
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
    >
      <head>
        {/* DNS Prefetch for performance */}
        {RESOURCE_HINTS.dnsPrefetch.map((domain) => (
          <link key={domain} rel="dns-prefetch" href={domain} />
        ))}
        
        {/* Preconnect to critical origins */}
        {RESOURCE_HINTS.preconnect.map((origin) => (
          <link key={origin} rel="preconnect" href={origin} />
        ))}
        
        {/* Preload critical fonts */}
        {/* <link
          rel="preload"
          href="/fonts/inter.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        /> */}
        
        {/* Preload critical images */}
        {/* <link rel="preload" href="/images/carousle-2.png" as="image" /> */}
        
        {/* Prefetch critical pages */}
        {RESOURCE_HINTS.prefetch.map((page) => (
          <link key={page} rel="prefetch" href={page} />
        ))}
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen overflow-x-hidden bg-gradient-to-br from-cream-50 to-cream-100 antialiased"
      >
        <PerformanceMonitor />
        <Toaster position="top-center" richColors />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
