"use client";

import React from "react";
import * as Switch from "@radix-ui/react-switch";
import Loading from "@/src/components/layout/Loading";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_PAYMENT_SETTINGS,
  UPDATE_PAYMENT_SETTINGS,
} from "@/src/modules/payment/operation";
import { toast } from "sonner";
import {
  CreditCard,
  Wallet,
  Settings2,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function AdminToggles() {
  const { data: paymentsData, error, loading } = useQuery(GET_PAYMENT_SETTINGS);
  const payments = paymentsData?.getPaymentSettings;

  const [updatePaymentSettings, { loading: updateLoading }] = useMutation(
    UPDATE_PAYMENT_SETTINGS,
    {
      refetchQueries: [{ query: GET_PAYMENT_SETTINGS }],
      onError: (err) => {
        toast.error(err.message || "Failed to update settings");
      },
      onCompleted: () => {
        toast.success("Payment settings updated successfully");
      },
    }
  );

  async function updateSetting(
    key: "stripeEnabled" | "codEnabled",
    value: boolean
  ) {
    // Optimistic UI update could be added here,
    // but we rely on the mutation callback for now
    updatePaymentSettings({
      variables: {
        stripeEnabled:
          key === "stripeEnabled" ? value : payments?.stripeEnabled,
        codEnabled: key === "codEnabled" ? value : payments?.codEnabled,
      },
    });
  }

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
        <AlertCircle size={16} />
        {error.message}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Settings2 className="w-6 h-6 text-primary" />
          Payment Configuration
        </h2>
        <p className="text-muted-foreground mt-1">
          Manage accepted payment methods for your checkout process.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Stripe Setting */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-muted/20">
          <div className="flex gap-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg h-fit border border-blue-100">
              <CreditCard size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-medium text-foreground">
                Stripe Payments
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                Allow customers to pay securely using credit/debit cards via
                Stripe.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {updateLoading && (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            )}
            <Switch.Root
              className="w-11 h-6 bg-input rounded-full relative shadow-inner focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=checked]:bg-primary transition-colors duration-200 cursor-pointer"
              checked={payments?.stripeEnabled}
              onCheckedChange={(val) => updateSetting("stripeEnabled", val)}
              disabled={updateLoading}
            >
              <Switch.Thumb className="block w-5 h-5 bg-background rounded-full shadow-md transition-transform duration-200 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
            </Switch.Root>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-border mx-auto" />

        {/* COD Setting */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-muted/20">
          <div className="flex gap-4">
            <div className="p-2.5 bg-green-50 text-green-600 rounded-lg h-fit border border-green-100">
              <Wallet size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-medium text-foreground">
                Cash on Delivery (COD)
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                Enable customers to pay with cash upon receiving their order.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {updateLoading && (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            )}
            <Switch.Root
              className="w-11 h-6 bg-input rounded-full relative shadow-inner focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=checked]:bg-primary transition-colors duration-200 cursor-pointer"
              checked={payments?.codEnabled}
              onCheckedChange={(val) => updateSetting("codEnabled", val)}
              disabled={updateLoading}
            >
              <Switch.Thumb className="block w-5 h-5 bg-background rounded-full shadow-md transition-transform duration-200 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
            </Switch.Root>
          </div>
        </div>
      </div>

      {/* Footer / Helper Text */}
      <p className="text-xs text-muted-foreground mt-4 text-center px-4">
        Changes are saved immediately. Ensure your API keys are configured in
        environment variables before enabling gateways.
      </p>
    </div>
  );
}
