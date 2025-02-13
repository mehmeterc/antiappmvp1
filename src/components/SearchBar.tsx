
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
    gcTime: 30 * 60 * 1000,   // Keep in garbage collection for 30 minutes
  });

  const { aiRecommendations = [], isLoading: isAILoading } = useAIRecommendations(searchTerm);

  // Improved filtering logic
  const filteredSuggestions = useMemo(() => {
    if (!allCafes.length) return [];
    if (!searchTerm && selectedFilters.length === 0) return allCafes;

    const searchTermLower = searchTerm.toLowerCase();
    
    return allCafes.filter(cafe => {
      // Search term matching
      const matchesSearch = !searchTerm || 
        cafe.title.toLowerCase().includes(searchTermLower) ||
        cafe.description.toLowerCase().includes(searchTermLower) ||
        cafe.address.toLowerCase().includes(searchTermLower) ||
        (cafe.amenities && cafe.amenities.some(amenity => 
          amenity.toLowerCase().includes(searchTermLower)
        )) ||
        (cafe.tags && cafe.tags.some(tag => 
          tag.toLowerCase().includes(searchTermLower)
        ));

      // Filter matching
      const matchesFilters = selectedFilters.length === 0 ||
        (cafe.amenities && selectedFilters.every(filter => 
          cafe.amenities.includes(filter)
        ));

      // Price range matching
      const cafePrice = parseFloat(cafe.price);
      const matchesPrice = !isNaN(cafePrice) &&
        cafePrice >= priceRange[0] &&
        cafePrice <= priceRange[1];

      return matchesSearch && matchesFilters && matchesPrice;
    });
  }, [allCafes, searchTerm, selectedFilters, priceRange]);

  // Show suggestions as soon as we have data or search term
  useEffect(() => {
    setShowSuggestions(true);
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

  // Log for debugging
  console.log('Current suggestions:', {
    searchTerm,
    suggestionsCount: filteredSuggestions.length,
    suggestions: filteredSuggestions.map(s => s.title)
  });

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
