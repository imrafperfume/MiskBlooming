import React from "react";
import ProductDetailPage from "./productsDetails";
import { getProductBySlug } from "@/src/modules/product/productUtils";
interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const slug = (await params).slug;
  const product = await getProductBySlug(slug);
  const tags = product?.tags || [];
  return {
    title: product?.name || "Product Details",
    description:
      product?.shortDescription ||
      product?.description?.slice(0, 160) ||
      "View product details",
    keywords: tags.join(", "),
    openGraph: {
      title: product?.name || "Product Details",
      description:
        product?.shortDescription ||
        product?.description ||
        "View product details",
      images: product?.images?.map((img: { url: string }) => img.url) || [],
      tags,
    },
    twitter: {
      card: "summary_large_image",
      title: product?.name || "Product Details",
      description:
        product?.shortDescription ||
        product?.description ||
        "View product details",
      images: product?.images?.[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default function ProductLayout({ params }: ProductDetailPageProps) {
  const { slug } = React.use(params);
  return (
    <>
      <ProductDetailPage slug={slug} />
    </>
  );
}
