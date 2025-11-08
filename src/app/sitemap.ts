// app/sitemap.ts
import { MetadataRoute } from "next";
import { GET_PRODUCTS_SITEMAP } from "../modules/product/operations";
import { GET_CATEGORIES_SITEMAP } from "../modules/category/categoryTypes";
import { yogaFetch } from "../lib/graphql-client";

export const revalidate = 0; // ✅ Disable prerendering, always run dynamically

const safeDate = (date?: string | null) => {
  const parsed = Date.parse(date ?? "");
  return isNaN(parsed)
    ? new Date().toISOString()
    : new Date(parsed).toISOString();
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
  const BASE_URL = process.env.NEXT_PUBLIC_URL || "https://miskblooming.com";

  try {
    const [{ data: productsData }, { data: categoriesData }] =
      await Promise.all([
        yogaFetch<{ data: { products: Product[] } }>(GET_PRODUCTS_SITEMAP, {
          cache: "no-store",
        }),
        yogaFetch<{ data: { categories: Category[] } }>(
          GET_CATEGORIES_SITEMAP,
          { cache: "no-store" }
        ),
      ]);

    const routes: MetadataRoute.Sitemap = [
      {
        url: BASE_URL,
        lastModified: safeDate(),
      },
    ];

    categoriesData?.categories?.forEach((c) => {
      if (!c?.name) return;
      routes.push({
        url: `${BASE_URL}/categories/${encodeURIComponent(c.name)}`,
        lastModified: safeDate(c.updatedAt),
      });
    });

    productsData?.products?.forEach((p) => {
      if (!p?.slug) return;
      routes.push({
        url: `${BASE_URL}/products/${encodeURIComponent(p.slug)}`,
        lastModified: safeDate(p.updatedAt),
      });
    });

    return routes;
  } catch (error) {
    console.error("❌ Sitemap generation error:", error);
    return [
      {
        url: BASE_URL,
        lastModified: safeDate(),
      },
    ];
  }
}
