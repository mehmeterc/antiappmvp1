import { useState } from "react";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { addDays, format } from "date-fns";

interface BookingFormProps {
  cafeId: string;
  price: string;
}

export const BookingForm = ({ cafeId, price }: BookingFormProps) => {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    // Here you would typically make an API call to process the booking
    toast.success("Booking successful!", {
      description: `Your space has been booked from ${format(checkIn, 'PP')} to ${format(checkOut, 'PP')}`,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <h3 className="text-xl font-semibold">Book Your Space</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Check-in Date</label>
          <Calendar
            mode="single"
            selected={checkIn}
            onSelect={setCheckIn}
            disabled={(date) => date < new Date()}
            className="rounded-md border"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Check-out Date</label>
          <Calendar
            mode="single"
            selected={checkOut}
            onSelect={setCheckOut}
            disabled={(date) => !checkIn || date <= checkIn || date < addDays(checkIn, 1)}
            className="rounded-md border"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div>
          <p className="text-sm text-gray-500">Price per day</p>
          <p className="text-2xl font-bold">{price}</p>
        </div>
        <Button 
          size="lg"
          onClick={handleBooking}
          className="px-8"
        >
          Book Now
        </Button>
      </div>
    </div>
  );
};