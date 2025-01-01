import { format, formatDistanceStrict, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingCardProps {
  booking: {
    id: string;
    cafe_id: string;
    cafe_name: string;
    check_in_time: string;
    check_out_time?: string;
    status: string;
    total_cost?: number;
  };
}

export const BookingCard = ({ booking }: BookingCardProps) => {
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
    <Card className="hover:shadow-lg transition-shadow">
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
            <span>{formatDateTime(booking.check_in_time)}</span>
          </div>
          
          {booking.check_out_time && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-500">Check-out:</span>
                <span>{formatDateTime(booking.check_out_time)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration:</span>
                <span>{getDuration(booking.check_in_time, booking.check_out_time)}</span>
              </div>
            </>
          )}
          
          {booking.total_cost !== undefined && (
            <div className="flex justify-between font-medium mt-2 pt-2 border-t">
              <span>Total Cost:</span>
              <span>{booking.total_cost.toFixed(2)}€</span>
            </div>
          )}

          {booking.status === "Active" && (
            <Link to={`/check-in/${booking.cafe_id}`}>
              <Button variant="secondary" className="w-full mt-4">
                Return to Check-in
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
};