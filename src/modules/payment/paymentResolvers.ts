import { prisma } from "@/src/lib/db";
import { isAdmin } from "@/src/lib/isAdmin";
import { redis } from "@/src/lib/redis";
import { gql } from "@apollo/client";

export const paymentResolvers = {
  Query: {
    getPaymentSettings: async (
      _parent: any,
      _args: any,
      context: { userId: string }
    ) => {
      const { userId } = context;
      if (!userId) throw new Error("user ID not found");
      // const role = await isAdmin(userId);
      // if (role.role !== "ADMIN") throw new Error("Not authorized");
      try {
        const cache = await redis.get("paymentSettings");
        if (cache) {
          return cache;
        }
        const paymentSettings = await prisma.paymentSetting.findFirst();
        await redis.set("paymentSettings", JSON.stringify(paymentSettings));
        return paymentSettings;
      } catch (error) {
        throw new Error("Failed to fetch payment settings");
      }
    },
  },
  Mutation: {
    updatePaymentSettings: async (
      _: any,
      args: { stripeEnabled: boolean; codEnabled: boolean },
      context: any
    ) => {
      try {
        let paymentSettings = await prisma.paymentSetting.findFirst();
        if (!paymentSettings) {
          paymentSettings = await prisma.paymentSetting.create({
            data: {
              stripeEnabled: args.stripeEnabled,
              codEnabled: args.codEnabled,
            },
          });
          await redis.del("paymentSettings");
        } else {
          paymentSettings = await prisma.paymentSetting.update({
            where: { id: paymentSettings.id },
            data: {
              stripeEnabled: args.stripeEnabled,
              codEnabled: args.codEnabled,
            },
          });
        }
        // Update cache
        await redis.del("paymentSettings");

        return paymentSettings;
      } catch (error) {
        throw new Error("Failed to update payment settings");
      }
    },
  },
};
