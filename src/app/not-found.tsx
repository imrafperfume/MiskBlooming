import Link from "next/link";
import { Home, Search, Flower2 } from "lucide-react";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-backgroundfrom-cream-50 via-white to-cream-100 flex items-center justify-center px-4 relative">
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <h1 className="text-9xl md:text-[12rem] font-cormorant font-black text-primary  leading-none mb-4">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-cormorant font-bold text-gray-800 mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-lg text-foreground  max-w-md mx-auto leading-relaxed">
          The page you're looking for seems to have wilted away. Let's get you
          back to our beautiful collection of flowers and gifts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <Button
            asChild
            className="luxury-gradient text-white px-8 py-3 rounded-full font-medium hover:shadow-luxury-lg transition-colors duration-300 group"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home size={20} /> Back to Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-luxury-300 text-primary hover:bg-foregroundhover:text-luxury-700 px-8 py-3 rounded-full font-medium transition-colors duration-300 group bg-transparent"
          >
            <Link href="/products" className="flex items-center gap-2">
              <Search size={20} /> Browse Products
            </Link>
          </Button>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-luxury-300"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 rounded-full bg-luxury-400"></div>
        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 rounded-full bg-foreground 0"></div>
      </div>
    </div>
  );
}
