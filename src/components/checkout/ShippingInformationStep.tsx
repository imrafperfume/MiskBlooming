"use client";

import { Truck } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CheckoutStep } from "./CheckoutStep";
import { CouponInput } from "./CouponInput";
import type { CheckoutFormData } from "../../types/checkout";
import { useEffect } from "react";

interface ShippingInformationStepProps {
  form: UseFormReturn<CheckoutFormData>;
  onNext: () => void;
  onBack: () => void;
  subtotal: number;
  userId: string;
  isGiftCardEnabled?: boolean;
  giftCardFeeAmount?: number;
  deliveryFlatRate?: number;
  expressDeliveryFee?: number;
  scheduledDeliveryFee?: number;
  freeShippingThreshold?: number | null;
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
  subtotal,
  userId,
  isGiftCardEnabled = false,
  giftCardFeeAmount = 0,
  deliveryFlatRate = 15,
  expressDeliveryFee = 30,
  scheduledDeliveryFee = 10,
  freeShippingThreshold = null,
}: ShippingInformationStepProps) {
  const {
    register,
    setValue,
    formState: { errors },
    watch,
  } = form;
  const deliveryType = watch("deliveryType");
  useEffect(() => {
    handleCurrentLocation();
  }, []);
  const handleCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      // OpenStreetMap Reverse Geocode
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await res.json();
      const address = data.address;

      //Extracting individual parts safely
      const street =
        address.road ||
        address.residential ||
        address.neighbourhood ||
        data.display_name ||
        "";
      const city =
        address.city ||
        address.town ||
        address.village ||
        address.countsy ||
        "";

      const emirate = address.state || "";

      const postalCode = address.postcode || "";
      setValue("emirate", emirate);
      setValue("address", street);
      setValue("city", city);
      setValue("postalCode", postalCode);
    });
  };

  return (
    <CheckoutStep>
      <div className="flex items-center mb-6">
        <Truck className="w-5 h-5 lg:w-6 lg:h-6 text-primary  mr-3" />
        <h2 className="font-cormorant text-xl lg:text-2xl font-bold text-foreground ">
          Shipping Information
        </h2>
      </div>

      <div className="space-y-4 lg:space-y-6">
        <Input
          className="bg-transparent placeholder-foreground"
          placeholder="CA, 1234, Street Name"
          label="Street Address"
          {...register("address")}
          error={errors.address?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <Input
            className="bg-transparent placeholder-foreground"
            placeholder="Dubai"
            label="City"
            {...register("city")}
            error={errors.city?.message}
          />
          <div>
            <label className="block text-sm font-medium text-foreground  mb-2">
              Emirate
            </label>

            <select
              {...register("emirate")}
              value={watch("emirate") || ""}
              onChange={(e) => setValue("emirate", e.target.value)}
              className="w-full px-4 py-3 border border-border  bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300"
            >
              {watch("emirate") && (
                <option value={watch("emirate")}>{watch("emirate")}</option>
              )}
            </select>

            {errors.emirate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.emirate.message}
              </p>
            )}
          </div>

          <Input
            className="bg-transparent placeholder-foreground"
            placeholder="123456"
            label="Postal Code (Optional)"
            {...register("postalCode")}
          />
        </div>

        {/* Delivery Options */}
        <div>
          <label className="block text-sm font-medium text-foreground  mb-4">
            Delivery Options
          </label>
          <div className="space-y-3">
            <label className="flex items-center group p-4 border-2 border-border  rounded-xl cursor-pointer hover:bg-primary hover:border-border transition-all duration-300">
              <input
                type="radio"
                value="STANDARD"
                {...register("deliveryType")}
                className="mr-3 text-primary  focus:ring-ring"
              />
              <div className="flex-1">
                <div className="font-medium text-foreground group-hover:text-foreground">
                  Standard Delivery
                </div>
                <div className="text-sm text-muted-foreground group-hover:text-foreground">
                  Next day delivery across UAE •{" "}
                  {freeShippingThreshold !== null && subtotal >= freeShippingThreshold ? "Free" : `AED ${deliveryFlatRate}`}
                </div>
              </div>
            </label>

            <label className="flex items-center group p-4 border-2 border-border  rounded-xl cursor-pointer hover:bg-primary hover:border-border transition-all duration-300">
              <input
                type="radio"
                value="EXPRESS"
                {...register("deliveryType")}
                className="mr-3 text-primary  focus:ring-ring"
              />
              <div className="flex-1">
                <div className="font-medium text-foreground  flex items-center group-hover:text-foreground">
                  Same Day Delivery
                  <span className="ml-2 px-2 py-1 bg-primary text-foreground group-hover:bg-secondary text-xs rounded-full">
                    Popular
                  </span>
                </div>
                <div className="text-sm text-muted-foreground group-hover:text-foreground">
                  Fresh flowers delivered today in Dubai • AED {expressDeliveryFee}
                </div>
              </div>
            </label>

            <label className="flex group items-center p-4 border-2 border-border  rounded-xl cursor-pointer hover:bg-primary hover:border-border transition-all duration-300">
              <input
                type="radio"
                value="SCHEDULED"
                {...register("deliveryType")}
                className="mr-3 text-primary  focus:ring-ring"
              />
              <div className="flex-1">
                <div className="font-medium text-foreground group-hover:text-foreground">
                  Scheduled Delivery
                </div>
                <div className="text-sm text-muted-foreground group-hover:text-foreground">
                  Perfect timing for special occasions • AED {scheduledDeliveryFee}
                </div>
              </div>
            </label>
          </div>
        </div>

        {deliveryType === "SCHEDULED" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 p-4 bg-background rounded-xl">
            <Input
              label="Preferred Date"
              className="bg-background"
              type="date"
              {...register("deliveryDate")}
            />
            <div>
              <label className="block text-sm font-medium text-foreground  mb-2">
                Preferred Time
              </label>
              <select
                {...register("deliveryTime")}
                className="w-full px-4 py-3 border border-border bg-background text-foreground  rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                <option value="">Select Time</option>
                <option value="morning">Morning (9AM - 12PM)</option>
                <option value="afternoon">Afternoon (12PM - 5PM)</option>
                <option value="evening">Evening (5PM - 8PM)</option>
              </select>
            </div>
          </div>
        )}


        {isGiftCardEnabled && (
          <div className="p-4 border-2 border-primary/20 bg-primary/5 rounded-xl">
            <h3 className="font-medium text-foreground flex items-center mb-3">
              <span className="mr-2">🎁</span> Gift Options
            </h3>
            <label className="flex items-center cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  {...register("hasGiftCard")}
                  className="w-5 h-5 rounded border-2 border-border text-primary focus:ring-primary transition-all duration-300"
                />
              </div>
              <div className="ml-3">
                <span className="text-sm font-medium text-foreground">
                  Include Gift Card and Special Packaging
                </span>
                <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  Add a beautiful gift card and premium packaging for just AED {giftCardFeeAmount}
                </p>
              </div>
            </label>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground  mb-2">
            Special Instructions (Optional)
          </label>
          <textarea
            {...register("specialInstructions")}
            rows={3}
            className="w-full px-4 py-3 border bg-transparent text-foreground border-border  rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300"
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
    </CheckoutStep >
  );
}
