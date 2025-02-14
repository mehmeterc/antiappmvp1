
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
import Fuse from 'fuse.js';

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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 12]);

  const { data: allCafes = [], isLoading: isCafesLoading } = useQuery({
    queryKey: ['cafes'],
    queryFn: fetchAllCafes,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const { aiRecommendations = [], isLoading: isAILoading } = useAIRecommendations(searchTerm);

  // Initialize Fuse.js for fuzzy search
  const fuse = useMemo(() => new Fuse(allCafes, {
    keys: ['title', 'description', 'address', 'tags', 'amenities'],
    threshold: 0.3,
    distance: 100,
    includeScore: true
  }), [allCafes]);

  // Enhanced search with fuzzy matching
  const filteredSuggestions = useMemo(() => {
    if (!searchTerm.trim()) {
      return [];
    }

    const results = fuse.search(searchTerm);
    return results
      .filter(result => result.score && result.score < 0.6)
      .map(result => result.item);
  }, [fuse, searchTerm]);

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    setShowSuggestions(true);
  };

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
      <div className="flex gap-4 relative">
        <div className="flex-1">
          <SearchInput
            searchTerm={searchTerm}
            onSearchTermChange={handleSearchTermChange}
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
