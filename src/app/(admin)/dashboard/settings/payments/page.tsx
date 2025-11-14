"use client";

import React, { useEffect, useState } from "react";
import * as Switch from "@radix-ui/react-switch";
import Loading from "@/src/components/layout/Loading";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_PAYMENT_SETTINGS,
  UPDATE_PAYMENT_SETTINGS,
} from "@/src/modules/payment/operation";
import { toast } from "sonner";

// AdminToggles — Radix UI Switch + Tailwind
// - Install: npm i @radix-ui/react-switch
// - Tailwind required for styles (classes used below)

export default function AdminToggles() {
  const { data: paymentsData, error, loading } = useQuery(GET_PAYMENT_SETTINGS);
  const payments = paymentsData?.getPaymentSettings;

  const [
    updatePaymentSettings,
    { data, loading: updateLoading, error: updateError },
  ] = useMutation(UPDATE_PAYMENT_SETTINGS, {
    refetchQueries: [{ query: GET_PAYMENT_SETTINGS }],
  });
  console.log("🚀 ~ AdminToggles ~ data:", data);

  async function updateSetting(key: any, value: any) {
    try {
      updatePaymentSettings({
        variables: {
          stripeEnabled:
            key === "stripeEnabled" ? value : payments.stripeEnabled,
          codEnabled: key === "codEnabled" ? value : payments.codEnabled,
        },
      });
      toast.success("Payment settings updated.");
    } catch (error) {
      toast.error("Failed to update payment settings.");
    }
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-md p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Payment Setting</h2>

      {error && (
        <div className="mb-4 text-sm text-red-600">{error.message}</div>
      )}

      <div className="flex items-center justify-between py-3">
        <div>
          <div className="text-sm font-medium">Stripe Enabled</div>
          <div className="text-xs text-gray-500">
            Enable Stripe payment gateway.
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Switch.Root
            className={`w-11 h-6 rounded-full relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-luxury-500 transition-all ${
              payments.stripeEnabled ? "bg-luxury-600" : "bg-gray-400"
            }`}
            checked={payments.stripeEnabled}
            onCheckedChange={(val) => updateSetting("stripeEnabled", val)}
            aria-label="Toggle Stripe"
          >
            <span
              className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform absolute top-0.5 left-0.5 ${
                payments.stripeEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </Switch.Root>
        </div>
      </div>

      <div className="border-t my-3" />

      <div className="flex items-center justify-between py-3">
        <div>
          <div className="text-sm font-medium">COD Enabled</div>
          <div className="text-xs text-gray-500">
            Cash on Delivery option for orders.
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Switch.Root
            className={`w-11 h-6 rounded-full relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-luxury-500 transition-all ${
              payments.codEnabled ? "bg-luxury-600" : "bg-gray-400"
            }`}
            checked={payments.codEnabled}
            onCheckedChange={(val) => updateSetting("codEnabled", val)}
            aria-label="Toggle COD"
          >
            <span
              className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform absolute top-0.5 left-0.5 ${
                payments.codEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </Switch.Root>
        </div>
      </div>
    </div>
  );
}
