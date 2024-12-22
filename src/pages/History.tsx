import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, parseISO, formatDistanceStrict } from "date-fns";
import { Link } from "react-router-dom";
import { ArrowUpRight, Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface HistoryItem {
  id: number;
  deviceId?: string;
  cafeId: string;
  cafeName: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'Active' | 'Completed';
  totalCost?: number;
  review?: {
    rating: number;
    comment: string;
    date: string;
  };
}

const AddReviewDialog = ({ booking, onReviewSubmit }: { 
  booking: HistoryItem;
  onReviewSubmit: (bookingId: number, rating: number, comment: string) => void;
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    onReviewSubmit(booking.id, rating, comment);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Review your visit to {booking.cafeName}</DialogTitle>
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
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const deviceId = localStorage.getItem('deviceId');
      console.log("Current device ID:", deviceId);
      
      const storedHistory = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
      console.log("All stored history:", storedHistory);
      
      const relevantHistory = storedHistory.filter((item: HistoryItem) => 
        !item.deviceId || item.deviceId === deviceId
      );
      
      const sortedHistory = relevantHistory.sort((a: HistoryItem, b: HistoryItem) => 
        new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime()
      );
      
      setHistory(sortedHistory);
    } catch (error) {
      console.error("Error loading history:", error);
      setHistory([]);
    }
  }, []);

  const handleReviewSubmit = (bookingId: number, rating: number, comment: string) => {
    const updatedHistory = history.map(item => {
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
    });

    localStorage.setItem('bookingHistory', JSON.stringify(updatedHistory));
    setHistory(updatedHistory);

    // Also update the cafe's reviews in BERLIN_CAFES
    const storedCafes = JSON.parse(localStorage.getItem('BERLIN_CAFES') || '[]');
    const updatedCafes = storedCafes.map((cafe: any) => {
      if (cafe.id === bookingId.toString()) {
        const newReview = {
          id: `r${Date.now()}`,
          userId: localStorage.getItem('deviceId') || 'anonymous',
          userName: "Anonymous User",
          rating,
          comment,
          date: new Date().toISOString()
        };
        return {
          ...cafe,
          reviews: [...(cafe.reviews || []), newReview]
        };
      }
      return cafe;
    });

    localStorage.setItem('BERLIN_CAFES', JSON.stringify(updatedCafes));
    toast.success("Review submitted successfully!");
  };

  const formatDateTime = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'PPp');
    } catch (error) {
      console.error("Error formatting date:", dateStr, error);
      return "Invalid date";
    }
  };

  const getDuration = (checkIn: string, checkOut?: string) => {
    if (!checkOut) return "Ongoing";
    try {
      return formatDistanceStrict(parseISO(checkIn), parseISO(checkOut));
    } catch (error) {
      console.error("Error calculating duration:", error);
      return "Unknown duration";
    }
  };

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
                      to={`/cafe/${booking.cafeId}`}
                      className="hover:text-primary flex items-center gap-2"
                    >
                      {booking.cafeName}
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
                      <span>{formatDateTime(booking.checkInTime)}</span>
                    </div>
                    
                    {booking.checkOutTime && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Check-out:</span>
                          <span>{formatDateTime(booking.checkOutTime)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Duration:</span>
                          <span>{getDuration(booking.checkInTime, booking.checkOutTime)}</span>
                        </div>
                      </>
                    )}
                    
                    {booking.totalCost !== undefined && (
                      <div className="flex justify-between font-medium mt-2 pt-2 border-t">
                        <span>Total Cost:</span>
                        <span>{booking.totalCost.toFixed(2)}€</span>
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
                          {formatDateTime(booking.review.date)}
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