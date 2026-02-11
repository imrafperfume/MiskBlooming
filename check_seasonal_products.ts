
import { prisma } from "./src/lib/db";

async function main() {
    const products = await prisma.product.findMany({
        where: {
            category: "Seasonal",
        },
        select: {
            id: true,
            name: true,
            category: true,
        }
    });
    console.log("Seasonal Products:", products);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
