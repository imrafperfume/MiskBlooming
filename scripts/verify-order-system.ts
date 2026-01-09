import "dotenv/config";
import { prisma } from "../src/lib/db";

async function main() {
    console.log("Verifying size and color variants in order system...");

    // 1. Get a Product
    const product = await prisma.product.findFirst({ where: { status: "active" } });
    if (!product) throw new Error("No active product found");
    console.log("Using product:", product.name);

    // 2. Create Test Order with size & color
    const testOrder = await prisma.order.create({
        data: {
            firstName: "Variant",
            lastName: "Test",
            email: "variant@example.com",
            phone: "0000000000",
            address: "Variant St",
            city: "Dubai",
            emirate: "Dubai",
            paymentMethod: "COD",
            deliveryType: "STANDARD",
            totalAmount: 0,
            items: {
                create: [{
                    productId: product.id,
                    quantity: 1,
                    price: product.price,
                    size: "Large",
                    color: "Royal Red"
                }]
            }
        },
        include: { items: true }
    }) as any;

    console.log("Successfully created test order!");
    console.log("Item Details:", {
        size: testOrder.items[0].size,
        color: testOrder.items[0].color
    });

    // Cleanup
    await prisma.order.delete({ where: { id: testOrder.id } });
    console.log("Cleanup complete.");
}

main().catch(console.error);
