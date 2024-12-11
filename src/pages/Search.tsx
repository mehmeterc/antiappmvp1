import { SearchBar } from "@/components/SearchBar";
import { SpaceCard } from "@/components/SpaceCard";
import { BERLIN_CAFES } from "@/data/mockCafes";
import { useLocation } from "react-router-dom";

const Search = () => {
  const location = useLocation();
  const { filters = [], searchTerm = "" } = location.state || {};

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <SearchBar />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCafes.map((cafe) => (
            <SpaceCard key={cafe.id} {...cafe} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;