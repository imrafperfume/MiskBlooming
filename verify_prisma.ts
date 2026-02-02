
import { prisma } from "./src/lib/db";

async function main() {
    console.log("Checking Prisma Client...");
    if ((prisma as any).newsletterSubscriber) {
        console.log("SUCCESS: newsletterSubscriber model is available on Prisma Client.");
    } else {
        console.log("FAILURE: newsletterSubscriber model is undefined.");
        console.log("Available models:", Object.keys(prisma).filter(k => !k.startsWith('_')));
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
