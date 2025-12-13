"use client";

import Link from "next/link";
import { Truck } from "lucide-react";
import { Button } from "../ui/Button";

export function EmptyCart() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-24 h-24 bg-cream-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <Truck className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className="font-cormorant text-2xl lg:text-3xl font-bold text-foreground  mb-4">
          Your cart is empty
        </h1>
        <p className="text-muted-foreground mb-8">
          Add some luxury arrangements to proceed with checkout
        </p>
        <Link href="/products">
          <Button variant="luxury" size="lg">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
