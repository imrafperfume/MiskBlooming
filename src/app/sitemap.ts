// app/sitemap.ts
import { MetadataRoute } from "next";
import { GET_PRODUCTS_SITEMAP } from "../modules/product/operations";
import { GET_CATEGORIES_SITEMAP } from "../modules/category/categoryTypes";
import { yogaFetch } from "../lib/graphql-client";

interface Product {
  slug: string;
  updatedAt: string;
  images: { url: string }[];
}

interface Category {
  slug: string;
  updatedAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // const BASE_URL = "https://www.miskblooming.com";
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const [{ data: productsData }, { data: categoriesData }] = await Promise.all([
    yogaFetch<{ data: { products: Product[] } }>(GET_PRODUCTS_SITEMAP),
    yogaFetch<{ data: { categories: Category[] } }>(GET_CATEGORIES_SITEMAP),
  ]);
  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    { url: `${BASE_URL}/about`, priority: 0.5 },
    { url: `${BASE_URL}/contact`, priority: 0.5 },
    { url: `${BASE_URL}/blog`, priority: 0.5 },
    { url: `${BASE_URL}/terms`, priority: 0.5 },
    { url: `${BASE_URL}/privacy`, priority: 0.5 },
  ];

  categoriesData?.categories.forEach((c: any) =>
    routes.push({
      url: `${BASE_URL}/categories/${c.name}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  (productsData?.products || [])
    .filter((p) => p?.slug)
    .forEach((p: any) =>
      routes.push({
        url: `${BASE_URL}/products/${encodeURIComponent(p.slug)}`, // spaces/special chars safe
        lastModified: p.updatedAt,
        changeFrequency: "weekly",
        priority: 0.9,
      })
    );

  return routes;
}
