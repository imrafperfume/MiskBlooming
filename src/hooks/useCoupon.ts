"use client";

import { useState, useCallback } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { VALIDATE_COUPON } from "@/src/modules/coupon/operations";
import type { Coupon, CouponValidationResult } from "@/src/types/coupon";

export function useCoupon() {
  const [isValidating, setIsValidating] = useState(false);
  const [validateCoupon, { data, loading, error }] =
    useLazyQuery(VALIDATE_COUPON);
  const validateCouponCode = useCallback(
    async (
      code: string,
      orderAmount: number,
      userId?: string,
      email?: string
    ): Promise<CouponValidationResult> => {
      setIsValidating(true);

      try {
        const result = await validateCoupon({
          variables: {
            code: code.toUpperCase(),
            orderAmount,
            userId: userId || null,
            email: email || null,
          },
        });

        const validationResult = result.data?.validateCoupon;

        if (!validationResult) {
          return {
            isValid: false,
            error: "Failed to validate coupon",
          };
        }

        return validationResult;
      } catch (error: any) {
        console.error("Coupon validation error:", error);
        return {
          isValid: false,
          error: error.message || "Failed to validate coupon",
        };
      } finally {
        setIsValidating(false);
      }
    },
    [validateCoupon]
  );

  return {
    validateCouponCode,
    isValidating,
  };
}
