import { SpaceCard } from "@/components/SpaceCard";
import { BERLIN_CAFES } from "@/data/mockCafes";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Map as MapIcon } from "lucide-react";
import { Layout } from "@/components/Layout";

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
        <div className="w-full h-[600px] bg-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MapIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Mock Map View - In a real app, this would be an interactive map</p>
          </div>
        </div>
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