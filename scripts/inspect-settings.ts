import "dotenv/config";
import { prisma } from "../src/lib/db";

async function main() {
    console.log("Inspecting StoreSettings in DB...");
    const settings = await prisma.storeSettings.findFirst();
    console.log("Raw settings from Prisma:", JSON.stringify(settings, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
        , 2));
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
