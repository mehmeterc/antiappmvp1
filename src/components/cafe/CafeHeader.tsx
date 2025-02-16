
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { AddressLink } from "@/components/AddressLink";
import { Cafe } from "@/types/cafe";

interface CafeHeaderProps {
  cafe: Cafe;
  isSaved: boolean;
  onSave: (e: React.MouseEvent) => void;
}

const DEFAULT_IMAGE = "/lovable-uploads/8c16ce15-095a-4bab-8db3-84b0810b0853.png";

export const CafeHeader = ({ cafe, isSaved, onSave }: CafeHeaderProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = DEFAULT_IMAGE;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-96">
        <img
          src={cafe.image_url || DEFAULT_IMAGE}
          alt={cafe.title}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-white/80 hover:bg-white"
          onClick={onSave}
        >
          <Bookmark className="h-5 w-5" fill={isSaved ? "currentColor" : "none"} />
        </Button>
        <div className="absolute top-4 left-4 bg-white rounded-full px-3 py-1 flex items-center gap-1">
          <span className="text-yellow-400">★</span>
          <span className="font-medium">{cafe.rating}</span>
        </div>
      </div>

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-2">{cafe.title}</h1>
        <AddressLink 
          address={cafe.address} 
          cafeName={cafe.title}
          className="text-gray-600" 
        />
      </div>
    </div>
  );
};
