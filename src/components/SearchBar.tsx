
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
  
  if (error) {
    console.error('Error fetching cafes:', error);
    throw error;
  }
  return cafes;
};

export const SearchBar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true); // Always show by default
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 12]);

  // Fetch and cache all cafes
  const { data: allCafes = [], isLoading: isCafesLoading } = useQuery({
    queryKey: ['cafes'],
    queryFn: fetchAllCafes,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const { aiRecommendations = [], isLoading: isAILoading } = useAIRecommendations(searchTerm);

  // Simple, direct filtering logic
  const filteredSuggestions = useMemo(() => {
    if (!allCafes) return [];
    
    // If no search term, show all cafes
    if (!searchTerm.trim()) {
      return allCafes;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    
    // Simple text matching against all relevant fields
    return allCafes.filter(cafe => {
      return (
        cafe.title.toLowerCase().includes(searchLower) ||
        cafe.description.toLowerCase().includes(searchLower) ||
        cafe.address.toLowerCase().includes(searchLower) ||
        cafe.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        cafe.amenities.some(amenity => amenity.toLowerCase().includes(searchLower))
      );
    });
  }, [allCafes, searchTerm]);

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

  // Debug logging
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
