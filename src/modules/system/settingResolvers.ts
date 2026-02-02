import { prisma } from "@/src/lib/db";
import { validateAdmin } from "@/src/lib/isAdmin";
import { redis } from "@/src/lib/redis";
import { StoreSettings, DeliveryMethod } from "@prisma/client";

// Helper: Convert Prisma Decimals to Javascript Numbers for GraphQL & JSON
const formatSettings = (settings: StoreSettings) => {
  return {
    ...settings,
    // Existing fields
    vatRate: Number(settings.vatRate),
    deliveryFlatRate: Number(settings.deliveryFlatRate),
    freeShippingThreshold: settings.freeShippingThreshold
      ? Number(settings.freeShippingThreshold)
      : null,

    // --- NEW FIELDS (Decimal conversion) ---
    codFee: Number(settings.codFee || 0),
    expressDeliveryFee: Number(settings.expressDeliveryFee || 0),
    scheduledDeliveryFee: Number(settings.scheduledDeliveryFee || 0),
    giftCardFee: Number(settings.giftCardFee || 5.0),
    isGiftCardEnabled: settings.isGiftCardEnabled ?? false,
  };
};

interface DeliveryEmiratesInput {
  abu_dhabi: number;
  dubai: number;
  sharjah: number;
  ajman: number;
  umm_al_quwain: number;
  ras_al_khaimah: number;
  fujairah: number;
  [key: string]: number;
}

interface UpdateStoreSettingsInput {
  storeName?: string;
  description?: string;
  logoUrl?: string;
  supportEmail?: string;
  phoneNumber?: string;
  currency?: string;
  timezone?: string;
  address?: string;
  vatRate?: number;
  deliveryMethod?: DeliveryMethod;
  deliveryFlatRate?: number;
  freeShippingThreshold?: number;
  deliveryEmirates?: DeliveryEmiratesInput;
  codFee?: number;
  isExpressEnabled?: boolean;
  expressDeliveryFee?: number;
  isScheduledEnabled?: boolean;
  scheduledDeliveryFee?: number;
  isGiftCardEnabled?: boolean;
  giftCardFee?: number;
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

const CACHE_KEY = "store_settings";

export const SettingResolvers = {
  Query: {
    getStoreSettings: async (_: unknown, __: unknown, context: { userId: string }) => {
      // 1. Security Check - Public route now
      // await validateAdmin(context.userId);

      try {
        // 2. Check Redis Cache
        const cachedData = await redis.get(CACHE_KEY);
        if (cachedData) {
          return cachedData;
        }

        // 3. Fetch from DB
        const settings = await prisma.storeSettings.findFirst();

        if (!settings) {
          return null;
        }

        // 4. Format Data
        const formattedSettings = formatSettings(settings);

        // 5. Write to Redis
        await redis.set(CACHE_KEY, JSON.stringify(formattedSettings), {
          ex: 3600,
        });

        return formattedSettings;
      } catch (error) {
        console.error("Error fetching store settings:", error);
        throw new Error("Unable to load store settings. Please try again.");
      }
    },
  },

  Mutation: {
    // UPSERT Logic (Update if exists, Create if not)
    updateStoreSettings: async (
      _: unknown,
      args: { input: UpdateStoreSettingsInput },
      context: { userId: string } // Standardized to userId
    ) => {
      await validateAdmin(context.userId);

      try {
        const existingSettings = await prisma.storeSettings.findFirst();
        console.log("🚀 ~ existingSettings:", existingSettings);

        let updatedSettings;

        const dataPayload = {
          storeName: args.input.storeName,
          description: args.input.description,
          logoUrl: args.input.logoUrl,
          supportEmail: args.input.supportEmail,
          phoneNumber: args.input.phoneNumber,
          currency: args.input.currency,
          timezone: args.input.timezone,
          address: args.input.address,
          vatRate: args.input.vatRate,

          // Delivery Logic
          deliveryMethod: args.input.deliveryMethod,
          deliveryFlatRate: args.input.deliveryFlatRate,
          freeShippingThreshold: args.input.freeShippingThreshold,
          deliveryEmirates: args.input.deliveryEmirates,

          // New Fields
          codFee: args.input.codFee,
          isExpressEnabled: args.input.isExpressEnabled,
          expressDeliveryFee: args.input.expressDeliveryFee,
          isScheduledEnabled: args.input.isScheduledEnabled,
          scheduledDeliveryFee: args.input.scheduledDeliveryFee,
          facebook: args.input.facebook,
          instagram: args.input.instagram,
          twitter: args.input.twitter,
          isGiftCardEnabled: args.input.isGiftCardEnabled,
          giftCardFee: args.input.giftCardFee,
        };

        if (existingSettings) {
          // UPDATE
          updatedSettings = await prisma.storeSettings.update({
            where: { id: existingSettings.id },
            data: dataPayload,
          });
        } else {
          // CREATE (Fallback if no ID exists)
          updatedSettings = await prisma.storeSettings.create({
            data: {
              ...dataPayload,
              storeName: args.input.storeName || "",
              supportEmail: args.input.supportEmail || "",
              phoneNumber: args.input.phoneNumber || "",
              address: args.input.address || "",
              currency: args.input.currency || "AED",
            },
          });
        }

        const formattedResult = formatSettings(updatedSettings);

        // Update Cache
        await redis.set(CACHE_KEY, JSON.stringify(formattedResult), {
          ex: 3600,
        });

        return formattedResult;
      } catch (error: any) {
        console.error("Error saving store settings:", error);
        throw new Error(`Failed to save settings: ${error.message}`);
      }
    },

    // Strict Create (Throws if exists)
    createStoreSettings: async (
      _: unknown,
      args: { input: UpdateStoreSettingsInput },
      context: { userId: string }
    ) => {
      await validateAdmin(context.userId);

      try {
        const existingStore = await prisma.storeSettings.findFirst();

        if (existingStore) {
          throw new Error(
            "A store configuration already exists. Please use updateStoreSettings."
          );
        }

        const newStore = await prisma.storeSettings.create({
          data: {
            storeName: args.input.storeName || "",
            description: args.input.description,
            logoUrl: args.input.logoUrl,
            supportEmail: args.input.supportEmail || "",
            phoneNumber: args.input.phoneNumber || "",
            currency: args.input.currency || "AED",
            timezone: args.input.timezone || "GST",
            address: args.input.address || "",
            vatRate: args.input.vatRate,

            // Delivery
            deliveryMethod: args.input.deliveryMethod,
            deliveryFlatRate: args.input.deliveryFlatRate,
            freeShippingThreshold: args.input.freeShippingThreshold,
            deliveryEmirates: args.input.deliveryEmirates,

            // New Fields
            codFee: args.input.codFee,
            isExpressEnabled: args.input.isExpressEnabled,
            expressDeliveryFee: args.input.expressDeliveryFee,
            isScheduledEnabled: args.input.isScheduledEnabled,
            scheduledDeliveryFee: args.input.scheduledDeliveryFee,
            facebook: args.input.facebook,
            instagram: args.input.instagram,
            twitter: args.input.twitter,
            isGiftCardEnabled: args.input.isGiftCardEnabled,
            giftCardFee: args.input.giftCardFee,
          },
        });

        const formattedResult = formatSettings(newStore);

        await redis.set(CACHE_KEY, JSON.stringify(formattedResult), {
          ex: 3600,
        });

        return formattedResult;
      } catch (error: any) {
        console.error("Error creating store:", error);
        throw new Error(error.message || "Failed to create store.");
      }
    },
  },
};
