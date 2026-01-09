"use client";

import { RefreshCw, Home, AlertTriangle } from "lucide-react";
import Button from "../components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-backgroundfrom-red-50 via-white to-red-100 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-cormorant font-bold text-gray-800 mb-4">
            Something Went Wrong
          </h1>
        </div>

        <p className="text-lg text-foreground  max-w-md mx-auto leading-relaxed">
          We encountered an unexpected error. Our team has been notified and is
          working to fix this issue.
        </p>

        {process.env.NODE_ENV === "development" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left max-w-lg mx-auto mt-4">
            <h3 className="font-semibold text-red-800 mb-2">Error Details:</h3>
            <p className="text-sm text-red-700 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <Button
            onClick={reset}
            className="luxury-gradient text-white px-8 py-3 rounded-full font-medium hover:shadow-luxury-lg transition-colors transition-shadow duration-300"
          >
            <RefreshCw size={20} className="mr-2" />
            Try Again
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-luxury-300 text-primary hover:bg-foregroundpx-8 py-3 rounded-full font-medium transition-colors duration-300 bg-transparent"
          >
            <a href="/">
              <Home size={20} className="mr-2" />
              Back to Home
            </a>
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-border ">
          <p className="text-sm text-foreground mb-2">
            Need immediate assistance?
          </p>
          <a
            href="mailto:support@miskblooming.ae"
            className="text-primary hover:text-luxury-700 hover:underline transition-colors"
          >
            Contact our support team
          </a>
        </div>
      </div>
    </div>
  );
}
