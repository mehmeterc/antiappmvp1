import { useEffect, useState } from "react";
import { SpaceCard } from "@/components/SpaceCard";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { Cafe } from "@/types/cafe";

const SavedCafes = () => {
  const [savedCafes, setSavedCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useSession();

  useEffect(() => {
    const fetchSavedCafes = async () => {
      if (!session?.user?.id) return;

      try {
        const { data: savedData, error: savedError } = await supabase
          .from('saved_cafes')
          .select('cafe_id')
          .eq('user_id', session.user.id);

        if (savedError) throw savedError;

        if (savedData) {
          const cafeIds = savedData.map(item => item.cafe_id);
          
          const { data: cafesData, error: cafesError } = await supabase
            .from('cafes')
            .select('*')
            .in('id', cafeIds);

          if (cafesError) throw cafesError;

          setSavedCafes(cafesData || []);
        }
      } catch (error) {
        console.error('Error fetching saved cafes:', error);
        toast.error('Failed to load saved cafes');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedCafes();
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Saved Spaces</h1>
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
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
          {savedCafes.map((cafe) => (
            <SpaceCard 
              key={cafe.id}
              id={cafe.id}
              title={cafe.title}
              description={cafe.description}
              rating={cafe.rating}
              image={cafe.image_url}
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