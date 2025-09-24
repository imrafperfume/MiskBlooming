import type React from "react";
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "../providers/QueryProvider";
import { Toaster } from "sonner";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal"],
  variable: "--font-cormorant",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "serif"],
  adjustFontFallback: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["Arial", "system-ui", "sans-serif"],
  adjustFontFallback: true,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal"],
  variable: "--font-playfair",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "serif"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://misk-blooming.vercel.app"),
  title: {
    default: "MiskBlooming - Luxury Flowers & Exquisite Gifts",
    template: "%s | MiskBlooming",
  },
  description:
    "Experience the pinnacle of floral artistry with MiskBlooming. Premium flower arrangements, luxury gifts, and bespoke creations delivered with unparalleled elegance.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#d4af37",
  colorScheme: "light",
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
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Preload critical images */}
        <link rel="preload" href="/og-image.jpg" as="image" type="image/jpeg" />
        <link
          rel="preload"
          href="/twitter-image.jpg"
          as="image"
          type="image/jpeg"
        />
      </head>

      <body className="min-h-screen overflow-x-hidden bg-gradient-to-br from-cream-50 to-cream-100 antialiased">
        <Toaster position="top-center" richColors />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
