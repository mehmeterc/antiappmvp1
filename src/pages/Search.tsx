import { SpaceCard } from "@/components/SpaceCard";
import { BERLIN_CAFES } from "@/data/mockCafes";
import { useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";

const Search = () => {
  const location = useLocation();
  const { filters = [], searchTerm = "", priceRange = [0, 30] } = location.state || {};

  const filteredCafes = BERLIN_CAFES.filter(cafe => {
    const matchesSearch = searchTerm.length === 0 || 
      cafe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cafe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cafe.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters = filters.length === 0 || 
      filters.every(filter => cafe.amenities.includes(filter));

    const priceValue = parseFloat(cafe.price.replace('€', ''));
    const matchesPrice = priceValue >= priceRange[0] && priceValue <= priceRange[1];

    return matchesSearch && matchesFilters && matchesPrice;
  });

  return (
    <Layout>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCafes.map((cafe) => (
          <SpaceCard key={cafe.id} {...cafe} />
        ))}
      </div>
    </Layout>
  );
};

export default Search;