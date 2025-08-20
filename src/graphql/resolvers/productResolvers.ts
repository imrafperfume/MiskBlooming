import { prisma } from '@/src/lib/db';
interface CreateProductArgs {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    category: string;
    subcategory: string;
    tags: string[];
    price: number;
    compareAtPrice: number;
    costPerItem: number;
    sku?: string;
    barcode?: string;
    trackQuantity: boolean;
    quantity: number;
    lowStockThreshold: number;
    requiresShipping: boolean;
    featuredImage: number;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string[];
    status: "draft" | "active" | "archived";
    featured: boolean;
    deliveryZones: string[];
    deliveryTime: string;
    freeDeliveryThreshold: number;
    giftWrapping: boolean;
    personalization: boolean;
    careInstructions?: string;
    occasions: string[];
    images: { url: string; publicId: string; optimizedUrls: string[] }[];
    dimensions?: { length: number; width: number; height: number };
}

export const ProductResolvers = {
    Query: {
        products: async () => {
            try {
                return prisma.product.findMany();
            } catch (error) {
                console.error(error);
                throw new Error("Failed to fetch products");
            }
        },
        product: async (_: any, args: { slug: string }) => {
            const product = await prisma.product.findUnique({ where: { slug: args.slug } });
            if (!product) throw new Error("Product not found");
            return product;
        },
    },

    Mutation: {
        createProduct: async (_: any, args: CreateProductArgs, context: { userId: string }) => {
            try {
                const { userId } = context;
                if (!userId) throw new Error("Unauthorized");

                const user = await prisma.user.findUnique({
                    where: { id: userId },
                    select: { role: true },
                });
                if (!user) throw new Error("User not found");
                if (user.role !== "ADMIN") throw new Error("Not authorized");

                // Check duplicate slug
                const existing = await prisma.product.findUnique({ where: { slug: args?.slug } });
                if (existing) throw new Error("Product with this slug already exists");

                const product = await prisma.product.create({
                    data: {
                        ...args,
                        images: {
                            create: args.images.map((img: any) => ({
                                url: img.url,
                                publicId: img.publicId,
                                optimizedUrls: img.optimizedUrls ?? {},
                            })),
                        },
                        dimensions: args.dimensions
                            ? {
                                create: {
                                    length: args.dimensions.length,
                                    width: args.dimensions.width,
                                    height: args.dimensions.height,
                                },
                            }
                            : undefined,
                    },
                });

                return product;
            } catch (error: any) {
                console.error(error);
                throw new Error("Failed to create product");
            }
        },
    },
};