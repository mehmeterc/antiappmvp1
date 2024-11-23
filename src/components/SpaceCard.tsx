import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Wifi, Plug, Coffee, Baby, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SpaceCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  occupancy: string;
  price: string;
  amenities: string[];
  tags: string[];
}

export const SpaceCard = ({
  id,
  title,
  description,
  image,
  rating,
  occupancy,
  price,
  amenities,
  tags
}: SpaceCardProps) => {
  const navigate = useNavigate();
  
  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "wifi":
        return <Wifi className="w-4 h-4" />;
      case "power":
        return <Plug className="w-4 h-4" />;
      case "coffee":
        return <Coffee className="w-4 h-4" />;
      case "quiet":
        return <Volume2 className="w-4 h-4" />;
      case "baby":
        return <Baby className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg cursor-pointer" onClick={() => navigate(`/cafe/${id}`)}>
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 flex items-center gap-1">
          <span className="text-yellow-400">★</span>
          <span className="font-medium">{rating}</span>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          <Badge variant={occupancy.includes("Full") ? "destructive" : "secondary"}>
            {occupancy}
          </Badge>
        </div>

        <div className="flex gap-2">
          {amenities.map((amenity, i) => (
            <span key={i} className="text-gray-600">
              {getAmenityIcon(amenity)}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          {tags.map((tag, i) => (
            <Badge key={i} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="font-medium">{price}</span>
          <div className="space-x-2">
            <Button variant="outline">Tour</Button>
            <Button>Book Now</Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
