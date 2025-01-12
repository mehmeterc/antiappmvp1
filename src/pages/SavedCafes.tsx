import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { SpaceCard } from "@/components/SpaceCard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Cafe } from "@/types/cafe";

const SavedCafes = () => {
  const session = useSession();

  const fetchSavedCafes = async () => {
    if (!session?.user?.id) return [];

    // First get the saved cafe IDs
    const { data: savedCafes, error: savedError } = await supabase
      .from('saved_cafes')
      .select('cafe_id')
      .eq('user_id', session.user.id);

    if (savedError) {
      console.error('Error fetching saved cafes:', savedError);
      return [];
    }

    if (!savedCafes.length) return [];

    // Then get the actual cafe details
    const { data: cafes, error: cafesError } = await supabase
      .from('cafes')
      .select('*')
      .in('id', savedCafes.map(sc => sc.cafe_id));

    if (cafesError) {
      console.error('Error fetching cafe details:', cafesError);
      return [];
    }

    return cafes.map(cafe => ({
      id: cafe.id,
      title: cafe.title,
      description: cafe.description,
      rating: cafe.rating,
      image: cafe.image_url,
      address: cafe.address,
      amenities: cafe.amenities,
      coordinates: {
        lat: cafe.lat,
        lng: cafe.lng
      }
    }));
  };

  const { data: savedCafes = [], isLoading } = useQuery({
    queryKey: ['savedCafes', session?.user?.id],
    queryFn: fetchSavedCafes,
    enabled: !!session?.user?.id
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-500">Loading saved spaces...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Saved Spaces</h1>
      {savedCafes.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No saved spaces yet. Start exploring to save your favorite cafes!
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedCafes.map((cafe: Cafe) => (
            <SpaceCard 
              key={cafe.id}
              id={cafe.id}
              title={cafe.title}
              description={cafe.description}
              rating={cafe.rating}
              image={cafe.image}
              address={cafe.address}
              amenities={cafe.amenities}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedCafes;