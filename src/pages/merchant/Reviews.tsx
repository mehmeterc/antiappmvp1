import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    full_name: string;
  };
  response?: {
    response: string;
    created_at: string;
  };
}

const Reviews = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!session?.user?.id) return;

      try {
        console.log("Fetching reviews for merchant:", session.user.id);
        
        // First, get the cafes owned by this merchant through promotions
        const { data: promotions, error: promotionsError } = await supabase
          .from('promotions')
          .select('cafe_id')
          .eq('merchant_id', session.user.id);

        if (promotionsError) throw promotionsError;

        // Extract unique cafe IDs
        const cafeIds = [...new Set(promotions?.map(p => p.cafe_id) || [])];
        console.log("Merchant's cafe IDs:", cafeIds);

        if (cafeIds.length === 0) {
          console.log("No cafes found for merchant");
          setReviews([]);
          setLoading(false);
          return;
        }

        // Get reviews for all merchant's cafes
        const { data, error } = await supabase
          .from('reviews')
          .select(`
            *,
            user:profiles(full_name),
            response:review_responses(response, created_at)
          `)
          .in('cafe_id', cafeIds)
          .order('created_at', { ascending: false });

        if (error) throw error;

        console.log("Fetched reviews:", data);
        setReviews(data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [session, supabase]);

  const handleRespond = (reviewId: string) => {
    // TODO: Implement response modal
    toast.info("Response feature coming soon!");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Customer Reviews</h1>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <Card className="p-8 text-center">
            <Star className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
            <p className="text-gray-500">
              Reviews will appear here once customers start sharing their experiences.
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">
                        {review.user?.full_name || "Anonymous"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {!review.response && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRespond(review.id)}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Respond
                    </Button>
                  )}
                </div>
                <p className="text-gray-700 mb-4">{review.comment}</p>
                {review.response && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">Your Response</span>
                      <span className="text-sm text-gray-500">
                        {new Date(review.response.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600">{review.response.response}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Reviews;