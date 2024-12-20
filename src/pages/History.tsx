import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, parseISO, formatDistanceStrict } from "date-fns";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

interface HistoryItem {
  id: number;
  deviceId?: string;
  cafeId: string;
  cafeName: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'Active' | 'Completed';
  totalCost?: number;
}

const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    console.log("Current booking history in localStorage:", localStorage.getItem('bookingHistory'));
    
    try {
      // Get current device ID
      const deviceId = localStorage.getItem('deviceId');
      console.log("Current device ID:", deviceId);
      
      const storedHistory = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
      console.log("All stored history:", storedHistory);
      
      // Filter history to show items from all devices
      const relevantHistory = storedHistory.filter((item: HistoryItem) => 
        !item.deviceId || // Include items without deviceId (backward compatibility)
        item.deviceId === deviceId // Include items from current device
      );
      
      console.log("Filtered history for current device:", relevantHistory);
      
      // Sort by check-in time, most recent first
      const sortedHistory = relevantHistory.sort((a: HistoryItem, b: HistoryItem) => 
        new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime()
      );
      
      setHistory(sortedHistory);
    } catch (error) {
      console.error("Error loading history:", error);
      setHistory([]);
    }
  }, []);

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