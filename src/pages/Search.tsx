import { useEffect, useState } from "react";
import { SpaceCard } from "@/components/SpaceCard";
import { useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { calculateDistance } from "@/utils/searchUtils";
import { Cafe } from "@/types/cafe";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Search = () => {
  const location = useLocation();
  const { filters = [], searchTerm = "", priceRange = [0, 12] } = location.state || {};
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const { data: cafes = [], isLoading } = useQuery({
    queryKey: ['search', searchTerm, filters, priceRange],
    queryFn: async () => {
      let query = supabase.from('cafes').select('*');

      // Apply text search with prioritization if there's a search term
      if (searchTerm.length > 0) {
        const normalizedSearchTerm = searchTerm.toLowerCase().trim();
        
        // First try exact title matches for more accuracy
        const { data: titleMatches } = await supabase
          .from('cafes')
          .select('*')
          .ilike('title', `%${normalizedSearchTerm}%`);
          
        if (titleMatches && titleMatches.length > 0) {
          console.log('Found exact title matches:', titleMatches.length);
          return titleMatches;
        }
        
        // Otherwise, search more broadly
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`);
      }
      
      // Apply amenities filter if selected
      if (filters.length > 0) {
        query = query.contains('amenities', filters);
      }

      // Apply price range filter
      query = query.gte('price', priceRange[0].toString())
                  .lte('price', priceRange[1].toString());

      const { data, error } = await query;
      
      if (error) {
        console.error('Search error:', error);
        toast.error("Error fetching cafes");
        return [];
      }
      
      return data as Cafe[];
    },
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
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

  const cafesWithDistance = cafes.map(cafe => ({
    ...cafe,
    distance: userLocation 
      ? calculateDistance(userLocation.lat, userLocation.lng, cafe.lat, cafe.lng)
      : undefined
  })).sort((a, b) => (a.distance || 0) - (b.distance || 0));

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cafesWithDistance.map((cafe) => (
          <SpaceCard key={cafe.id} {...cafe} />
        ))}
        {cafesWithDistance.length === 0 && (
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700">No spaces found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
