import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AddressLink } from "./AddressLink";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

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
  const session = useSession();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkIfSaved = async () => {
      if (!session?.user?.id) return;

      try {
        const { data, error } = await supabase
          .from('saved_cafes')
          .select('id')
          .eq('cafe_id', id)
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (error) throw error;
        setIsSaved(!!data);
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    };

    checkIfSaved();
  }, [id, session?.user?.id]);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!session?.user?.id) {
      toast.error("Please log in to save cafes");
      return;
    }

    setLoading(true);
    try {
      if (!isSaved) {
        const { error } = await supabase
          .from('saved_cafes')
          .insert({
            user_id: session.user.id,
            cafe_id: id
          });

        if (error) throw error;
        setIsSaved(true);
        toast.success("Cafe saved!");
      } else {
        const { error } = await supabase
          .from('saved_cafes')
          .delete()
          .eq('cafe_id', id)
          .eq('user_id', session.user.id);

        if (error) throw error;
        setIsSaved(false);
        toast.success("Cafe removed from saved spaces");
      }
    } catch (error) {
      console.error('Error saving cafe:', error);
      toast.error("Failed to update saved status");
    } finally {
      setLoading(false);
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
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = "https://images.unsplash.com/photo-1554118811-1e0d58224f24";
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-4 right-4 bg-white/90 hover:bg-white shadow-md transition-colors",
              isSaved ? "text-[#0D9F6C] hover:text-[#0D9F6C]" : "text-gray-500 hover:text-gray-700"
            )}
            onClick={handleSave}
            disabled={loading}
          >
            <Bookmark className={cn("h-5 w-5", isSaved ? "fill-current" : "fill-none")} />
          </Button>
          <div className="absolute top-4 left-4 bg-white/90 rounded-full px-2 py-1 text-sm font-medium">
            ⭐️ {rating}
          </div>
        </div>
        <CardHeader>
          <h3 className="text-lg font-semibold">{title}</h3>
          <AddressLink 
            address={address} 
            cafeName={title}
            className="text-sm text-gray-500" 
          />
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