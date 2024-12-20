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
  
  const getHourlyRate = (priceStr: string) => {
    const priceLevel = (priceStr.match(/€/g) || []).length;
    switch (priceLevel) {
      case 1: return 5;  // Basic desk
      case 2: return 10; // Premium desk
      case 3: return 30; // Private space
      default: return 5;
    }
  };

  const pricePerHour = cafe ? getHourlyRate(cafe.price) : 5;

  // Function to generate a unique device ID
  const getDeviceId = () => {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  };

  useEffect(() => {
    console.log("Checking stored check-in status for cafe:", id);
    // Check all possible device IDs in localStorage
    const allKeys = Object.keys(localStorage);
    const checkInKey = allKeys.find(key => key.startsWith(`checkin-${id}`));
    
    if (checkInKey) {
      const storedCheckIn = localStorage.getItem(checkInKey);
      if (storedCheckIn) {
        const { timestamp } = JSON.parse(storedCheckIn);
        console.log("Found stored check-in timestamp:", timestamp);
        setCheckInTime(new Date(timestamp));
        setIsCheckedIn(true);
      }
    }
  }, [id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCheckedIn && checkInTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - checkInTime.getTime()) / 1000);
        setElapsedTime(elapsed);
        
        const hoursElapsed = elapsed / 3600;
        const cost = pricePerHour * hoursElapsed;
        setTotalCost(Math.max(0, Math.round(cost * 100) / 100));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn, checkInTime, pricePerHour]);

  const handleCheckInOut = () => {
    const deviceId = getDeviceId();
    const now = new Date();

    if (!isCheckedIn) {
      setCheckInTime(now);
      setIsCheckedIn(true);
      
      // Store with device ID
      const checkInData = { timestamp: now.toISOString(), deviceId };
      localStorage.setItem(`checkin-${id}-${deviceId}`, JSON.stringify(checkInData));
      
      // Save to history with device ID
      const historyItem = {
        id: Date.now(),
        deviceId,
        cafeId: id,
        cafeName: cafe?.title || 'Unknown Cafe',
        checkInTime: now.toISOString(),
        status: 'Active'
      };
      
      const history = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
      localStorage.setItem('bookingHistory', JSON.stringify([...history, historyItem]));
      console.log("Added new check-in to history:", historyItem);
      
      toast.success("Successfully checked in!");
    } else {
      // Update history when checking out
      const history = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
      const updatedHistory = history.map((item: any) => {
        if (item.cafeId === id && item.status === 'Active' && (!item.deviceId || item.deviceId === deviceId)) {
          return {
            ...item,
            deviceId,
            checkOutTime: now.toISOString(),
            status: 'Completed',
            totalCost: Number(totalCost.toFixed(2))
          };
        }
        return item;
      });
      
      localStorage.setItem('bookingHistory', JSON.stringify(updatedHistory));
      console.log("Updated history with check-out:", updatedHistory);

      // Remove check-in status
      localStorage.removeItem(`checkin-${id}-${deviceId}`);
      setIsCheckedIn(false);
      setCheckInTime(null);
      toast.success(`Checked out! Total cost: ${totalCost.toFixed(2)}€`);
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
                Current cost: {totalCost.toFixed(2)}€
              </p>
              <p className="text-sm text-gray-500">
                ({pricePerHour}€ per hour)
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