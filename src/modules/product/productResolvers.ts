import { prisma } from "@/src/lib/db";
import { isAdmin } from "@/src/lib/isAdmin";
import { redis } from "@/src/lib/redis";
interface CreateProductInput {
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
  images: { url: string; publicId: string }[];
  dimensions?: {
    weight: number;
    length: number;
    width: number;
    height: number;
  };
  variantOptions?: { name: string; values: string[] }[];
  hasVariants: boolean;
}
interface CreateProductArgs {
  data: CreateProductInput;
}

export const ProductResolvers = {
  Query: {
    products: async (_: any, args: { where?: { featured?: boolean } }) => {
      const cacheKey = args.where?.featured
        ? "featured-products"
        : "allProducts";
      const cache = await redis.get(cacheKey);
      if (cache) {
        return cache;
      }
      const products = await prisma.product.findMany({
        where: {
          ...args.where,
          status: "active",
        },
        include: {
          images: true,
          dimensions: true,
          variantOptions: true,
          Review: {
            select: {
              rating: true,
            },
          },
        },
      });

      if (!products || products.length === 0) return [];
      await redis.set(cacheKey, JSON.stringify(products), { ex: 60 * 60 * 6 });
      return products;
    },

    productBySlug: async (_: any, args: { slug: string }) => {
      const cache: string | null = await redis.get(`product:${args.slug}`);
      if (cache) {
        return cache;
      }
      const product = await prisma.product.findUnique({
        where: { slug: args.slug },
        include: {
          images: true,
          dimensions: true,
          variantOptions: true,
          Review: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  emailVerified: true,
                },
              },
            },
          },
        },
      });
      if (!product) throw new Error("Product not found");
      await redis.set(`product:${args.slug}`, JSON.stringify(product), {
        ex: 60 * 60 * 6,
      });
      console.log(product);
      return product;
    },
  },

  Mutation: {
    createProduct: async (
      _: any,
      args: CreateProductArgs,
      context: { userId: string }
    ) => {
      const productData = args.data;
      console.log(productData);

      try {
        const { userId } = context;
        if (!userId) throw new Error("Unauthorized");
        const userRole = await isAdmin(userId);
        if (userRole.role !== "ADMIN") throw new Error("Not authorized");

        // Check duplicate slug
        const existing = await prisma.product.findUnique({
          where: { slug: productData.slug },
        });
        if (existing) throw new Error("Product with this slug already exists");

        const product = await prisma.product.create({
          data: {
            ...productData,
            images: productData?.images
              ? {
                  create: productData?.images.map((img: any) => ({
                    url: img?.url,
                    publicId: img?.publicId,
                  })),
                }
              : undefined,
            dimensions: productData?.dimensions
              ? {
                  create: {
                    length: productData.dimensions.length,
                    width: productData.dimensions.width,
                    height: productData.dimensions.height,
                  },
                }
              : undefined,
            variantOptions: productData?.variantOptions
              ? {
                  create: productData?.variantOptions.map((opt: any) => ({
                    name: opt.name,
                    values: opt.values,
                  })),
                }
              : undefined,
          },
          include: {
            images: true,
            dimensions: true,
            variantOptions: true,
          },
        });
        await redis.del("allProducts");
        await redis.del("featured-products");
        return product;
      } catch (error: any) {
        console.error(error);
        throw new Error("Failed to create product");
      }
    },

    updateProduct: async (
      _: any,
      { slug, data }: { slug: string; data: CreateProductInput },
      context: { userId: string }
    ) => {
      try {
        const { userId } = context;
        if (!userId) throw new Error("Unauthorized");

        const userRole = await isAdmin(userId);
        if (userRole.role !== "ADMIN") throw new Error("Not authorized");

        const { variantOptions, ...rest } = data;

        const updated = await prisma.product.update({
          where: { slug },
          data: {
            ...rest,

            // Dimensions update
            dimensions: rest.dimensions
              ? {
                  upsert: {
                    create: rest.dimensions,
                    update: rest.dimensions,
                  },
                }
              : undefined,

            // Images update
            images: rest.images
              ? {
                  deleteMany: {},
                  create: rest.images.map((img) => ({
                    url: img.url,
                    publicId: img.publicId,
                  })),
                }
              : undefined,

            // ✅ Variant Options update
            variantOptions: variantOptions
              ? {
                  deleteMany: {}, // remove old
                  create: variantOptions.map((opt) => ({
                    name: opt.name,
                    values: opt.values,
                  })),
                }
              : undefined,
          },

          include: {
            images: true,
            variantOptions: true,
          },
        });

        await redis.del(`product:${slug}`);
        await redis.del("allProducts");

        return updated;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to update product");
      }
    },

    deleteProduct: async (
      _: any,
      { slug }: { slug: string },
      context: { userId: string }
    ) => {
      try {
        if (!context.userId) throw new Error("Unauthorized");

        const userRole = await isAdmin(context?.userId);
        if (userRole.role !== "ADMIN") throw new Error("Not authorized");

        const deleted = await prisma.product.delete({
          where: { slug },
        });
        await redis.del("allProducts");
        await redis.del("featured-products");
        await redis.del(`product:${slug}`);

        return deleted;
      } catch (error) {
        throw new Error("Failed to delete product");
      }
    },
  },
};
