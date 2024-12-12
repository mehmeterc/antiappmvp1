import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const History = () => {
  // Mock history data - in a real app, this would come from a backend
  const mockHistory = [
    {
      id: 1,
      cafeName: "Cafe Berlin",
      date: "2024-02-20",
      time: "14:00",
      status: "Completed"
    },
    {
      id: 2,
      cafeName: "Digital Nomad Hub",
      date: "2024-02-18",
      time: "10:00",
      status: "Cancelled"
    },
    // Add more mock history items as needed
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Booking History</h1>
      <ScrollArea className="h-[600px] rounded-md border p-4">
        <div className="space-y-4">
          {mockHistory.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <CardTitle className="text-lg">{booking.cafeName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-500">Date:</span>
                  <span>{booking.date}</span>
                  <span className="text-gray-500">Time:</span>
                  <span>{booking.time}</span>
                  <span className="text-gray-500">Status:</span>
                  <span className={booking.status === "Completed" ? "text-green-600" : "text-red-600"}>
                    {booking.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default History;