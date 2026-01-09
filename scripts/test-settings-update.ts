import "dotenv/config";
import { prisma } from "../src/lib/db";

async function main() {
    console.log("Attempting to update StoreSettings directly...");
    const settings = await prisma.storeSettings.findFirst();
    if (!settings) {
        console.log("No settings found to update.");
        return;
    }

    try {
        const updated = await prisma.storeSettings.update({
            where: { id: settings.id },
            data: {
                isGiftCardEnabled: true,
                giftCardFee: 7.50
            } as any
        });
        console.log("Update successful via script:", updated);
    } catch (err: any) {
        console.error("Update failed via script:", err.message);
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
