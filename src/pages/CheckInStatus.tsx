import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BERLIN_CAFES } from "@/data/mockCafes";
import { format } from "date-fns";

const CheckInStatus = () => {
  const { id } = useParams();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const cafe = BERLIN_CAFES.find(c => c.id === id);
  const pricePerHour = cafe ? parseFloat(cafe?.price.replace('€', '')) : 0;

  useEffect(() => {
    // Check if there's an existing check-in status in localStorage
    const storedCheckIn = localStorage.getItem(`checkin-${id}`);
    if (storedCheckIn) {
      const { timestamp } = JSON.parse(storedCheckIn);
      setCheckInTime(new Date(timestamp));
      setIsCheckedIn(true);
    }
  }, [id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCheckedIn && checkInTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - checkInTime.getTime()) / 1000);
        setElapsedTime(elapsed);
        
        // Calculate cost (price per hour * hours elapsed)
        const hoursElapsed = elapsed / 3600;
        setTotalCost(pricePerHour * hoursElapsed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn, checkInTime, pricePerHour]);

  const handleCheckInOut = () => {
    if (!isCheckedIn) {
      const now = new Date();
      setCheckInTime(now);
      setIsCheckedIn(true);
      localStorage.setItem(`checkin-${id}`, JSON.stringify({ timestamp: now.toISOString() }));
      toast.success("Successfully checked in!");
    } else {
      setIsCheckedIn(false);
      setCheckInTime(null);
      localStorage.removeItem(`checkin-${id}`);
      toast.success(`Checked out! Total cost: €${totalCost.toFixed(2)}`);
    }
  };

  if (!cafe) {
    return <div className="p-4">Cafe not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">{cafe.title}</h1>
        
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-lg font-medium">
              Status: <span className={isCheckedIn ? "text-green-600" : "text-gray-600"}>
                {isCheckedIn ? "Checked In" : "Not Checked In"}
              </span>
            </p>
          </div>

          {isCheckedIn && checkInTime && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Check-in time: {format(checkInTime, 'PPp')}
              </p>
              <p className="text-sm text-gray-600">
                Time elapsed: {Math.floor(elapsedTime / 3600)}h {Math.floor((elapsedTime % 3600) / 60)}m {elapsedTime % 60}s
              </p>
              <p className="text-lg font-semibold">
                Current cost: €{totalCost.toFixed(2)}
              </p>
            </div>
          )}

          <Button 
            className={`w-full ${isCheckedIn ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            onClick={handleCheckInOut}
          >
            {isCheckedIn ? 'Check Out' : 'Check In'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckInStatus;