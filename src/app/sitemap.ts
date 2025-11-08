// app/sitemap.ts
import { MetadataRoute } from "next";
import { GET_PRODUCTS_SITEMAP } from "../modules/product/operations";
import { GET_CATEGORIES_SITEMAP } from "../modules/category/categoryTypes";
import { yogaFetch } from "../lib/graphql-client";

export const revalidate = 0; // run at request-time, not prerender

const safeDate = (date?: string | null) => {
  const d = new Date(date ?? "");
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
};

interface Product {
  slug: string;
  updatedAt?: string | null;
}

interface Category {
  name: string;
  updatedAt?: string | null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL =
    process.env.NEXT_PUBLIC_URL || "https://misk-blooming.vercel.app";

  try {
    // Force live fetch at runtime
    const [{ data: productsData }, { data: categoriesData }] =
      (await Promise.all([
        yogaFetch(GET_PRODUCTS_SITEMAP, { cache: "no-store" }),
        yogaFetch(GET_CATEGORIES_SITEMAP, { cache: "no-store" }),
      ])) as [
        { data?: { products?: Product[] } },
        { data?: { categories?: Category[] } }
      ];

    const routes: MetadataRoute.Sitemap = [
      { url: BASE_URL, lastModified: safeDate() },
    ];

    categoriesData?.categories?.forEach((c: Category) => {
      if (!c?.name) return;
      routes.push({
        url: `${BASE_URL}/categories/${encodeURIComponent(c.name)}`,
        lastModified: safeDate(c.updatedAt),
      });
    });

    productsData?.products?.forEach((p: Product) => {
      if (!p?.slug) return;
      routes.push({
        url: `${BASE_URL}/products/${encodeURIComponent(p.slug)}`,
        lastModified: safeDate(p.updatedAt),
      });
    });

    return routes;
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return [{ url: BASE_URL, lastModified: safeDate() }];
  }
}
