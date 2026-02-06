import { prisma } from "@/src/lib/db";
import { redis } from "@/src/lib/redis";
import { HomeContentFormData } from "./managmentTypeDefs";
import { validateAdmin } from "@/src/lib/isAdmin";

const CACHE_KEY = "home_page_content";

import { GraphQLScalarType, Kind } from "graphql";

const JSONScalar = new GraphQLScalarType({
  name: "JSON",
  description: "JSON custom scalar type",
  parseValue(value: any) {
    return value; // value from the client input variables
  },
  serialize(value: any) {
    return value; // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.OBJECT) {
      return parseObject(ast);
    }
    return null;
  },
});

function parseObject(ast: any) {
  const value = Object.create(null);
  ast.fields.forEach((field: any) => {
    value[field.name.value] = parseValue(field.value);
  });
  return value;
}

function parseValue(ast: any) {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return parseFloat(ast.value);
    case Kind.OBJECT:
      return parseObject(ast);
    case Kind.LIST:
      return ast.values.map(parseValue);
    default:
      return null;
  }
}

export const ManagementResolvers = {
  JSON: JSONScalar,
  Query: {
    getHomePageContent: async () => {
      try {
        const cache = await redis.get(CACHE_KEY);
        if (cache) {
          return cache;
        }
        const content = await prisma.homePageContent.findFirst();
        if (!content) return {
          id: "HOME_PAGE",
          heroSlides: [],
          stats: [],
          testimonials: [],
          categoryTitle: "",
          categoryDesc: "",
          featureTitle: "",
          featureSubtitle: "",
          featureDesc: "",
          seasonTitle: "",
          seasonSubtitle: "",
          seasonDesc: "",
          excellenceTitle: "",
          excellenceSubtitle: "",
          testimonialTitle: "",
          testimonialDesc: "",
          newsletterTitle: "",
          newsletterDesc: "",
        };
        await redis.set(CACHE_KEY, JSON.stringify(content), {
          ex: 60 * 60,
        }); // 1 hour
        return content;
      } catch (error) {
        throw new Error("Failed to fetch home page content");
      }
    },
    getCollectionContent: async () => {
      try {
        const cache = await redis.get("collection_content");
        if (cache) {
          return cache;
        }
        const content = await prisma.collection.findFirst();
        console.log("🚀 ~ content:", content);
        if (!content)
          return {
            id: "null", // or a placeholder if your type requires it
            collectionTitle: "No content",
            collectionDesc: "No content",
          };
        await redis.set("collection_content", JSON.stringify(content), {
          ex: 60 * 60,
        }); // 1 hour
        return content;
      } catch (error: any) {
        throw new Error(error.message || "Failed to fetch collection content");
      }
    },
    getAboutPageContent: async () => {
      try {
        const cache = await redis.get("about_page_content");
        if (cache) return cache;
        const content = await (prisma as any).aboutPageContent.findFirst();
        if (!content) return {
          id: "null",
          heroTitle: "About Us",
          heroDesc: "Welcome to our story.",
          storyTitle: "Our Story",
          storyDesc1: "It began with a dream...",
          storyDesc2: "And continues today...",
          stats: [],
          values: [],
          team: []
        };
        await redis.set("about_page_content", JSON.stringify(content), { ex: 3600 });
        return content;
      } catch (error) {
        console.error("Error in getAboutPageContent:", error);
        throw new Error("Failed to fetch about content: " + (error instanceof Error ? error.message : String(error)));
      }
    },
    getContactPageContent: async () => {
      try {
        const cache = await redis.get("contact_page_content");
        if (cache) return cache;
        const content = await (prisma as any).contactPageContent.findFirst();
        if (!content) return {
          id: "CONTACT_PAGE",
          heroTitle: "Contact Us",
          heroDesc: "Get in touch",
          heroImage: null,
          mapEmbedUrl: "",
          contactInfo: []
        };
        await redis.set("contact_page_content", JSON.stringify(content), { ex: 3600 });
        return content;
      } catch (error) {
        console.error("Error in getContactPageContent:", error);
        throw new Error("Failed to fetch contact content: " + (error instanceof Error ? error.message : String(error)));
      }
    },
  },
  Mutation: {
    updateHomePageContent: async (
      _: any,
      args: { input: HomeContentFormData },
      context: { userId: string }
    ) => {
      await validateAdmin(context?.userId);
      try {
        const fields = args.input;
        const data = await prisma.homePageContent.upsert({
          where: { id: "HOME_PAGE" },
          update: { ...fields },
          create: { id: "HOME_PAGE", ...fields },
        });
        await redis.del(CACHE_KEY);
        return data;
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to update home content");
      }
    },
    updateCollectionContent: async (
      _: any,
      args: { input: { collectionTitle: string; collectionDesc: string } },
      context: { userId: string }
    ) => {
      await validateAdmin(context?.userId);
      try {
        const fields = args.input;
        const data = await prisma.collection.upsert({
          where: { id: "COLLECTION" },
          update: { ...fields },
          create: { id: "COLLECTION", ...fields },
        });
        await redis.del("collection_content");
        return data;
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to update collection content");
      }
    },
    updateAboutPageContent: async (
      _: any,
      args: { input: any },
      context: { userId: string }
    ) => {
      await validateAdmin(context?.userId);
      try {
        const fields = args.input;
        const data = await (prisma as any).aboutPageContent.upsert({
          where: { id: "ABOUT_PAGE" },
          update: { ...fields },
          create: { id: "ABOUT_PAGE", ...fields },
        });
        await redis.del("about_page_content");
        return data;
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to update about content");
      }
    },
    updateContactPageContent: async (
      _: any,
      args: { input: any },
      context: { userId: string }
    ) => {
      await validateAdmin(context?.userId);
      try {
        const fields = args.input;
        const data = await (prisma as any).contactPageContent.upsert({
          where: { id: "CONTACT_PAGE" },
          update: { ...fields },
          create: { id: "CONTACT_PAGE", ...fields },
        });
        await redis.del("contact_page_content");
        return data;
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to update contact content");
      }
    },
  },
};
