import { SearchBar } from "@/components/SearchBar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Cafe } from "@/types/cafe";
import { calculateDistance } from "@/utils/searchUtils";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const fetchCafes = async () => {
  console.log('Fetching cafes from Supabase...');
  const { data, error } = await supabase
    .from('cafes')
    .select('*');

  if (error) {
    console.error('Error fetching cafes:', error);
    throw error;
  }

  console.log('Fetched cafes:', data);
  return data as Cafe[];
};

const Index = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [cafesWithDistance, setCafesWithDistance] = useState<Cafe[]>([]);

  const { data: cafes, isLoading, error } = useQuery({
    queryKey: ['cafes'],
    queryFn: fetchCafes,
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Got user location:", position.coords);
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not get your location. Distances will not be shown.");
        }
      );
    } else {
      console.log("Geolocation not supported");
      toast.error("Your browser doesn't support geolocation. Distances will not be shown.");
    }
  }, []);

  useEffect(() => {
    if (cafes && userLocation) {
      const cafesWithDistances = cafes.map(cafe => ({
        ...cafe,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          cafe.lat,
          cafe.lng
        )
      }));

      cafesWithDistances.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      setCafesWithDistance(cafesWithDistances);
    } else if (cafes) {
      setCafesWithDistance(cafes);
    }
  }, [userLocation, cafes]);

  // Get top rated cafes for highlights
  const highlightedCafes = cafesWithDistance
    .filter(cafe => cafe.rating >= 4.7)
    .slice(0, 4);

  // Get all cafes for the main list
  const allCafes = cafesWithDistance.slice(0, 8);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cafes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading cafes:', error);
    toast.error("Failed to load cafes. Please try again later.");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6 fade-in">
          <h1 className="text-4xl md:text-6xl font-bold">
            Find Your Perfect Third Place
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Discover cafes, libraries, and community spaces perfect for remote work and connection.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 space-y-12 pb-16">
        <SearchBar />

        {/* Highlights of the Week */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Highlights of the Week</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {highlightedCafes.map((cafe) => (
              <Link 
                key={cafe.id} 
                to={`/cafe/${cafe.id}`}
                className="group hover:opacity-95 transition-opacity"
              >
                <Card className="overflow-hidden border-none shadow-md">
                  <div className="relative h-32">
                    <img
                      src={cafe.image_url}
                      alt={cafe.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {cafe.rating}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm truncate">{cafe.title}</h3>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {cafe.address.split(',')[0]}
                      </p>
                      {cafe.distance && (
                        <p className="text-xs text-muted-foreground">
                          {cafe.distance} km away
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* All Available Spaces */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Available Spaces</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCafes.map((cafe) => (
              <Link 
                key={cafe.id} 
                to={`/cafe/${cafe.id}`}
                className="group hover:opacity-95 transition-opacity"
              >
                <Card className="overflow-hidden h-full border-none shadow-md">
                  <div className="relative h-48">
                    <img
                      src={cafe.image_url}
                      alt={cafe.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {cafe.rating}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-lg">{cafe.title}</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {cafe.address}
                      </p>
                      {cafe.distance && (
                        <p className="text-sm text-muted-foreground">
                          {cafe.distance} km away
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3">
                      {cafe.amenities.slice(0, 3).map((amenity) => (
                        <Badge key={amenity} variant="outline">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;