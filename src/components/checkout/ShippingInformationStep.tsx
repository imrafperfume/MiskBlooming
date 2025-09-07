"use client";

import { Truck } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { CheckoutStep } from "./CheckoutStep";
import { CouponInput } from "./CouponInput";
import type { CheckoutFormData } from "../../types/checkout";

interface ShippingInformationStepProps {
  form: UseFormReturn<CheckoutFormData>;
  onNext: () => void;
  onBack: () => void;
  subtotal: number;
}

const emirates = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
];

export function ShippingInformationStep({ 
  form, 
  onNext, 
  onBack, 
  subtotal 
}: ShippingInformationStepProps) {
  const { register, formState: { errors }, watch } = form;
  const deliveryType = watch("deliveryType");

  return (
    <CheckoutStep>
      <div className="flex items-center mb-6">
        <Truck className="w-5 h-5 lg:w-6 lg:h-6 text-luxury-500 mr-3" />
        <h2 className="font-cormorant text-xl lg:text-2xl font-bold text-charcoal-900">
          Shipping Information
        </h2>
      </div>

      <div className="space-y-4 lg:space-y-6">
        <Input
          label="Street Address"
          {...register("address")}
          error={errors.address?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <Input
            label="City"
            {...register("city")}
            error={errors.city?.message}
          />
          <div>
            <label className="block text-sm font-medium text-charcoal-900 mb-2">
              Emirate
            </label>
            <select
              {...register("emirate")}
              className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent transition-all duration-300"
            >
              <option value="">Select Emirate</option>
              {emirates.map((emirate) => (
                <option key={emirate} value={emirate}>
                  {emirate}
                </option>
              ))}
            </select>
            {errors.emirate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.emirate.message}
              </p>
            )}
          </div>
          <Input
            label="Postal Code (Optional)"
            {...register("postalCode")}
          />
        </div>

        {/* Delivery Options */}
        <div>
          <label className="block text-sm font-medium text-charcoal-900 mb-4">
            Delivery Options
          </label>
          <div className="space-y-3">
            <label className="flex items-center p-4 border-2 border-cream-300 rounded-xl cursor-pointer hover:bg-cream-50 hover:border-luxury-300 transition-all duration-300">
              <input
                type="radio"
                value="STANDARD"
                {...register("deliveryType")}
                className="mr-3 text-luxury-500 focus:ring-luxury-500"
              />
              <div className="flex-1">
                <div className="font-medium text-charcoal-900">
                  Standard Delivery
                </div>
                <div className="text-sm text-muted-foreground">
                  Next day delivery across UAE •{" "}
                  {subtotal > 500 ? "Free" : "AED 25"}
                </div>
              </div>
            </label>

            <label className="flex items-center p-4 border-2 border-cream-300 rounded-xl cursor-pointer hover:bg-cream-50 hover:border-luxury-300 transition-all duration-300">
              <input
                type="radio"
                value="EXPRESS"
                {...register("deliveryType")}
                className="mr-3 text-luxury-500 focus:ring-luxury-500"
              />
              <div className="flex-1">
                <div className="font-medium text-charcoal-900 flex items-center">
                  Same Day Delivery
                  <span className="ml-2 px-2 py-1 bg-luxury-100 text-luxury-700 text-xs rounded-full">
                    Popular
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Fresh flowers delivered today in Dubai • AED 50
                </div>
              </div>
            </label>

            <label className="flex items-center p-4 border-2 border-cream-300 rounded-xl cursor-pointer hover:bg-cream-50 hover:border-luxury-300 transition-all duration-300">
              <input
                type="radio"
                value="SCHEDULED"
                {...register("deliveryType")}
                className="mr-3 text-luxury-500 focus:ring-luxury-500"
              />
              <div className="flex-1">
                <div className="font-medium text-charcoal-900">
                  Scheduled Delivery
                </div>
                <div className="text-sm text-muted-foreground">
                  Perfect timing for special occasions • AED 25
                </div>
              </div>
            </label>
          </div>
        </div>

        {deliveryType === "SCHEDULED" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 p-4 bg-cream-50 rounded-xl">
            <Input
              label="Preferred Date"
              type="date"
              {...register("deliveryDate")}
            />
            <div>
              <label className="block text-sm font-medium text-charcoal-900 mb-2">
                Preferred Time
              </label>
              <select
                {...register("deliveryTime")}
                className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
              >
                <option value="">Select Time</option>
                <option value="morning">Morning (9AM - 12PM)</option>
                <option value="afternoon">Afternoon (12PM - 5PM)</option>
                <option value="evening">Evening (5PM - 8PM)</option>
              </select>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-charcoal-900 mb-2">
            Special Instructions (Optional)
          </label>
          <textarea
            {...register("specialInstructions")}
            rows={3}
            className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent transition-all duration-300"
            placeholder="Special delivery instructions, gift message, or occasion details..."
          />
        </div>

        {/* Coupon Input */}
        <CouponInput />
      </div>

      <div className="mt-6 flex sm:flex-row flex-col gap-4 sm:gap-0 justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back to Information
        </Button>
        <Button type="button" variant="luxury" onClick={onNext}>
          Continue to Payment
        </Button>
      </div>
    </CheckoutStep>
  );
}
