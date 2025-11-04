// app/sitemap.xml/route.ts
import { NextResponse } from "next/server";
import { yogaFetch } from "../lib/graphql-client";
import { GET_PRODUCTS } from "../modules/product/operations";
import { GET_CATEGORIES } from "../modules/category/categoryTypes";

interface Product {
  slug: string;
  updatedAt: string;
  images: { url: string }[];
}

interface Category {
  slug: string;
  updatedAt: string;
}

export async function GET() {
  const BASE_URL = "https://www.miskblooming.com";

  const [{ data: productsData }, { data: categoriesData }] = await Promise.all([
    yogaFetch<{ data: { products: Product[] } }>(GET_PRODUCTS),
    yogaFetch<{ data: { categories: Category[] } }>(GET_CATEGORIES),
  ]);

  const urls: string[] = [];

  // Home
  urls.push(`
    <url>
      <loc>${BASE_URL}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>
  `);

  // Static Pages
  const pages = ["/about", "/contact", "/blog", "/terms", "/privacy"];
  pages.forEach((p) =>
    urls.push(`
      <url>
        <loc>${BASE_URL}${p}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
      </url>
    `)
  );

  // Categories
  categoriesData.categories.forEach((c) =>
    urls.push(`
      <url>
        <loc>${BASE_URL}/categories/${c.slug}</loc>
        <lastmod>${c.updatedAt}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `)
  );

  // Products (with image tag)
  productsData.products.forEach((p) =>
    urls.push(`
      <url>
        <loc>${BASE_URL}/products/${p.slug}</loc>
        <lastmod>${p.updatedAt}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
        <image:image>
          <image:loc>${BASE_URL}${p.images[0]?.url}</image:loc>
          <image:caption>${p.slug}</image:caption>
        </image:image>
      </url>
    `)
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset 
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
      ${urls.join("\n")}
  </urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
