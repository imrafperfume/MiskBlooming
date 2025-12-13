"use client";
import * as React from "react";
import { useState } from "react";
import Loading from "@/src/components/layout/Loading";
import { toast } from "sonner";
import { useAuth } from "@/src/hooks/useAuth";
import { useMutation } from "@apollo/client";
import { CREATE_REVIEW } from "@/src/modules/review/reviewType";
import ProductBreadcrumb from "./ProductBreadcrumb";
import ProductImages from "./ProductImages";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";
import ImageModal from "./ImageModal";
import { useProduct } from "@/src/hooks/useProducts";
import { useCartStore } from "@/src/store/cartStore";
import { useWishlistStore } from "@/src/store/wishlistStore";
import Link from "next/link";
import Button from "../ui/Button";

interface ProductDetailProps {
  slug: { slug: string };
}

export default function ProductDetail({ slug }: ProductDetailProps) {
  const { data: product, isLoading } = useProduct(slug.slug, [
    "id",
    "name",
    "slug",
    "category",
    "shortDescription",
    "description",
    "price",
    "compareAtPrice",
    "quantity",
    "images {url}",
    "featured",
    "tags",
    "careInstructions",
    "sku",
    "featuredImage",
    "Review {id rating comment createdAt user{id firstName email emailVerified}}",
    "variantOptions {id name values}",
  ]);

  const [selectedImage, setSelectedImage] = useState(
    product?.featuredImage || 0
  );
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState<Record<string, string>>({});

  const [activeTab, setActiveTab] = useState("description");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();
  const isWishlisted = product ? isInWishlist(product.id) : false;
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const { data: user } = useAuth();
  const [createReview] = useMutation(CREATE_REVIEW);
  const userId = user?.id;
  const reviews = product?.Review;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading("Creating Review");
    if (!userId) {
      toast.error("Please login first");
      toast.dismiss();
      return;
    }
    if (!rating || !comment) {
      toast.error("Please add a rating and comment!");
      toast.dismiss();
      return;
    }
    try {
      await createReview({
        variables: {
          data: {
            rating: rating,
            comment: comment,
            productId: product?.id,
            userId: userId,
            slug: slug.slug,
          },
        },
      });
      toast.success("Review Create Successfully");
      toast.dismiss();
    } catch (error) {
      toast.error("Something Wrong");
      toast.dismiss();
    }
    setRating(0);
    setComment("");
    toast.dismiss();
  };

  const handleAddToCart = React.useCallback(
    (e: React.MouseEvent, selectedVariants: Record<string, string>) => {
      e.preventDefault();

      if (!product) return;

      const result = addItem({
        ...product,
        quantity,
        selectedVariants, // ⬅️ main update
      });

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    },
    [addItem, product, quantity]
  );

  const handleWishlistToggle = () => {
    if (product) {
      if (isWishlisted) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    }
  };

  const nextImage = () => {
    if (product) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product) {
      setSelectedImage(
        (prev) => (prev - 1 + product.images.length) % product.images.length
      );
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-cormorant text-3xl font-bold text-foreground  mb-4">
            Product Not Found
          </h1>
          <Link href="/products">
            <Button variant="luxury">Return to Collections</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-10 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductBreadcrumb productName={product.name} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductImages
            product={product}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            nextImage={nextImage}
            prevImage={prevImage}
            setIsImageModalOpen={setIsImageModalOpen}
          />

          <ProductInfo
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
            setVariant={setVariant}
            selectedVariants={variant}
            isWishlisted={isWishlisted}
            handleAddToCart={handleAddToCart}
            handleWishlistToggle={handleWishlistToggle}
            reviews={reviews || []}
          />
        </div>

        <ProductTabs
          product={product}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          rating={rating}
          setRating={setRating}
          hover={hover}
          setHover={setHover}
          comment={comment}
          setComment={setComment}
          handleSubmit={handleSubmit}
          user={user}
        />

        <ImageModal
          product={product}
          selectedImage={selectedImage}
          isImageModalOpen={isImageModalOpen}
          setIsImageModalOpen={setIsImageModalOpen}
        />
      </div>
    </div>
  );
}
