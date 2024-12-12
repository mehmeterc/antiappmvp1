import { useEffect, useState } from "react";
import { SpaceCard } from "@/components/SpaceCard";

const SavedCafes = () => {
  const [savedCafes, setSavedCafes] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedCafes') || '[]');
    setSavedCafes(saved);
  }, []);

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
            <SpaceCard key={cafe.id} {...cafe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedCafes;