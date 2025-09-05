import ProductDetailPage from "./productsDetails";
import { getProductBySlug } from "@/src/modules/product/productUtils";
import { Metadata } from 'next';

// Define the type for the props correctly as a Promise
interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  // Await the params to get the slug
  const { slug } = await params;
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

export default async function ProductLayout({
  params,
}: ProductPageProps) {
  // Await the params object to get the slug
  const { slug } = await params;
  return <ProductDetailPage slug={slug} />;
}