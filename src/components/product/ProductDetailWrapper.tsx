"use client";
import dynamic from "next/dynamic";

const ProductDetail = dynamic(() => import("./ProductDetail"), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

interface ProductDetailWrapperProps {
  slug: {
    slug: string;
  };
}

export default function ProductDetailWrapper({
  slug,
}: ProductDetailWrapperProps) {
  return <ProductDetail slug={slug} />;
}
