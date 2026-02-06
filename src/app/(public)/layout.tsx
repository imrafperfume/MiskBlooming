import React from "react";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/HeaderDynamic";

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
