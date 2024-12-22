import { Review } from "@/types/cafe";
import { Star } from "lucide-react";
import { Card } from "./ui/card";

interface ReviewsProps {
  reviews?: Review[];
}

export const Reviews = ({ reviews = [] }: ReviewsProps) => {
  console.log("Reviews component - received reviews:", reviews); // Debug log

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Community Reviews</h3>
      <div className="grid gap-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{review.userName}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(review.date).toLocaleDateString()}
                </div>
              </div>
              <p className="mt-2 text-gray-600">{review.comment}</p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};