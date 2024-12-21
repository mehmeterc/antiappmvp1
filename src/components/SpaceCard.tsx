import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Bookmark } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { AddressLink } from "./AddressLink";

interface SpaceCardProps {
  id: string;
  title: string;
  description: string;
  rating: number;
  image: string;
  address: string;
  amenities: string[];
  isDetailed?: boolean;
}

export const SpaceCard = ({ id, title, description, rating, image, address, amenities, isDetailed }: SpaceCardProps) => {
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedCafes = JSON.parse(localStorage.getItem('savedCafes') || '[]');
    const isAlreadySaved = savedCafes.some((cafe: { id: string }) => cafe.id === id);
    setIsSaved(isAlreadySaved);
  }, [id]);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsSaved(!isSaved);
    
    const savedCafes = JSON.parse(localStorage.getItem('savedCafes') || '[]');
    if (!isSaved) {
      localStorage.setItem('savedCafes', JSON.stringify([...savedCafes, { id, title, description, rating, image, address, amenities }]));
      toast({
        title: "Cafe saved!",
        description: "Added to your saved spaces.",
      });
    } else {
      localStorage.setItem('savedCafes', JSON.stringify(savedCafes.filter((cafe: { id: string }) => cafe.id !== id)));
      toast({
        title: "Cafe removed",
        description: "Removed from your saved spaces.",
      });
    }
  };

  return (
    <Link to={`/cafe/${id}`}>
      <Card className="overflow-hidden h-full group relative">
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover"
          />
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-4 right-4 bg-white/90 hover:bg-white shadow-md transition-colors",
              isSaved ? "text-[#0D9F6C] hover:text-[#0D9F6C]" : "text-gray-500 hover:text-gray-700"
            )}
            onClick={handleSave}
          >
            <Bookmark className={cn("h-5 w-5", isSaved ? "fill-current" : "fill-none")} />
          </Button>
          <div className="absolute top-4 left-4 bg-white/90 rounded-full px-2 py-1 text-sm font-medium">
            ⭐️ {rating}
          </div>
        </div>
        <CardHeader>
          <h3 className="text-lg font-semibold">{title}</h3>
          <AddressLink address={address} className="text-sm text-gray-500" />
        </CardHeader>
        {isDetailed && (
          <CardContent>
            <p className="text-sm text-gray-600">{description}</p>
          </CardContent>
        )}
        <CardFooter className="flex gap-2 flex-wrap">
          {amenities.slice(0, 3).map((amenity) => (
            <Badge key={amenity} variant="secondary">
              {amenity}
            </Badge>
          ))}
        </CardFooter>
      </Card>
    </Link>
  );
};