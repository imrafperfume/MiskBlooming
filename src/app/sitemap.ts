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

  try {
    const [{ data: productsData }, { data: categoriesData }] =
      (await Promise.all([
        yogaFetch(GET_PRODUCTS_SITEMAP),
        yogaFetch(GET_CATEGORIES_SITEMAP),
      ])) as [
        { data?: { products?: SitemapProduct[] } },
        { data?: { categories?: Category[] } }
      ];

    const routes: MetadataRoute.Sitemap = [
      {
        url: BASE_URL,
        lastModified: safeDate(),
        changeFrequency: "daily",
        priority: 1,
      },
    ];

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
    return [
      {
        url: BASE_URL,
        lastModified: safeDate(),
        changeFrequency: "daily",
        priority: 1,
      },
    ];
  }
}
