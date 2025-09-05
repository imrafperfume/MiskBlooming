import ProductDetailPage from "./productsDetails";
import { getProductBySlug } from "@/src/modules/product/productUtils";
import { Metadata } from 'next';

// Updated interface for Next.js 15 - params is now a Promise
interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  // Await the params Promise to get the slug
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  console.log("🚀 ~ generateMetadata ~ slug:", slug);
  
  try {
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
  } catch (error) {
    console.error("Error generating metadata:", error);
    
    // Return fallback metadata
    return {
      title: "Product Details",
      description: "View product details",
      openGraph: {
        title: "Product Details",
        description: "View product details",
      },
      twitter: {
        card: "summary_large_image",
        title: "Product Details",
        description: "View product details",
      },
    };
  }
}

export default async function ProductLayout({
  params,
}: ProductPageProps) {
  // Await the params Promise to get the slug
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  console.log("🚀 ~ ProductLayout ~ slug:", slug);
  
  return <ProductDetailPage slug={slug} />;
}