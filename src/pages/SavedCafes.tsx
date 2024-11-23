import { SpaceCard } from "@/components/SpaceCard";
import { BERLIN_CAFES } from "@/data/mockCafes";

const SavedCafes = () => {
  // Mock saved cafes (first 2 from our mock data)
  const savedCafes = BERLIN_CAFES.slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Saved Spaces</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedCafes.map((cafe) => (
          <SpaceCard key={cafe.id} {...cafe} />
        ))}
      </div>
    </div>
  );
};

export default SavedCafes;