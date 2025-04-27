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

  // Enhanced Fuse.js configuration for better search results
  const fuse = useMemo(() => new Fuse(allCafes, {
    keys: [
      { name: 'title', weight: 2 },
      { name: 'address', weight: 1.5 },
      { name: 'description', weight: 0.7 },
      { name: 'tags', weight: 0.5 },
      { name: 'amenities', weight: 0.3 }
    ],
    threshold: 0.4, // Lower threshold for stricter matching
    distance: 50,   // Shorter distance for more exact matches
    includeScore: true,
    ignoreLocation: false, // Consider location in string when matching
    useExtendedSearch: true,
    minMatchCharLength: 2 // Require at least 2 characters to match
  }), [allCafes]);

  // Improved search with more accurate matching
  const filteredSuggestions = useMemo(() => {
    if (!searchTerm.trim()) {
      return [];
    }

    // Normalize search term for better matching
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    
    // First check for exact or near-exact matches in title (for best results)
    const titleMatches = allCafes.filter(cafe => 
      cafe.title.toLowerCase().includes(normalizedSearchTerm)
    );
    
    // If we have good title matches, prioritize those
    if (titleMatches.length > 0) {
      return titleMatches;
    }
    
    // Otherwise, fall back to fuzzy search
    const results = fuse.search(normalizedSearchTerm);
    
    // Filter results with higher quality matches
    return results
      .filter(result => result.score && result.score < 0.5) // Only include good matches
      .map(result => result.item)
      .slice(0, 8); // Limit to top 8 results
  }, [fuse, searchTerm, allCafes]);

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
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-5">
      <div className="flex gap-2 items-center">
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
        <CollapsibleContent className="mt-4">
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
