// app/sitemap.ts
import { MetadataRoute } from "next";
import { GET_PRODUCTS_SITEMAP } from "../modules/product/operations";
import { GET_CATEGORIES_SITEMAP } from "../modules/category/categoryTypes";
import { yogaFetch } from "../lib/graphql-client";

interface Product {
  slug: string;
  updatedAt: string;
}

interface Category {
  name: string;
  updatedAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  const [{ data: productsData }, { data: categoriesData }] = await Promise.all([
    yogaFetch<{ data: { products: Product[] } }>(GET_PRODUCTS_SITEMAP),
    yogaFetch<{ data: { categories: Category[] } }>(GET_CATEGORIES_SITEMAP),
  ]);

  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    { url: `${BASE_URL}/about`, priority: 0.5 },
    { url: `${BASE_URL}/contact`, priority: 0.5 },
    { url: `${BASE_URL}/blog`, priority: 0.5 },
    { url: `${BASE_URL}/terms`, priority: 0.5 },
    { url: `${BASE_URL}/privacy`, priority: 0.5 },
  ];

  categoriesData?.categories?.forEach((c: Category) =>
    routes.push({
      url: `${BASE_URL}/categories/${encodeURIComponent(c.name)}`,
      lastModified: c.updatedAt
        ? new Date(c.updatedAt).toISOString()
        : new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  productsData?.products
    ?.filter((p) => p.slug)
    .forEach((p: Product) =>
      routes.push({
        url: `${BASE_URL}/products/${encodeURIComponent(p.slug)}`,
        lastModified: p.updatedAt
          ? new Date(p.updatedAt).toISOString()
          : new Date().toISOString(),
        changeFrequency: "weekly",
        priority: 0.9,
      })
    );

  return routes;
}
