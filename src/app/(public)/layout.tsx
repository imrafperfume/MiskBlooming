"use client";

import React from "react";
import dynamic from "next/dynamic";

// Loading skeletons
const HeaderLoader = () => (
  <div className="h-16 bg-white border-b animate-pulse">
    <div className="container mx-auto h-full flex items-center px-4">
      <div className="w-32 h-8 bg-gray-200 rounded-md"></div>
    </div>
  </div>
);

const FooterLoader = () => (
  <div className="h-20 bg-gray-50 border-t animate-pulse">
    <div className="container mx-auto h-full flex items-center justify-center px-4">
      <div className="w-40 h-6 bg-gray-200 rounded-md"></div>
    </div>
  </div>
);

// Error fallback components
const HeaderFallback: React.FC = () => (
  <header className="h-16 bg-white border-b flex items-center px-4">
    <div className="container mx-auto text-center">
      <span className="text-gray-600">Header failed to load</span>
    </div>
  </header>
);

const FooterFallback: React.FC = () => (
  <footer className="h-20 bg-gray-50 border-t flex items-center px-4">
    <div className="container mx-auto text-center">
      <span className="text-gray-600">Footer failed to load</span>
    </div>
  </footer>
);

// ✅ Dynamic imports (better than React.lazy for Next.js)
const Header = dynamic(
  () => import("../../components/layout/Header").catch(() => HeaderFallback),
  {
    loading: () => <HeaderLoader />,
    ssr: false, // only load on client
  }
);

const Footer = dynamic(
  () => import("../../components/layout/Footer").catch(() => FooterFallback),
  {
    loading: () => <FooterLoader />,
    ssr: false,
  }
);

// Layout
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden flex flex-col">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-1 sm:pt-24">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
