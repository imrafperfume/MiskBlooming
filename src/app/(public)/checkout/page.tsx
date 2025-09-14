"use client";

import { JSX, useMemo } from "react";
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
import { useAuth } from "@/src/hooks/useAuth";

export default function CheckoutPage(): JSX.Element {
  const { items } = useCartStore();
  const { data: user, isLoading } = useAuth();
  const userId = user?.id;
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
  } = useCheckout(userId || ""); // Always use guest checkout
  // Memoize calculations to prevent unnecessary recalculations
  const calculations = useMemo(() => calculateTotals(), [calculateTotals]);
  // Show loading state during processing
  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-50 to-cream-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-luxury-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-cormorant font-bold text-charcoal-900 mb-2">
            Processing Your Order
          </h2>
          <p className="text-gray-600">
            Please wait while we process your order...
          </p>
        </div>
      </div>
    );
  }

  // Early return for empty cart
  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen sm:mt-14 mt-20 bg-gradient-to-br from-cream-50 to-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <CheckoutHeader />
        <CheckoutProgress currentStep={currentStep} />

        {/* Guest Checkout Notice */}
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Quick Checkout - No Account Required
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  You can complete your purchase without creating an account.
                  You'll receive order updates via email and can track your
                  order using your order number.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Checkout Form */}
          <div className="xl:col-span-2">
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6 lg:space-y-8"
            >
              {currentStep >= 1 && (
                <PersonalInformationStep form={form} onNext={nextStep} />
              )}

              {currentStep >= 2 && (
                <ShippingInformationStep
                  form={form}
                  onNext={nextStep}
                  onBack={prevStep}
                  userId={userId || ""}
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
              couponDiscount={calculations.couponDiscount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
