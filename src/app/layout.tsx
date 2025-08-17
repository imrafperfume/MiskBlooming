import type React from "react";
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "../providers/QueryProvider";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MiskBlooming - Luxury Flowers & Exquisite Gifts",
  description:
    "Experience the pinnacle of floral artistry with MiskBlooming. Premium flower arrangements, luxury gifts, and bespoke creations delivered with unparalleled elegance.",
  keywords:
    "luxury flowers, premium gifts, flower delivery, elegant arrangements, corporate gifting, bespoke florals",
  authors: [{ name: "MiskBlooming" }],
  openGraph: {
    title: "MiskBlooming - Luxury Flowers & Exquisite Gifts",
    description:
      "Experience the pinnacle of floral artistry with premium arrangements and luxury gifts.",
    type: "website",
    locale: "en_US",
  },
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
      <body
        suppressHydrationWarning
        className="min-h-screen bg-gradient-to-br  overflow-x-hidden  from-cream-50 to-cream-100"
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
