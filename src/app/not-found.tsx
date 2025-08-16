import Link from "next/link";
import { Home, Search, Flower2 } from "lucide-react";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-cream-100 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Decorative Elements */}
        <div className="relative mb-8">
          <div className="absolute -top-4 -left-4 text-luxury-200 opacity-30">
            <Flower2 size={120} />
          </div>
          <div className="absolute -top-8 -right-8 text-luxury-200 opacity-20">
            <Flower2 size={80} />
          </div>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-luxury-200 opacity-25">
            <Flower2 size={60} />
          </div>

          {/* 404 Number */}
          <div className="relative z-10">
            <h1 className="text-9xl md:text-[12rem] font-cormorant font-black text-luxury-500 leading-none mb-4">
              404
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl md:text-4xl font-cormorant font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h2>

          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            The page you're looking for seems to have wilted away. Let's get you
            back to our beautiful collection of flowers and gifts.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Button
              asChild
              className="luxury-gradient text-white px-8 py-3 rounded-full font-medium hover:shadow-luxury-lg transition-all duration-300 group"
            >
              <Link href="/" className="flex items-center gap-2">
                <Home size={20} />
                Back to Home
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-luxury-300 text-luxury-600 hover:bg-luxury-50 hover:text-luxury-700 px-8 py-3 rounded-full font-medium transition-all duration-300 group bg-transparent"
            >
              <Link href="/products" className="flex items-center gap-2">
                <Search size={20} />
                Browse Products
              </Link>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t border-cream-200">
            <p className="text-sm text-gray-500 mb-4">
              Or explore these popular sections:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                href="/products?category=roses"
                className="text-luxury-600 hover:text-luxury-700 hover:underline transition-colors"
              >
                Premium Roses
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/products?category=bouquets"
                className="text-luxury-600 hover:text-luxury-700 hover:underline transition-colors"
              >
                Luxury Bouquets
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/products?occasion=wedding"
                className="text-luxury-600 hover:text-luxury-700 hover:underline transition-colors"
              >
                Wedding Flowers
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/contact"
                className="text-luxury-600 hover:text-luxury-700 hover:underline transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-luxury-300"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 rounded-full bg-luxury-400"></div>
          <div className="absolute bottom-1/4 left-1/3 w-16 h-16 rounded-full bg-luxury-500"></div>
        </div>
      </div>
    </div>
  );
}
