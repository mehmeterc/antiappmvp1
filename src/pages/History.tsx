import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, parseISO } from "date-fns";

interface HistoryItem {
  id: number;
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
    const storedHistory = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
    setHistory(storedHistory.sort((a: HistoryItem, b: HistoryItem) => 
      new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime()
    ));
  }, []);

  const formatDateTime = (dateStr: string) => {
    return format(parseISO(dateStr), 'PPp');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Booking History</h1>
      <ScrollArea className="h-[600px] rounded-md border p-4">
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No booking history yet. Start by checking in to a cafe!
            </div>
          ) : (
            history.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{booking.cafeName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-500">Check-in:</span>
                    <span>{formatDateTime(booking.checkInTime)}</span>
                    
                    {booking.checkOutTime && (
                      <>
                        <span className="text-gray-500">Check-out:</span>
                        <span>{formatDateTime(booking.checkOutTime)}</span>
                      </>
                    )}
                    
                    <span className="text-gray-500">Status:</span>
                    <span className={booking.status === "Completed" ? "text-green-600" : "text-blue-600"}>
                      {booking.status}
                    </span>
                    
                    {booking.totalCost !== undefined && (
                      <>
                        <span className="text-gray-500">Total Cost:</span>
                        <span>€{booking.totalCost.toFixed(2)}</span>
                      </>
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