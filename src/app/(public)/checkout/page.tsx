"use client";

import { JSX, useEffect, useMemo } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useCheckout } from "@/src/hooks/useCheckout";
import { useCartStore } from "../../../store/cartStore";
import {
  CheckoutHeader,
  CheckoutProgress,
  PersonalInformationStep,
  ShippingInformationStep,
  PaymentStep,
  OrderSummary,
  EmptyCart,
} from "@/src/components/checkout";

export default function CheckoutPage(): JSX.Element {
  const { items } = useCartStore();
  const { data: user, isLoading } = useAuth();
  const userId = user?.id;
  const router = useRouter();
  const pathname = usePathname();

  const {
    form,
    currentStep,
    isProcessing,
    orderId,
    clientSecret,
    calculateTotals,
    handleSubmit,
    nextStep,
    prevStep,
  } = useCheckout(userId || "");


  // Memoize calculations to prevent unnecessary recalculations
  const calculations = useMemo(() => calculateTotals(), [calculateTotals]);
    console.log("🚀 ~ CheckoutPage ~ orderId:", orderId)
    console.log("🚀 ~ CheckoutPage ~ clientSecret:", clientSecret)
  useEffect(() => {
    if (!isLoading && !userId) {
      router.push(`/auth/login?callbackUrl=${pathname}`);
    }
  }, [isLoading, userId, router, pathname]);

  // Early return for empty cart
  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-br from-cream-50 to-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <CheckoutHeader />
        <CheckoutProgress currentStep={currentStep} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Checkout Form */}
          <div className="xl:col-span-2">
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6 lg:space-y-8"
            >
              {currentStep >= 1 && (
                <PersonalInformationStep 
                  form={form} 
                  onNext={nextStep} 
                />
              )}

              {currentStep >= 2 && (
                <ShippingInformationStep
                  form={form}
                  onNext={nextStep}
                  onBack={prevStep}
                  subtotal={calculations.subtotal}
                />
              )}

              {currentStep >= 3 && (
                <PaymentStep
                  form={form}
                  onBack={prevStep}
                  onSubmit={() => form.handleSubmit(handleSubmit)()}
                  isProcessing={isProcessing}
                  total={calculations.total}
                  clientSecret={clientSecret}
                  orderId={orderId}
                />
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="xl:col-span-1">
            <OrderSummary
              items={items}
              subtotal={calculations.subtotal}
              deliveryFee={calculations.deliveryFee}
              codFee={calculations.codFee}
              tax={calculations.tax}
              total={calculations.total}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

