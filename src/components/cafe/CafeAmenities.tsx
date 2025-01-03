import { Badge } from "@/components/ui/badge";
import { Wifi, Coffee, Plug, Baby, Volume2 } from "lucide-react";

const getAmenityIcon = (amenity: string) => {
  switch (amenity.toLowerCase()) {
    case 'wifi':
      return <Wifi className="h-4 w-4" />;
    case 'coffee':
      return <Coffee className="h-4 w-4" />;
    case 'power':
      return <Plug className="h-4 w-4" />;
    case 'baby':
      return <Baby className="h-4 w-4" />;
    case 'quiet':
      return <Volume2 className="h-4 w-4" />;
    default:
      return null;
  }
};

interface CafeAmenitiesProps {
  amenities: string[];
}

export const CafeAmenities = ({ amenities }: CafeAmenitiesProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {amenities.map((amenity, i) => (
        <Badge key={i} variant="secondary" className="flex items-center gap-1">
          {getAmenityIcon(amenity)}
          {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
        </Badge>
      ))}
    </div>
  );
};