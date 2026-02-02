import { MetadataRoute } from "next";
import { GET_PRODUCTS_SITEMAP } from "../modules/product/operations";
import {
  GET_CATEGORIES_SITEMAP,
  Category,
} from "../modules/category/categoryTypes";
import { yogaFetch } from "../lib/graphql-client";

export const revalidate = 3600; // 1 hour

const safeDate = (date?: string | Date | null) => {
  if (!date) return new Date().toISOString();
  const d = new Date(date);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
};

interface SitemapProduct {
  slug: string;
  updatedAt?: string | null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL =
    process.env.NEXT_PUBLIC_URL || "https://misk-blooming.vercel.app";

  const staticRoutes = [
    { url: "", priority: 1, changeFrequency: "daily" as const },
    { url: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/privacy", priority: 0.5, changeFrequency: "monthly" as const },
    { url: "/terms", priority: 0.5, changeFrequency: "monthly" as const },
    { url: "/cookies", priority: 0.5, changeFrequency: "monthly" as const },
    { url: "/delivery", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/track-order", priority: 0.6, changeFrequency: "yearly" as const },
    { url: "/products", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/occasions", priority: 0.9, changeFrequency: "daily" as const },
  ];

  try {
    const [{ data: productsData }, { data: categoriesData }] =
      (await Promise.all([
        yogaFetch(GET_PRODUCTS_SITEMAP).catch((err) => {
          console.error("Failed to fetch products for sitemap", err);
          return { data: { products: [] } };
        }),
        yogaFetch(GET_CATEGORIES_SITEMAP).catch((err) => {
          console.error("Failed to fetch categories for sitemap", err);
          return { data: { categories: [] } };
        }),
      ])) as [
        { data?: { products?: SitemapProduct[] } },
        { data?: { categories?: Category[] } }
      ];

    const routes: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
      url: `${BASE_URL}${route.url}`,
      lastModified: safeDate(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }));

    categoriesData?.categories?.forEach((c: Category) => {
      if (!c?.name) return;
      routes.push({
        url: `${BASE_URL}/categories/${encodeURIComponent(c.name)}`,
        lastModified: safeDate(c.updatedAt),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });

    productsData?.products?.forEach((p: SitemapProduct) => {
      if (!p?.slug) return;
      routes.push({
        url: `${BASE_URL}/products/${encodeURIComponent(p.slug)}`,
        lastModified: safeDate(p.updatedAt),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });

    return routes;
  } catch (error) {
    console.error("Sitemap generation error:", error);
    // Return at least the static routes if dynamic fetching fails completely
    return staticRoutes.map((route) => ({
      url: `${BASE_URL}${route.url}`,
      lastModified: safeDate(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }));
  }
}
