"use client";

import { JSX, useMemo } from "react";
import { useCheckout } from "@/src/hooks/useCheckout";
import { useCartStore } from "../../../../store/cartStore";
import {
  CheckoutHeader,
  CheckoutProgress,
  PersonalInformationStep,
  ShippingInformationStep,
  PaymentStep,
  OrderSummary,
  EmptyCart,
} from "@/src/components/checkout";

export default function GuestCheckoutPage(): JSX.Element {
  const { items } = useCartStore();

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
  } = useCheckout(""); // Empty string for guest user

  // Memoize calculations to prevent unnecessary recalculations
  const calculations = useMemo(() => calculateTotals(), [calculateTotals]);
  console.log("🚀 ~ GuestCheckoutPage ~ calculations:", calculations);

  // Early return for empty cart
  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-br from-cream-50 to-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <CheckoutHeader />
        <CheckoutProgress currentStep={currentStep} />

        {/* Guest Checkout Notice */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Guest Checkout
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  You're checking out as a guest. You can still track your order
                  using your email address and order number.
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
