import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { format, addHours, setHours, setMinutes } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface BookingFormProps {
  cafeId: string;
  price: string;
}

export const BookingForm = ({ cafeId, price }: BookingFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<string>("");
  const [duration, setDuration] = useState<number>(1);

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const handleBooking = () => {
    if (!startTime) {
      toast.error("Please select a start time");
      return;
    }

    const [hours] = startTime.split(':').map(Number);
    const bookingStart = setHours(setMinutes(selectedDate, 0), hours);
    const bookingEnd = addHours(bookingStart, duration);

    toast.success("Booking successful!", {
      description: `Your space has been booked for ${duration} hour${duration > 1 ? 's' : ''} on ${format(bookingStart, 'PP')} from ${format(bookingStart, 'HH:mm')} to ${format(bookingEnd, 'HH:mm')}`,
    });
  };

  // Convert price string (e.g., "€€" or "€€€") to a number
  const getPriceValue = (priceStr: string) => {
    const priceLevel = priceStr.replace(/[^€]/g, '').length;
    return priceLevel * 10; // €€ = 20, €€€ = 30
  };

  const priceValue = getPriceValue(price);
  const totalPrice = priceValue * duration;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <h3 className="text-xl font-semibold">Book Your Space</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Start Time</label>
          <Select value={startTime} onValueChange={setStartTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select start time" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Duration (hours)</label>
          <Select 
            value={duration.toString()} 
            onValueChange={(value) => setDuration(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((hours) => (
                <SelectItem key={hours} value={hours.toString()}>
                  {hours} hour{hours > 1 ? 's' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div>
          <p className="text-sm text-gray-500">Total Price</p>
          <p className="text-2xl font-bold">{totalPrice}€</p>
          <p className="text-sm text-gray-500">({priceValue}€/hour × {duration} hours)</p>
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