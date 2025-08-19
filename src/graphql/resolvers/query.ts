import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export const resolvers = {
    products: async () => {
        return prisma.product.findMany()
    },
    product: async (_: any, args: { slug: string }) => {
        return prisma.product.findUnique({ where: { slug: args.slug } })
    },
}