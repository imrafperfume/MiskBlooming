import { Product } from "@/src/types";
import { motion } from "framer-motion";
import { Star, CheckCircle } from "lucide-react";
import Link from "next/link";
import Button from "../../ui/Button";
import { formatTimestamp } from "@/src/lib/utils";

interface ReviewsTabProps {
  product: Product;
  rating: number;
  setRating: (rating: number) => void;
  hover: number;
  setHover: (hover: number) => void;
  comment: string;
  setComment: (comment: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  user: any;
}

export default function ReviewsTab({
  product,
  rating,
  setRating,
  hover,
  setHover,
  comment,
  setComment,
  handleSubmit,
  user,
}: ReviewsTabProps) {
  const reviews = product.Review || [];
  const totalReviews = reviews.length;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percentage = totalReviews ? (count / totalReviews) * 100 : 0;
    return { star, count, percentage };
  });
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  return (
    <motion.div
      key="reviews"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        {/* Write Review Form */}
        {user ? (
          <div className="mt-10 border-t pt-8">
            <h3 className="font-cormorant text-2xl font-bold text-charcoal-900 mb-4">
              Write a Review
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating */}
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 cursor-pointer transition ${
                      (hover || rating) >= star
                        ? "text-luxury-500 fill-current"
                        : "text-cream-500"
                    }`}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(star)}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating ? `${rating} / 5` : "Select rating"}
                </span>
              </div>

              {/* Comment Box */}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-luxury-500"
                placeholder="Write your review here..."
              />

              {/* Submit */}
              <Button type="submit" size={"lg"} className="">
                Submit Review
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col gap-2 items-center justify-center ">
            <h1 className="font-semibold text-lg">
              Please login for write a review
            </h1>
            <Link href={`/auth/login?callbackUrl=${product.slug}`}>
              <Button size={"sm"} variant={"luxury"}>
                Login Now
              </Button>
            </Link>
          </div>
        )}

        {reviews.length > 0 ? (
          <>
            <div className="flex items-center mt-9 justify-between mb-6">
              <h3 className="font-cormorant text-2xl font-bold text-charcoal-900">
                Customer Reviews
              </h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-luxury-500 fill-current mr-1" />
                  <span className="font-semibold text-charcoal-900">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground ml-1">
                    ({reviews.length || 0} reviews)
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="font-semibold text-charcoal-900 mb-4">
                  Rating Breakdown
                </h4>
                {ratingCounts.map(({ star, percentage, count }) => (
                  <div key={star} className="flex items-center mb-2">
                    <span className="text-sm text-muted-foreground w-8">
                      {star}
                    </span>
                    <Star className="w-4 h-4 text-luxury-500 fill-current mr-2" />
                    <div className="flex-1 bg-cream-200 rounded-full h-2 mr-3">
                      <div
                        className="bg-luxury-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground w-8">
                      {percentage.toFixed(0)}% ({count})
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-luxury-50 rounded-xl p-6">
                <h4 className="font-semibold text-charcoal-900 mb-3">
                  What customers love:
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Exceptional quality and freshness</li>
                  <li>• Beautiful presentation and packaging</li>
                  <li>• Reliable and timely delivery</li>
                  <li>• Outstanding customer service</li>
                </ul>
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-cream-200 pb-6 last:border-b-0"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="font-medium text-sm text-charcoal-900 mr-3">
                          {review.user?.firstName}
                        </span>
                        {review.user?.emailVerified && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified User
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        {[5, 4, 3, 2, 1].map((starRating) => (
                          <Star
                            key={starRating}
                            className={`w-4 h-4 ${
                              starRating <= review.rating
                                ? "text-luxury-500 fill-current"
                                : "text-cream-500"
                            }`}
                          />
                        ))}
                        <span className="text-sm text-muted-foreground ml-2">
                          {formatTimestamp(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-3 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center mt-8 font-semibold">
            <h3>No Review Found</h3>
          </div>
        )}
      </div>
    </motion.div>
  );
}
