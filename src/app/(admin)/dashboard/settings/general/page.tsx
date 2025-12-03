"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Store,
  Upload,
  Mail,
  Globe,
  MapPin,
  Save,
  AlertCircle,
  Loader2,
  Trash2,
  Image as ImageIcon,
  Percent,
  Truck,
  Map,
  PackageOpen,
  Zap,
  CalendarClock,
  Banknote,
} from "lucide-react";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/src/lib/cloudinary";
import {
  GET_STORE_SETTINGS,
  UPDATE_STORE_SETTINGS,
} from "@/src/modules/system/opration";
import { useMutation, useQuery } from "@apollo/client";

// --- Types ---
type DeliveryMethod = "flat" | "emirate";

interface StoreSettingsFormData {
  storeName: string;
  description: string;
  logoUrl: string;
  supportEmail: string;
  phoneNumber: string;
  currency: string;
  timezone: string;
  address: string;
  vatRate: number;

  // Delivery Core
  deliveryMethod: DeliveryMethod;
  deliveryFlatRate: number; // Used for Standard Flat
  deliveryEmirates: {
    abu_dhabi: number;
    dubai: number;
    sharjah: number;
    ajman: number;
    umm_al_quwain: number;
    ras_al_khaimah: number;
    fujairah: number;
  };

  // New Features
  codFee: number;
  freeShippingThreshold: number | null;

  // Express
  isExpressEnabled: boolean;
  expressDeliveryFee: number;

  // Scheduled
  isScheduledEnabled: boolean;
  scheduledDeliveryFee: number;
}

const UAE_EMIRATES = [
  { key: "abu_dhabi", label: "Abu Dhabi" },
  { key: "dubai", label: "Dubai" },
  { key: "sharjah", label: "Sharjah" },
  { key: "ajman", label: "Ajman" },
  { key: "umm_al_quwain", label: "Umm Al Quwain" },
  { key: "ras_al_khaimah", label: "Ras Al Khaimah" },
  { key: "fujairah", label: "Fujairah" },
] as const;

export default function StoreSettingsForm() {
  const [isUploading, setIsUploading] = useState(false);

  // 1. Form Setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<StoreSettingsFormData>({
    mode: "onChange",
    defaultValues: {
      storeName: "",
      description: "",
      supportEmail: "",
      phoneNumber: "",
      currency: "AED",
      timezone: "GST",
      address: "",
      logoUrl: "",
      vatRate: 5,
      deliveryMethod: "flat",
      deliveryFlatRate: 15.0,
      deliveryEmirates: {
        abu_dhabi: 20,
        dubai: 15,
        sharjah: 15,
        ajman: 20,
        umm_al_quwain: 25,
        ras_al_khaimah: 25,
        fujairah: 30,
      },
      // New Defaults
      codFee: 10,
      freeShippingThreshold: 200,
      isExpressEnabled: false,
      expressDeliveryFee: 30,
      isScheduledEnabled: false,
      scheduledDeliveryFee: 0,
    },
  });

  // 2. Data Fetching
  const { data, loading: isLoadingData } = useQuery(GET_STORE_SETTINGS, {
    fetchPolicy: "network-only",
    onCompleted: (fetchedData) => {
      if (fetchedData?.getStoreSettings) {
        const s = fetchedData.getStoreSettings;

        // Clean and Populate Form
        reset({
          storeName: s.storeName,
          description: s.description,
          logoUrl: s.logoUrl,
          supportEmail: s.supportEmail,
          phoneNumber: s.phoneNumber,
          currency: s.currency,
          timezone: s.timezone,
          address: s.address,
          vatRate: s.vatRate,
          deliveryMethod: s.deliveryMethod,
          deliveryFlatRate: s.deliveryFlatRate,
          freeShippingThreshold: s.freeShippingThreshold,
          codFee: s.codFee,
          isExpressEnabled: s.isExpressEnabled,
          expressDeliveryFee: s.expressDeliveryFee,
          isScheduledEnabled: s.isScheduledEnabled,
          scheduledDeliveryFee: s.scheduledDeliveryFee,
          deliveryEmirates: {
            abu_dhabi: s.deliveryEmirates.abu_dhabi,
            dubai: s.deliveryEmirates.dubai,
            sharjah: s.deliveryEmirates.sharjah,
            ajman: s.deliveryEmirates.ajman,
            umm_al_quwain: s.deliveryEmirates.umm_al_quwain,
            ras_al_khaimah: s.deliveryEmirates.ras_al_khaimah,
            fujairah: s.deliveryEmirates.fujairah,
          },
        });
      }
    },
  });

  const [updateStoreSettings] = useMutation(UPDATE_STORE_SETTINGS, {
    refetchQueries: [{ query: GET_STORE_SETTINGS }],
  });

  // 3. Watchers
  const currentLogoUrl = watch("logoUrl");
  const currentCurrency = watch("currency");
  const deliveryMethod = watch("deliveryMethod");
  const isExpress = watch("isExpressEnabled");
  const isScheduled = watch("isScheduledEnabled");

  // 4. Handlers
  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Max 5MB allowed.");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only .jpg, .png, and .webp formats are allowed.");
      return;
    }

    try {
      setIsUploading(true);
      const result = await uploadToCloudinary(file, {
        folder: "store/logos",
        tags: ["logo"],
      });
      setValue("logoUrl", result.secure_url, { shouldDirty: true });
      toast.success("Logo uploaded");
    } catch (error: any) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  const handleRemoveLogo = () => {
    setValue("logoUrl", "", { shouldDirty: true });
    toast.info("Logo removed");
  };

  const onSubmit: SubmitHandler<StoreSettingsFormData> = async (formData) => {
    const toastId = toast.loading("Saving configuration...");

    try {
      // Sanitize Numbers
      const payload = {
        ...formData,
        vatRate: Number(formData.vatRate),
        deliveryFlatRate: Number(formData.deliveryFlatRate),
        codFee: Number(formData.codFee),
        expressDeliveryFee: Number(formData.expressDeliveryFee),
        scheduledDeliveryFee: Number(formData.scheduledDeliveryFee),
        freeShippingThreshold: formData.freeShippingThreshold
          ? Number(formData.freeShippingThreshold)
          : null,
        deliveryEmirates: {
          abu_dhabi: Number(formData.deliveryEmirates.abu_dhabi),
          dubai: Number(formData.deliveryEmirates.dubai),
          sharjah: Number(formData.deliveryEmirates.sharjah),
          ajman: Number(formData.deliveryEmirates.ajman),
          umm_al_quwain: Number(formData.deliveryEmirates.umm_al_quwain),
          ras_al_khaimah: Number(formData.deliveryEmirates.ras_al_khaimah),
          fujairah: Number(formData.deliveryEmirates.fujairah),
        },
      };

      // Remove GraphQL specific fields if any (like __typename)
      delete (payload as any).__typename;

      const { data } = await updateStoreSettings({
        variables: { input: payload },
      });

      if (data?.updateStoreSettings) {
        toast.success("Store settings updated!", { id: toastId });
        reset(payload); // Reset dirty state
      }
    } catch (error: any) {
      console.error("Save Error:", error);
      toast.error("Failed to save. Please try again.", { id: toastId });
    }
  };

  // Loading State
  if (isLoadingData && !data) {
    return (
      <div className="max-w-4xl mx-auto p-12 bg-card rounded-xl border border-border shadow-sm flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse">
          Loading configuration...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto p-6 bg-card rounded-xl border border-border shadow-sm text-card-foreground transition-all space-y-8"
    >
      {/* --- Section 1: Store Profile --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-1">
          <h3 className="text-base font-semibold flex items-center gap-2 text-foreground">
            <Store className="w-4 h-4 text-primary" />
            Store Profile
          </h3>
          <p className="text-sm text-muted-foreground">
            Identity and branding.
          </p>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="grid gap-2">
            <label
              htmlFor="storeName"
              className="text-sm font-medium leading-none"
            >
              Store Name
            </label>
            <input
              id="storeName"
              disabled={isSubmitting}
              type="text"
              {...register("storeName", { required: "Required", minLength: 2 })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
              placeholder="e.g. Dubai Luxury Store"
            />
            {errors.storeName && (
              <span className="text-xs text-destructive">
                {errors.storeName.message}
              </span>
            )}
          </div>

          <div className="grid gap-2">
            <span className="text-sm font-medium leading-none">Store Logo</span>
            <div className="flex items-start sm:items-center gap-5">
              <div className="relative shrink-0 h-20 w-20 rounded-lg border border-input bg-muted/30 flex items-center justify-center overflow-hidden">
                {isUploading ? (
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                ) : currentLogoUrl ? (
                  <img
                    src={currentLogoUrl}
                    alt="Logo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                )}
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <label
                    className={`cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent h-9 px-4 shadow-sm ${
                      isUploading ? "opacity-50" : ""
                    }`}
                  >
                    <Upload className="w-4 h-4 mr-2" /> Upload
                    <input
                      type="file"
                      className="sr-only"
                      disabled={isUploading}
                      onChange={onUpload}
                      accept="image/*"
                    />
                  </label>
                  {currentLogoUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-destructive/10 text-destructive h-9 px-3"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Remove
                    </button>
                  )}
                </div>
                <p className="text-[13px] text-muted-foreground">
                  Recommended: 512x512px. Max 5MB.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="desc" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="desc"
              {...register("description")}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 disabled:opacity-50"
              placeholder="About your store..."
            />
          </div>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* --- Section 2: Contact --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-1">
          <h3 className="text-base font-semibold flex items-center gap-2 text-foreground">
            <Mail className="w-4 h-4 text-primary" />
            Contact Info
          </h3>
          <p className="text-sm text-muted-foreground">For customer support.</p>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Support Email
            </label>
            <input
              id="email"
              type="email"
              {...register("supportEmail", { required: "Required" })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 disabled:opacity-50"
              placeholder="support@example.com"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              {...register("phoneNumber")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 disabled:opacity-50"
              placeholder="+971 50 000 0000"
            />
          </div>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* --- Section 3: Regional & Settings --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-1">
          <h3 className="text-base font-semibold flex items-center gap-2 text-foreground">
            <Globe className="w-4 h-4 text-primary" />
            Regional
          </h3>
          <p className="text-sm text-muted-foreground">
            Location and Tax settings.
          </p>
        </div>
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Currency</label>
              <select
                {...register("currency")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2"
              >
                <option value="AED">AED</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Timezone</label>
              <select
                {...register("timezone")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2"
              >
                <option value="GST">GST (GMT+4)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">VAT (%)</label>
              <div className="relative">
                <Percent className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="number"
                  step="0.01"
                  {...register("vatRate", { valueAsNumber: true, min: 0 })}
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus-visible:ring-2"
                />
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Physical Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                {...register("address", { required: true })}
                className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus-visible:ring-2"
                placeholder="Warehouse address..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* --- Section 4: Delivery Configuration (New) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 sm:mb-0">
        <div className="space-y-1">
          <h3 className="text-base font-semibold flex items-center gap-2 text-foreground">
            <Truck className="w-4 h-4 text-primary" />
            Delivery Options
          </h3>
          <p className="text-sm text-muted-foreground">
            Configure standard, express, and scheduled delivery methods.
          </p>
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* 1. Global Delivery Settings */}
          <div className="grid sm:grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg border border-border">
            {/* COD Fee */}
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Banknote className="w-4 h-4 text-muted-foreground" />
                <label className="text-sm font-medium">COD Fee</label>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-muted-foreground">
                  {currentCurrency}
                </span>
                <input
                  type="number"
                  {...register("codFee", { valueAsNumber: true, min: 0 })}
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-12 pr-3 py-2 text-sm focus-visible:ring-2"
                />
              </div>
            </div>

            {/* Free Shipping */}
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <PackageOpen className="w-4 h-4 text-muted-foreground" />
                <label className="text-sm font-medium">
                  Free Shipping Over
                </label>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-muted-foreground">
                  {currentCurrency}
                </span>
                <input
                  type="number"
                  {...register("freeShippingThreshold", {
                    valueAsNumber: true,
                    min: 0,
                  })}
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-12 pr-3 py-2 text-sm focus-visible:ring-2"
                  placeholder="Disabled"
                />
              </div>
            </div>
          </div>

          {/* 2. Standard Delivery (Primary) */}
          <div className="space-y-4 border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Truck className="w-4 h-4" /> Standard Delivery
              </h4>
              {/* Method Switcher */}
              <div className="flex bg-muted rounded-md p-1">
                <label
                  className={`px-3 py-1 text-xs font-medium rounded-sm cursor-pointer transition-all ${
                    deliveryMethod === "flat"
                      ? "bg-background shadow text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <input
                    type="radio"
                    value="flat"
                    {...register("deliveryMethod")}
                    className="sr-only"
                  />{" "}
                  Flat Rate
                </label>
                <label
                  className={`px-3 py-1 text-xs font-medium rounded-sm cursor-pointer transition-all ${
                    deliveryMethod === "emirate"
                      ? "bg-background shadow text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <input
                    type="radio"
                    value="emirate"
                    {...register("deliveryMethod")}
                    className="sr-only"
                  />{" "}
                  Emirate Based
                </label>
              </div>
            </div>

            {deliveryMethod === "flat" ? (
              <div className="grid gap-2 animate-in fade-in zoom-in-95 duration-200">
                <label className="text-xs text-muted-foreground">
                  Standard Flat Fee
                </label>
                <div className="relative max-w-[200px]">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-muted-foreground">
                    {currentCurrency}
                  </span>
                  <input
                    type="number"
                    {...register("deliveryFlatRate", {
                      valueAsNumber: true,
                      min: 0,
                    })}
                    className="flex h-10 w-full rounded-md border border-input bg-background pl-12 pr-3 py-2 text-sm focus-visible:ring-2"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-in fade-in zoom-in-95 duration-200">
                {UAE_EMIRATES.map((e) => (
                  <div key={e.key} className="grid gap-1">
                    <label className="text-[11px] font-medium text-muted-foreground uppercase">
                      {e.label}
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-1.5 text-[10px] font-bold text-muted-foreground">
                        {currentCurrency}
                      </span>
                      <input
                        type="number"
                        {...register(
                          `deliveryEmirates.${e.key}` as
                            | "deliveryEmirates.abu_dhabi"
                            | "deliveryEmirates.dubai"
                            | "deliveryEmirates.sharjah"
                            | "deliveryEmirates.ajman"
                            | "deliveryEmirates.umm_al_quwain"
                            | "deliveryEmirates.ras_al_khaimah"
                            | "deliveryEmirates.fujairah",
                          {
                            valueAsNumber: true,
                            min: 0,
                          }
                        )}
                        className="flex h-8 w-full rounded-md border border-input bg-background pl-9 pr-2 text-xs focus-visible:ring-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Express Delivery */}
          <div
            className={`space-y-4 border rounded-lg p-4 transition-colors ${
              isExpress ? "border-primary/50 bg-primary/5" : "border-border"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap
                  className={`w-4 h-4 ${
                    isExpress ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <label
                  htmlFor="enableExpress"
                  className="text-sm font-semibold cursor-pointer"
                >
                  Express Delivery
                </label>
              </div>
              <input
                id="enableExpress"
                type="checkbox"
                {...register("isExpressEnabled")}
                className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
              />
            </div>

            {isExpress && (
              <div className="grid gap-2 animate-in slide-in-from-top-2 duration-200">
                <label className="text-xs text-muted-foreground">
                  Express Fee
                </label>
                <div className="relative max-w-[200px]">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-muted-foreground">
                    {currentCurrency}
                  </span>
                  <input
                    type="number"
                    {...register("expressDeliveryFee", {
                      valueAsNumber: true,
                      min: 0,
                    })}
                    className="flex h-10 w-full rounded-md border border-input bg-background pl-12 pr-3 py-2 text-sm focus-visible:ring-2"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 4. Scheduled Delivery */}
          <div
            className={`space-y-4 border rounded-lg p-4 transition-colors ${
              isScheduled ? "border-primary/50 bg-primary/5" : "border-border"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarClock
                  className={`w-4 h-4 ${
                    isScheduled ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <label
                  htmlFor="enableSchedule"
                  className="text-sm font-semibold cursor-pointer"
                >
                  Scheduled Delivery
                </label>
              </div>
              <input
                id="enableSchedule"
                type="checkbox"
                {...register("isScheduledEnabled")}
                className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
              />
            </div>

            {isScheduled && (
              <div className="grid gap-2 animate-in slide-in-from-top-2 duration-200">
                <label className="text-xs text-muted-foreground">
                  Scheduled Fee (Usually 0 if complimentary)
                </label>
                <div className="relative max-w-[200px]">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-muted-foreground">
                    {currentCurrency}
                  </span>
                  <input
                    type="number"
                    {...register("scheduledDeliveryFee", {
                      valueAsNumber: true,
                      min: 0,
                    })}
                    className="flex h-10 w-full rounded-md border border-input bg-background pl-12 pr-3 py-2 text-sm focus-visible:ring-2"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Save Action */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
