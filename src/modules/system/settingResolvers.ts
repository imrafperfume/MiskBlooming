import { prisma } from "@/src/lib/db";
import { validateAdmin } from "@/src/lib/isAdmin";
import { redis } from "@/src/lib/redis";
import { StoreSettings } from "@prisma/client";

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
    codFee: Number(settings.codFee),
    expressDeliveryFee: Number(settings.expressDeliveryFee),
    scheduledDeliveryFee: Number(settings.scheduledDeliveryFee),
  };
};

const CACHE_KEY = "store_settings";

export const SettingResolvers = {
  Query: {
    getStoreSettings: async (_: any, __: any, context: { userId: string }) => {
      // 1. Security Check
      await validateAdmin(context.userId);

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
      _: any,
      args: { input: any },
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
            data: dataPayload,
          });
        }

        const formattedResult = formatSettings(updatedSettings);

        // Update Cache
        await redis.set(CACHE_KEY, JSON.stringify(formattedResult), {
          ex: 3600,
        });

        return formattedResult;
      } catch (error) {
        console.error("Error saving store settings:", error);
        throw new Error("Failed to save settings. Please check your inputs.");
      }
    },

    // Strict Create (Throws if exists)
    createStoreSettings: async (
      _: any,
      args: { input: any },
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
            storeName: args.input.storeName,
            description: args.input.description,
            logoUrl: args.input.logoUrl,
            supportEmail: args.input.supportEmail,
            phoneNumber: args.input.phoneNumber,
            currency: args.input.currency,
            timezone: args.input.timezone,
            address: args.input.address,
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
