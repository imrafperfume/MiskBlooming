import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient()

export const resolvers = {
    createProduct: async (_: any, args: any, context: any) => {
        const { userId } = context
        console.log(userId)
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                role: true
            }
        })

        if (!user) throw new Error("User not found")

        if (user.role !== "ADMIN") {
            throw new Error("Not authorized")
        }

        const product = await prisma.product.create({
            data: {
                name: args.name,
                slug: args.slug,
                description: args.description,
                shortDescription: args.shortDescription,
                category: args.category,
                subcategory: args.subcategory,
                tags: args.tags,
                price: args.price,
                compareAtPrice: args.compareAtPrice,
                costPerItem: args.costPerItem,
                sku: args.sku,
                barcode: args.barcode,
                trackQuantity: args.trackQuantity,
                quantity: args.quantity,
                lowStockThreshold: args.lowStockThreshold,
                requiresShipping: args.requiresShipping,
                weight: args.weight,
                featuredImage: args.featuredImage,
                seoTitle: args.seoTitle,
                seoDescription: args.seoDescription,
                seoKeywords: args.seoKeywords,
                status: args.status,
                featured: args.featured,
                deliveryZones: args.deliveryZones,
                deliveryTime: args.deliveryTime,
                freeDeliveryThreshold: args.freeDeliveryThreshold,
                giftWrapping: args.giftWrapping,
                personalization: args.personalization,
                careInstructions: args.careInstructions,
                occasions: args.occasions,
            },
        })
        return product

    },
}
