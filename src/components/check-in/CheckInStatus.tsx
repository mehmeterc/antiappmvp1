import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { CheckInTimer } from "./CheckInTimer";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Cafe } from "@/types/cafe";

interface CheckInStatusProps {
  cafeId: string;
}

const CheckInStatus = ({ cafeId }: CheckInStatusProps) => {
  const session = useSession();
  const navigate = useNavigate();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [loading, setLoading] = useState(true);
  
  const getHourlyRate = (priceStr: string) => {
    const priceLevel = (priceStr.match(/€/g) || []).length;
    switch (priceLevel) {
      case 1: return 2;  // Budget-friendly
      case 2: return 4;  // Mid-range
      case 3: return 6;  // Premium
      default: return 2;
    }
  };

  useEffect(() => {
    const fetchCafe = async () => {
      try {
        setLoading(true);
        console.log("Fetching cafe details for ID:", cafeId);

        const { data: cafeData, error } = await supabase
          .from('cafes')
          .select('*')
          .eq('id', cafeId)
          .maybeSingle();

        if (error) {
          console.error("Error fetching cafe:", error);
          toast.error("Failed to load cafe details");
          navigate('/');
          return;
        }

        if (!cafeData) {
          console.error("Cafe not found:", cafeId);
          toast.error("Cafe not found");
          navigate('/');
          return;
        }

        console.log("Found cafe:", cafeData);
        setCafe(cafeData);

        // Check if user is already checked in
        if (session?.user?.id) {
          const { data: activeBooking } = await supabase
            .from('booking_history')
            .select('*')
            .eq('cafe_id', cafeId)
            .eq('user_id', session.user.id)
            .eq('status', 'Active')
            .maybeSingle();
          
          if (activeBooking) {
            setCheckInTime(new Date(activeBooking.check_in_time));
            setIsCheckedIn(true);
            console.log("Found active booking:", activeBooking);
          }
        }

      } catch (err) {
        console.error("Error in fetchCafe:", err);
        toast.error("Failed to load cafe details");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (cafeId) {
      fetchCafe();
    }
  }, [cafeId, session?.user?.id, navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCheckedIn && checkInTime && cafe) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - checkInTime.getTime()) / 1000);
        setElapsedTime(elapsed);
        
        const hoursElapsed = elapsed / 3600;
        const pricePerHour = getHourlyRate(cafe.price);
        const cost = pricePerHour * hoursElapsed;
        setTotalCost(Math.max(0, Math.round(cost * 100) / 100));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn, checkInTime, cafe]);

  const handleCheckInOut = async () => {
    if (!session?.user?.id || !cafe) {
      toast.error("Please log in to check in");
      return;
    }

    const now = new Date();

    if (!isCheckedIn) {
      const { error: insertError } = await supabase
        .from('booking_history')
        .insert({
          user_id: session.user.id,
          cafe_id: cafeId,
          cafe_name: cafe.title,
          check_in_time: now.toISOString(),
          status: 'Active'
        });

      if (insertError) {
        console.error("Error checking in:", insertError);
        toast.error("Failed to check in");
        return;
      }

      setCheckInTime(now);
      setIsCheckedIn(true);
      toast.success("Successfully checked in!");
    } else {
      const { error: updateError } = await supabase
        .from('booking_history')
        .update({
          check_out_time: now.toISOString(),
          status: 'Completed',
          total_cost: Number(totalCost.toFixed(2))
        })
        .eq('cafe_id', cafeId)
        .eq('user_id', session.user.id)
        .eq('status', 'Active');

      if (updateError) {
        console.error("Error checking out:", updateError);
        toast.error("Failed to check out");
        return;
      }

      setIsCheckedIn(false);
      setCheckInTime(null);
      toast.success(`Checked out! Total cost: ${totalCost.toFixed(2)}€`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cafe details...</p>
        </div>
      </div>
    );
  }

  if (!cafe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cafe not found</h2>
          <p className="text-gray-600">The cafe you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
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
            <p className="text-sm text-gray-600 mt-2">
              Rate: {getHourlyRate(cafe.price)}€/hour
            </p>
          </div>

          {isCheckedIn && checkInTime && (
            <CheckInTimer
              checkInTime={checkInTime}
              elapsedTime={elapsedTime}
              totalCost={totalCost}
              pricePerHour={getHourlyRate(cafe.price)}
            />
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