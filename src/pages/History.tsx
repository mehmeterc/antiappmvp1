
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import { ArrowUpRight, Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

interface HistoryItem {
  id: string;
  cafe_id: string;
  cafe_name: string;
  check_in_time: string;
  check_out_time?: string;
  status: 'Active' | 'Completed';
  total_cost?: number;
  review?: {
    rating: number;
    comment: string;
    date: string;
  };
}

// Define the database response type
interface BookingHistoryRow {
  id: string;
  cafe_id: string;
  cafe_name: string;
  check_in_time: string;
  check_out_time: string | null;
  status: string;
  total_cost: number | null;
  user_id: string;
  created_at: string | null;
}

interface ReviewRow {
  id: string;
  cafe_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

const AddReviewDialog = ({ booking, onReviewSubmit }: { 
  booking: HistoryItem;
  onReviewSubmit: (bookingId: string, rating: number, comment: string) => void;
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    onReviewSubmit(booking.id, rating, comment);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Review your visit to {booking.cafe_name}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 pt-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Review</label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            className="min-h-[100px]"
          />
        </div>
        <Button onClick={handleSubmit} className="w-full">
          Submit Review
        </Button>
      </div>
    </DialogContent>
  );
};

const History = () => {
  const session = useSession();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!session?.user?.id) return;

      try {
        setIsLoading(true);
        const { data: bookings, error: bookingsError } = await supabase
          .from('booking_history')
          .select('*')
          .order('check_in_time', { ascending: false });

        if (bookingsError) throw bookingsError;

        // Fetch reviews for these bookings
        const { data: reviews, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .in('cafe_id', bookings?.map(b => b.cafe_id) || []);

        if (reviewsError) throw reviewsError;

        // Transform and validate the data to match HistoryItem type
        const historyWithReviews: HistoryItem[] = (bookings as BookingHistoryRow[])?.map(booking => {
          const review = (reviews as ReviewRow[])?.find(r => r.cafe_id === booking.cafe_id);
          
          // Ensure status is either 'Active' or 'Completed'
          const validStatus = booking.status === 'Active' || booking.status === 'Completed' 
            ? booking.status 
            : 'Active';

          return {
            id: booking.id,
            cafe_id: booking.cafe_id,
            cafe_name: booking.cafe_name,
            check_in_time: booking.check_in_time,
            check_out_time: booking.check_out_time || undefined,
            status: validStatus,
            total_cost: booking.total_cost || undefined,
            review: review ? {
              rating: review.rating,
              comment: review.comment,
              date: review.created_at
            } : undefined
          };
        });

        setHistory(historyWithReviews || []);
      } catch (error) {
        console.error("Error loading history:", error);
        toast.error("Failed to load booking history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('booking_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'booking_history'
        },
        () => {
          fetchHistory(); // Refresh the data when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id]);

  const handleReviewSubmit = async (bookingId: string, rating: number, comment: string) => {
    if (!session?.user?.id) {
      toast.error("Please log in to submit a review");
      return;
    }

    const booking = history.find(b => b.id === bookingId);
    if (!booking) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          cafe_id: booking.cafe_id,
          user_id: session.user.id,
          rating,
          comment
        });

      if (error) throw error;

      toast.success("Review submitted successfully!");
      
      // Update local state
      setHistory(prev => prev.map(item => {
        if (item.id === bookingId) {
          return {
            ...item,
            review: {
              rating,
              comment,
              date: new Date().toISOString()
            }
          };
        }
        return item;
      }));
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Booking History</h1>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading your booking history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Booking History</h1>
      <ScrollArea className="h-[calc(100vh-200px)] rounded-md border p-4">
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No booking history yet. Start by checking in to a cafe!
            </div>
          ) : (
            history.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">
                    <Link 
                      to={`/cafe/${booking.cafe_id}`}
                      className="hover:text-primary flex items-center gap-2"
                    >
                      {booking.cafe_name}
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </CardTitle>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    booking.status === "Completed" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {booking.status}
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Check-in:</span>
                      <span>{format(parseISO(booking.check_in_time), 'PPpp')}</span>
                    </div>
                    
                    {booking.check_out_time && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Check-out:</span>
                        <span>{format(parseISO(booking.check_out_time), 'PPpp')}</span>
                      </div>
                    )}
                    
                    {booking.total_cost !== undefined && (
                      <div className="flex justify-between font-medium mt-2 pt-2 border-t">
                        <span>Total Cost:</span>
                        <span>{booking.total_cost.toFixed(2)}€</span>
                      </div>
                    )}

                    {booking.status === "Completed" && !booking.review && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full mt-4"
                            size="sm"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Add Review
                          </Button>
                        </DialogTrigger>
                        <AddReviewDialog 
                          booking={booking} 
                          onReviewSubmit={handleReviewSubmit}
                        />
                      </Dialog>
                    )}

                    {booking.review && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-sm font-medium">Your Review:</span>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < booking.review!.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{booking.review.comment}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(parseISO(booking.review.date), 'PPpp')}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default History;
