
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Cafe } from "@/types/cafe";

type SpaceCardProps = Cafe;

const DEFAULT_IMAGE = "/lovable-uploads/8c16ce15-095a-4bab-8db3-84b0810b0853.png";

export const SpaceCard = ({ 
  id, 
  title, 
  description, 
  rating, 
  image_url, 
  address, 
  amenities, 
  lat, 
  lng, 
  distance 
}: SpaceCardProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = DEFAULT_IMAGE;
  };

  return (
    <Link to={`/cafe/${id}`} className="group hover:opacity-95 transition-opacity">
      <Card className="overflow-hidden h-full border-none shadow-md">
        <div className="relative h-48">
          <img
            src={image_url || DEFAULT_IMAGE}
            alt={title}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              {rating}
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-lg">{title}</h3>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {address}
            </p>
            {distance && (
              <p className="text-sm text-muted-foreground">
                {distance.toFixed(1)} km away
              </p>
            )}
          </div>
          <div className="flex gap-2 mt-3">
            {amenities.slice(0, 3).map((amenity) => (
              <Badge key={amenity} variant="outline">
                {amenity}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  );
};
