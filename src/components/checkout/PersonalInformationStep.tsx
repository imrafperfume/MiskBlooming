"use client";

import { User } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CheckoutStep } from "./CheckoutStep";
import type { CheckoutFormData } from "../../types/checkout";

interface PersonalInformationStepProps {
  form: UseFormReturn<CheckoutFormData>;
  onNext: () => void;
}

export function PersonalInformationStep({
  form,
  onNext,
}: PersonalInformationStepProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <CheckoutStep>
      <div className="flex items-center mb-6">
        <User className="w-5 h-5 lg:w-6 lg:h-6 text-primary  mr-3" />
        <h2 className="font-cormorant text-xl lg:text-2xl font-bold text-foreground ">
          Personal Information
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <Input
          className="bg-transparent placeholder-foreground"
          placeholder="Jhon"
          label="First Name"
          {...register("firstName")}
          error={errors.firstName?.message}
        />
        <Input
          className="bg-transparent placeholder-foreground"
          placeholder="Dowe"
          label="Last Name"
          {...register("lastName")}
          error={errors.lastName?.message}
        />
        <Input
          className="bg-transparent placeholder-foreground"
          placeholder="Jhon@gmail.com"
          label="Email Address"
          type="email"
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          className="bg-transparent placeholder-foreground"
          label="Phone Number"
          {...register("phone")}
          placeholder="+971 50 123 4567"
          error={errors.phone?.message}
        />
      </div>

      <div className="mt-6 flex justify-end">
        <Button type="button" variant="luxury" onClick={onNext}>
          Continue to Shipping
        </Button>
      </div>
    </CheckoutStep>
  );
}
