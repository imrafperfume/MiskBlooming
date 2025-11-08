// app/sitemap.ts
import { MetadataRoute } from "next";
import { GET_PRODUCTS_SITEMAP } from "../modules/product/operations";
import { GET_CATEGORIES_SITEMAP } from "../modules/category/categoryTypes";
import { yogaFetch } from "../lib/graphql-client";

interface Product {
  slug: string;
  updatedAt?: string | null;
}

interface Category {
  name: string;
  updatedAt?: string | null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  try {
    const [{ data: productsData }, { data: categoriesData }] =
      await Promise.all([
        yogaFetch<{ data: { products: Product[] } }>(GET_PRODUCTS_SITEMAP),
        yogaFetch<{ data: { categories: Category[] } }>(GET_CATEGORIES_SITEMAP),
      ]);

    const routes: MetadataRoute.Sitemap = [
      {
        url: BASE_URL,
        lastModified: new Date().toISOString(),
      },
      { url: `${BASE_URL}/about` },
      { url: `${BASE_URL}/contact` },
      { url: `${BASE_URL}/blog` },
      { url: `${BASE_URL}/terms` },
      { url: `${BASE_URL}/privacy` },
    ];

    categoriesData?.categories?.forEach((c) => {
      if (!c?.name) return;

      routes.push({
        url: `${BASE_URL}/categories/${encodeURIComponent(c.name)}`,
        lastModified: c.updatedAt
          ? new Date(c.updatedAt).toISOString()
          : new Date().toISOString(),
      });
    });

    productsData?.products?.forEach((p) => {
      if (!p?.slug) return;

      routes.push({
        url: `${BASE_URL}/products/${encodeURIComponent(p.slug)}`,
        lastModified: p.updatedAt
          ? new Date(p.updatedAt).toISOString()
          : new Date().toISOString(),
      });
    });

    return routes;
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return [
      {
        url: BASE_URL,
        lastModified: new Date().toISOString(),
      },
    ];
  }
}
