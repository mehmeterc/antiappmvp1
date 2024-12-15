import { SpaceCard } from "@/components/SpaceCard";
import { BERLIN_CAFES } from "@/data/mockCafes";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Map as MapIcon } from "lucide-react";
import { Layout } from "@/components/Layout";
import { CafeMap } from "@/components/CafeMap";

const Search = () => {
  const location = useLocation();
  const { filters = [], searchTerm = "" } = location.state || {};
  const [showMap, setShowMap] = useState(false);

  const filteredCafes = BERLIN_CAFES.filter(cafe => {
    const matchesSearch = searchTerm.length === 0 || 
      cafe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cafe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cafe.address.toLowerCase().includes(searchTerm.toLowerCase());

    if (filters.length === 0) return matchesSearch;
    
    const matchesFilters = filters.every(filter => 
      cafe.amenities.includes(filter)
    );

    return matchesSearch && matchesFilters;
  });

  return (
    <Layout>
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          onClick={() => setShowMap(!showMap)}
          className="flex items-center gap-2"
        >
          <MapIcon className="h-4 w-4" />
          {showMap ? "Show List" : "Show Map"}
        </Button>
      </div>

      {showMap ? (
        <CafeMap cafes={filteredCafes} />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCafes.map((cafe) => (
            <SpaceCard key={cafe.id} {...cafe} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Search;