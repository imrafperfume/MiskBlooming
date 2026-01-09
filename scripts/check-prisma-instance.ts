import "dotenv/config";
import { prisma } from "../src/lib/db";

async function main() {
    console.log("Testing application's prisma instance...");

    // Try to use the field
    try {
        const settings = await prisma.storeSettings.findFirst();
        if (!settings) {
            console.log("No settings found.");
            return;
        }

        console.log("Attempting update with isGiftCardEnabled...");
        await prisma.storeSettings.update({
            where: { id: settings.id },
            data: {
                isGiftCardEnabled: true
            } as any
        });
        console.log("SUCCESS: Application's prisma instance is UP TO DATE.");
    } catch (err: any) {
        console.log("FAILURE: Application's prisma instance is STALE.");
        console.error("Error message:", err.message);
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        // await prisma.$disconnect();
    });
