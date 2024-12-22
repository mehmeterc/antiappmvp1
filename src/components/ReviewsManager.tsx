import { useEffect, useState } from "react";
import { Review } from "@/types/cafe";
import { Reviews } from "./Reviews";

interface ReviewsManagerProps {
  cafeId: string;
  initialReviews?: Review[];
}

export const ReviewsManager = ({ cafeId, initialReviews = [] }: ReviewsManagerProps) => {
  const [allReviews, setAllReviews] = useState<Review[]>(initialReviews);

  useEffect(() => {
    // Get reviews from booking history
    const bookingHistory = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
    const historyReviews = bookingHistory
      .filter((booking: any) => booking.cafeId === cafeId && booking.review)
      .map((booking: any) => ({
        id: `hist_${booking.id}`,
        userId: booking.deviceId || 'anonymous',
        userName: "Anonymous User",
        rating: booking.review.rating,
        comment: booking.review.comment,
        date: booking.review.date
      }));

    console.log("ReviewsManager - History reviews:", historyReviews);
    console.log("ReviewsManager - Initial reviews:", initialReviews);

    // Merge reviews, avoiding duplicates by ID
    const mergedReviews = [...initialReviews];
    historyReviews.forEach(historyReview => {
      if (!mergedReviews.some(review => review.id === historyReview.id)) {
        mergedReviews.push(historyReview);
      }
    });

    console.log("ReviewsManager - Merged reviews:", mergedReviews);
    setAllReviews(mergedReviews);

    // Update the cafe's reviews in localStorage
    const storedCafes = JSON.parse(localStorage.getItem('BERLIN_CAFES') || '[]');
    const updatedCafes = storedCafes.map((c: any) => {
      if (c.id === cafeId) {
        return {
          ...c,
          reviews: mergedReviews
        };
      }
      return c;
    });
    localStorage.setItem('BERLIN_CAFES', JSON.stringify(updatedCafes));
  }, [cafeId, initialReviews]);

  return <Reviews reviews={allReviews} />;
};