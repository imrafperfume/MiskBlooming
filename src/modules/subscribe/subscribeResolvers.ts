import { prisma } from "@/src/lib/db";

export const SubscribeResolvers = {
    Query: {
        getSubscriber: async (_: any, __: any, context: any) => {
            return null;
        }
    },
    Mutation: {
        createSubscriber: async (_: any, { input }: { input: { email: string } }) => {
            const { email } = input;

            const existing = await (prisma as any).newsletterSubscriber.findUnique({
                where: { email },
            });

            if (existing) {
                if (!existing.isActive) {
                    const updated = await (prisma as any).newsletterSubscriber.update({
                        where: { email },
                        data: { isActive: true },
                    });
                    return updated;
                }
                return existing;
            }

            const newSubscriber = await (prisma as any).newsletterSubscriber.create({
                data: { email },
            });

            return newSubscriber;
        },

        updateSubscriber: async (_: any, { input }: { input: { email: string } }) => {
            // Find and return to satisfy type
            const sub = await (prisma as any).newsletterSubscriber.findUnique({ where: { email: input.email } });
            if (!sub) throw new Error("Subscriber not found");
            return sub;
        }
    },
};
