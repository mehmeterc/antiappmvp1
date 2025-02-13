
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Collapsible, CollapsibleContent } from "./ui/collapsible";
import { FilterOptions } from "./FilterOptions";
import { SearchInput } from "./SearchInput";
import { SearchControls } from "./SearchControls";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";
import { Cafe } from "@/types/cafe";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const fetchAllCafes = async () => {
  const { data: cafes, error } = await supabase
    .from('cafes')
    .select('*')
    .order('rating', { ascending: false });
  
  if (error) throw error;
  return cafes;
};

export const SearchBar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 12]);

  // Cache all cafes with react-query
  const { data: allCafes = [], isLoading: isCafesLoading } = useQuery({
    queryKey: ['cafes'],
    queryFn: fetchAllCafes,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  });

  const { aiRecommendations = [], isLoading: isAILoading } = useAIRecommendations(searchTerm);

  // Memoized filtering logic
  const filteredSuggestions = useMemo(() => {
    if (!allCafes.length) return [];

    return allCafes.filter(cafe => {
      // Apply text search if there's a search term
      const matchesSearch = !searchTerm || 
        cafe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cafe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cafe.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cafe.amenities.some(amenity => 
          amenity.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Apply amenities filter if selected
      const matchesFilters = selectedFilters.length === 0 ||
        selectedFilters.every(filter => cafe.amenities.includes(filter));

      // Apply price range filter
      const cafePrice = parseFloat(cafe.price);
      const matchesPrice = !isNaN(cafePrice) &&
        cafePrice >= priceRange[0] &&
        cafePrice <= priceRange[1];

      return matchesSearch && matchesFilters && matchesPrice;
    });
  }, [allCafes, searchTerm, selectedFilters, priceRange]);

  // Show suggestions whenever there's a search term or filters are active
  useEffect(() => {
    setShowSuggestions(
      searchTerm.length > 0 || 
      selectedFilters.length > 0 || 
      priceRange[0] !== 0 || 
      priceRange[1] !== 12
    );
  }, [searchTerm, selectedFilters, priceRange]);

  const handleFilterChange = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const handleCafeSelect = (cafeId: string) => {
    navigate(`/cafe/${cafeId}`);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    navigate("/search", {
      state: {
        filters: selectedFilters,
        searchTerm,
        priceRange,
        aiRecommendations
      }
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex gap-4 relative py-[7px]">
        <div className="flex-1">
          <SearchInput
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            showSuggestions={showSuggestions}
            suggestions={filteredSuggestions}
            aiRecommendations={aiRecommendations}
            onCafeSelect={handleCafeSelect}
            isLoading={isCafesLoading || isAILoading}
          />
        </div>
        <SearchControls
          onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
          onSearch={handleSearch}
        />
      </div>

      <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <CollapsibleContent>
          <FilterOptions
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
