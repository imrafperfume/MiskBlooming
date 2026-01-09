
import "dotenv/config";
import { prisma } from "../src/lib/db";

async function main() {
    console.log("Connecting to database using lib/db...");
    const settings = await prisma.storeSettings.findFirst();
    console.log("Current settings:", settings);

    if (settings) {
        const updated = await prisma.storeSettings.update({
            where: { id: settings.id },
            data: { isGiftCardEnabled: true, giftCardFee: 5.00 } as any,
        });
        console.log("Gift Card feature enabled:", updated);
    } else {
        // Create if not exists
        const created = await prisma.storeSettings.create({
            data: {
                storeName: "MiskBlooming",
                supportEmail: "test@example.com",
                phoneNumber: "1234567890",
                address: "Test Address",
                isGiftCardEnabled: true,
                giftCardFee: 5.00,
                currency: "AED",
                timezone: "GST",
                vatRate: 5.0,
                deliveryMethod: "flat",
                deliveryFlatRate: 15.0,
                codFee: 10.0,
                isExpressEnabled: false,
                expressDeliveryFee: 30.0,
                isScheduledEnabled: false,
                scheduledDeliveryFee: 0.0,
                deliveryEmirates: {}
            } as any
        })
        console.log("Created settings with Gift Card enabled:", created);
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        // await prisma.$disconnect(); // lib/db handles this usually?
    });
