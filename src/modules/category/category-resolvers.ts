import { prisma } from "@/src/lib/db";
import { redis } from "@/src/lib/redis";
import { ca } from "zod/v4/locales";
import { Category, SubCategory } from "./categoryTypes";
import { isAdmin } from "@/src/lib/isAdmin";

export const CategoryResolvers = {
  Query: {
    categories: async (_: any, __: any) => {
      try {
        const cache = await redis.get("categories:all");
        if (cache) {
          return cache;
        }

        const categories = await prisma.category.findMany({
          include: {
            subcategories: true,
          },
        });
        if (!categories) throw new Error("No categories found");
        await redis.set("categories:all", JSON.stringify(categories), {
          ex: 60 * 60,
        });
        return categories;
      } catch (error) {
        throw new Error("Failed to fetch categories");
      }
    },
    category: async (_: any, args: { id: string }) => {
      try {
        const cache = await redis.get(`category:${args.id}`);
        if (cache) {
          return cache;
        }
        const category = await prisma.category.findUnique({
          where: { id: args.id },
          include: { subcategories: true },
        });
        await redis.set(`category:${args.id}`, JSON.stringify(category), {
          ex: 60 * 60,
        }); // 1 hour
        return category;
      } catch (error) {
        throw new Error("Failed to fetch category");
      }
    },
    subcategories: async (_: any, __: any) => {
      try {
        const cache = await redis.get("subcategories:all");
        if (cache) {
          return cache;
        }
        const subcategories = await prisma.subCategory.findMany({
          include: {
            category: true,
          },
        });
        if (!subcategories) throw new Error("No subcategories found");
        await redis.set("subcategories:all", JSON.stringify(subcategories), {
          ex: 60 * 60, // 1 hour
        });
        return subcategories;
      } catch (error) {
        throw new Error("Failed to fetch subcategories");
      }
    },
    subcategory: async (_: any, args: { id: string }) => {
      try {
        const cache = await redis.get(`subcategory:${args.id}`);
        if (cache) {
          return cache;
        }
        const subcategory = await prisma.subCategory.findUnique({
          where: { id: args.id },
          include: { category: true },
        });
        await redis.set(`subcategory:${args.id}`, JSON.stringify(subcategory), {
          ex: 60 * 60,
        }); // 1 hour
        return subcategory;
      } catch (error) {}
    },
  },

  Mutation: {
    createCategory: async (
      _: any,
      args: { input: Category },
      context: { userId: string }
    ) => {
      try {
        const userId = context.userId;
        if (!userId) throw new Error("Unauthorized");
        const isUserAdmin = await isAdmin(userId);
        if (!isUserAdmin) throw new Error("Forbidden");
        if (isUserAdmin.role !== "ADMIN") throw new Error("Forbidden");
        const category = await prisma.category.create({
          data: {
            id: args.input.id,
            name: args.input.name,
            description: args.input.description,
            imageUrl: args.input.imageUrl,
            createdAt: args.input.createdAt,
            updatedAt: args.input.updatedAt,
          },
        });
        await redis.del("categories:all");
        await redis.del("subcategories:all");
        await redis.del(`category:${args.input.id}`);
        await redis.del(`subcategory:${args.input.id}`);
        return category;
      } catch (error) {
        throw new Error("Failed to create category");
      }
    },
    createSubCategory: async (
      _: any,
      args: { input: SubCategory },
      context: { userId: string }
    ) => {
      try {
        const userId = context.userId;
        if (!userId) throw new Error("Unauthorized");
        const isUserAdmin = await isAdmin(userId);
        if (!isUserAdmin) throw new Error("Forbidden");
        if (isUserAdmin.role !== "ADMIN") throw new Error("Forbidden");
        const subcategory = await prisma.subCategory.create({
          data: {
            id: args.input.id,
            name: args.input.name,
            categoryId: args.input.categoryId,
            createdAt: args.input.createdAt,
            updatedAt: args.input.updatedAt,
          },
        });
        await redis.del("subcategories:all");
        return subcategory;
      } catch (error) {
        throw new Error("Failed to create subcategory");
      }
    },
    deleteCategory: async (
      _: any,
      args: { id: string },
      context: { userId: string }
    ) => {
      try {
        const userId = context.userId;
        if (!userId) throw new Error("Unauthorized");
        const isUserAdmin = await isAdmin(userId);
        if (!isUserAdmin) throw new Error("Forbidden");
        if (isUserAdmin.role !== "ADMIN") throw new Error("Forbidden");
        const deleted = await prisma.category.delete({
          where: { id: args.id },
        });
        await redis.del("categories:all");
        await redis.del(`category:${args.id}`);
        await redis.del("subcategories:all");
        await redis.del(`subcategory:${args.id}`);
        return !!deleted;
      } catch (error) {}
    },
    updateCategory: async (
      _: any,
      args: { id: string; input: Category },
      context: { userId: string }
    ) => {
      try {
        const userId = context.userId;
        if (!userId) throw new Error("Unauthorized");
        const isUserAdmin = await isAdmin(userId);
        if (!isUserAdmin) throw new Error("Forbidden");
        if (isUserAdmin.role !== "ADMIN") throw new Error("Forbidden");
        const updated = await prisma.category.update({
          where: { id: args.id },
          data: {
            name: args.input.name,
            description: args.input.description,
            imageUrl: args.input.imageUrl,
            updatedAt: new Date(),
          },
        });
        await redis.del("categories:all");
        await redis.del(`category:${args.id}`);
        return updated;
      } catch (error) {
        throw new Error("Failed to update category");
      }
    },
    updateSubCategory: async (
      _: any,
      args: { id: string; input: SubCategory },
      context: { userId: string }
    ) => {
      try {
        const userId = context.userId;
        if (!userId) throw new Error("Unauthorized");
        const isUserAdmin = await isAdmin(userId);
        if (!isUserAdmin) throw new Error("Forbidden");
        if (isUserAdmin.role !== "ADMIN") throw new Error("Forbidden");
        const updated = await prisma.subCategory.update({
          where: { id: args.id },
          data: {
            name: args.input.name,
            categoryId: args.input.categoryId,
            updatedAt: new Date(),
          },
        });
        await redis.del("subcategories:all");
        await redis.del(`subcategory:${args.id}`);
        return updated;
      } catch (error) {
        throw new Error("Failed to update subcategory");
      }
    },
    deleteSubCategory: async (
      _: any,
      args: { id: string },
      context: { userId: string }
    ) => {
      try {
        const userId = context.userId;
        if (!userId) throw new Error("Unauthorized");
        const isUserAdmin = await isAdmin(userId);
        if (!isUserAdmin) throw new Error("Forbidden");
        if (isUserAdmin.role !== "ADMIN") throw new Error("Forbidden");
        const deleted = await prisma.subCategory.delete({
          where: { id: args.id },
        });
        await redis.del("subcategories:all");
        await redis.del(`subcategory:${args.id}`);
        return !!deleted;
      } catch (error) {
        throw new Error("Failed to delete subcategory");
      }
    },
  },
};
