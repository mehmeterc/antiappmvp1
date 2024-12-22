import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

interface Review {
  cafeId: string;
  cafeName: string;
  rating: number;
  comment: string;
  date: string;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const bookingHistory = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
    const userReviews = bookingHistory
      .filter((booking: any) => booking.review)
      .map((booking: any) => ({
        cafeId: booking.cafeId,
        cafeName: booking.cafeName,
        rating: booking.review.rating,
        comment: booking.review.comment,
        date: booking.review.date
      }));
    
    setReviews(userReviews);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Reviews</h1>
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              You haven't written any reviews yet.
            </p>
          ) : (
            reviews.map((review, index) => (
              <Card key={index} className="p-4">
                <Link 
                  to={`/cafe/${review.cafeId}`}
                  className="text-lg font-semibold hover:text-primary"
                >
                  {review.cafeName}
                </Link>
                <div className="flex items-center gap-1 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-2 text-gray-600">{review.comment}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Reviews;