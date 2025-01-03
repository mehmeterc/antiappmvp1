import { Clock, Euro, Volume2 } from "lucide-react";
import { Cafe } from "@/types/cafe";

interface CafeInfoProps {
  cafe: Cafe;
  pricePerHour: number;
}

export const CafeInfo = ({ cafe, pricePerHour }: CafeInfoProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-gray-600" />
        <span>Open 9:00 - 18:00</span>
      </div>
      <div className="flex items-center gap-2">
        <Euro className="w-4 h-4 text-gray-600" />
        <span>
          {pricePerHour}€/hour ({cafe.price.includes('€€€') ? 'Private Space' : cafe.price.includes('€€') ? 'Premium Desk' : 'Basic Desk'})
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Volume2 className="w-4 h-4 text-gray-600" />
        <span>{cafe.occupancy}</span>
      </div>
    </div>
  );
};