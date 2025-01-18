import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Collapsible, CollapsibleContent } from "./ui/collapsible";
import { FilterOptions } from "./FilterOptions";
import { SearchInput } from "./SearchInput";
import { SearchControls } from "./SearchControls";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";
import { Cafe } from "@/types/cafe";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const SearchBar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 12]);
  const [suggestions, setSuggestions] = useState<Cafe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { aiRecommendations = [], isLoading: isAILoading } = useAIRecommendations(searchTerm);

  useEffect(() => {
    console.log('Search term changed:', searchTerm);
    const fetchCafes = async () => {
      setIsLoading(true);
      try {
        let query = supabase.from('cafes').select('*');

        // Apply text search if there's a search term
        if (searchTerm.length > 0) {
          query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`);
        }
        
        // Apply amenities filter if selected
        if (selectedFilters.length > 0) {
          query = query.contains('amenities', selectedFilters);
        }

        // Apply price range filter - convert price to numeric for comparison
        query = query.gte('price', `${priceRange[0]}`)
                    .lte('price', `${priceRange[1]}`);

        const { data: cafes, error } = await query;
        
        if (error) {
          console.error('Search error:', error);
          toast.error("Error fetching cafes");
          setSuggestions([]);
          setShowSuggestions(false);
          return;
        }
        
        console.log('Fetched cafes:', cafes?.length ?? 0);
        setSuggestions(cafes ?? []);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Search error:', error);
        toast.error("An unexpected error occurred");
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the search to avoid too many requests
    const timeoutId = setTimeout(fetchCafes, 300);
    return () => clearTimeout(timeoutId);
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
      <div className="flex gap-4 relative">
        <div className="flex-1">
          <SearchInput
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            showSuggestions={showSuggestions}
            suggestions={suggestions}
            aiRecommendations={aiRecommendations}
            onCafeSelect={handleCafeSelect}
            isLoading={isLoading || isAILoading}
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