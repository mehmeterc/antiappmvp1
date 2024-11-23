import { SearchBar } from "@/components/SearchBar";
import { SpaceCard } from "@/components/SpaceCard";
import { BERLIN_CAFES } from "@/data/mockCafes";

const Search = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <SearchBar />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BERLIN_CAFES.map((cafe) => (
            <SpaceCard key={cafe.id} {...cafe} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;