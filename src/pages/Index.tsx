
import { SearchBar } from "@/components/SearchBar";
import { SpaceCard } from "@/components/SpaceCard";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Cafe } from "@/types/cafe";
import { calculateDistance } from "@/utils/searchUtils";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const fetchTopCafes = async () => {
  console.log('Fetching top cafes from Supabase...');
  const { data, error } = await supabase
    .from('cafes')
    .select('*')
    .order('rating', { ascending: false })
    .limit(4);

  if (error) {
    console.error('Error fetching top cafes:', error);
    throw error;
  }

  console.log('Fetched top cafes:', data);
  return data as Cafe[];
};

const fetchRecentCafes = async () => {
  console.log('Fetching recent cafes from Supabase...');
  const { data, error } = await supabase
    .from('cafes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) {
    console.error('Error fetching recent cafes:', error);
    throw error;
  }

  console.log('Fetched recent cafes:', data);
  return data as Cafe[];
};

const Index = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const { data: highlightedCafes = [], isLoading: isLoadingHighlights } = useQuery({
    queryKey: ['cafes', 'highlights'],
    queryFn: fetchTopCafes,
  });

  const { data: allCafes = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ['cafes', 'recent'],
    queryFn: fetchRecentCafes,
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
    }
  }, []);

  const cafesWithDistance = allCafes.map(cafe => ({
    ...cafe,
    distance: userLocation 
      ? calculateDistance(userLocation.lat, userLocation.lng, cafe.lat, cafe.lng)
      : undefined
  }));

  if (isLoadingHighlights || isLoadingAll) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading spaces...</p>
        </div>
      </div>
    );
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

        {highlightedCafes.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Highlights of the Week</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {highlightedCafes.map((cafe) => (
                <SpaceCard key={cafe.id} {...cafe} />
              ))}
            </div>
          </section>
        )}

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Available Spaces</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cafesWithDistance.map((cafe) => (
              <SpaceCard key={cafe.id} {...cafe} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
