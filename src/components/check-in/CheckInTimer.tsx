import { format } from "date-fns";

interface CheckInTimerProps {
  checkInTime: Date;
  elapsedTime: number;
  totalCost: number;
  pricePerHour: number;
}

export const CheckInTimer = ({ checkInTime, elapsedTime, totalCost, pricePerHour }: CheckInTimerProps) => {
  return (
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
  );
};