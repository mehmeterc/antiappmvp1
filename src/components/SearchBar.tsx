import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Collapsible, CollapsibleContent } from "./ui/collapsible";
import { FilterOptions } from "./FilterOptions";
import { SearchInput } from "./SearchInput";
import { SearchControls } from "./SearchControls";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";
import { searchCafes } from "@/utils/searchUtils";
import { Cafe } from "@/types/cafe";
import { supabase } from "@/integrations/supabase/client";

export const SearchBar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 12]);
  const [suggestions, setSuggestions] = useState<Cafe[]>([]);
  
  const { aiRecommendations = [], isLoading } = useAIRecommendations(searchTerm);

  useEffect(() => {
    console.log('Search term changed:', searchTerm);
    if (searchTerm.length > 0) {
      try {
        const fetchCafes = async () => {
          const { data: cafes, error } = await supabase
            .from('cafes')
            .select('*');
          
          if (error) throw error;
          
          const results = searchCafes(
            cafes as Cafe[],
            searchTerm,
            selectedFilters,
            priceRange,
            aiRecommendations
          );
          console.log('Updated suggestions:', results?.length ?? 0);
          setSuggestions(results ?? []);
          setShowSuggestions(true);
        };
        
        fetchCafes();
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, selectedFilters, priceRange, aiRecommendations]);

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
            isLoading={isLoading}
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