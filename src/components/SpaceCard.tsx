import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { useState, useEffect } from "react";

interface SpaceCardProps {
  id: string;
  title: string;
  description: string;
  rating: number;
  image: string;
  address: string;
  amenities: string[];
}

export const SpaceCard = ({ id, title, description, rating, image, address, amenities }: SpaceCardProps) => {
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);

  // Check if the cafe is saved when component mounts
  useEffect(() => {
    const savedCafes = JSON.parse(localStorage.getItem('savedCafes') || '[]');
    const isAlreadySaved = savedCafes.some((cafe: { id: string }) => cafe.id === id);
    setIsSaved(isAlreadySaved);
  }, [id]);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the bookmark
    setIsSaved(!isSaved);
    
    // In a real app, this would interact with a backend
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
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="p-0">
          <div className="relative h-48">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-2 right-2 bg-white/80 hover:bg-white ${
                isSaved ? 'text-primary' : 'text-gray-500'
              }`}
              onClick={handleSave}
            >
              <Bookmark className="h-5 w-5" fill={isSaved ? "currentColor" : "none"} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            <Badge variant="secondary">★ {rating}</Badge>
          </div>
          <p className="text-sm text-gray-600 mb-2">{address}</p>
          <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex flex-wrap gap-2">
            {amenities.slice(0, 3).map((amenity) => (
              <Badge key={amenity} variant="outline">
                {amenity}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};