"use client";
import React, { useState } from "react";
import { Star } from "lucide-react";
import { useMutation } from "@apollo/client";
import { CREATE_REVIEW } from "@/src/modules/review/reviewType";
import { toast } from "sonner";
import Button from "../../ui/Button";

interface ReviewFormProps {
  productId: string;
}

export default function ReviewForm({ productId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [createReview] = useMutation(CREATE_REVIEW);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !comment) return toast.error("Add rating and comment!");
    try {
      await createReview({
        variables: { data: { productId, rating, comment } },
      });
      toast.success("Review submitted!");
      setRating(0);
      setComment("");
    } catch {
      toast.error("Something went wrong!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 cursor-pointer ${
              (hover || rating) >= star
                ? "text-luxury-500 fill-current"
                : "text-cream-500"
            }`}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-luxury-500"
        placeholder="Write your review here..."
      />
      <Button type="submit" size="lg">
        Submit Review
      </Button>
    </form>
  );
}
