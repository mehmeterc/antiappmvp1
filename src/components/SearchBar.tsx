import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Command, CommandInput } from "./ui/command";
import { Collapsible, CollapsibleContent } from "./ui/collapsible";
import { useToast } from "./ui/use-toast";
import { analyzeSearchTerm } from "@/utils/aiUtils";
import { FilterOptions } from "./FilterOptions";
import { SearchResults } from "./SearchResults";
import { BERLIN_CAFES } from "@/data/mockCafes";
import { searchCafes } from "@/utils/searchUtils";

export const SearchBar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 30]);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(BERLIN_CAFES);

  // Handle search term changes
  useEffect(() => {
    console.log('Search term changed:', searchTerm);
    const results = searchCafes(
      BERLIN_CAFES,
      searchTerm,
      selectedFilters,
      priceRange,
      aiRecommendations
    );
    console.log('Updated suggestions:', results.length);
    setSuggestions(results);
    setShowSuggestions(true);
  }, [searchTerm, selectedFilters, priceRange, aiRecommendations]);

  // Handle AI recommendations
  useEffect(() => {
    const getAiRecommendations = async () => {
      if (searchTerm.length < 2) {
        setAiRecommendations([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const analysis = await analyzeSearchTerm(searchTerm);
        console.log("Search term analysis:", analysis);
        setAiRecommendations(
          BERLIN_CAFES
            .filter(cafe => analysis.confidence > 0.5)
            .map(cafe => cafe.id)
        );
      } catch (error) {
        console.error("AI recommendation error:", error);
        toast({
          title: "AI Enhancement",
          description: "Using standard search while AI features are loading...",
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      getAiRecommendations();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, toast]);

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
          <Command className="rounded-lg border shadow-md">
            <CommandInput
              placeholder={isLoading ? "AI is analyzing your search..." : "Search for spaces near you..."}
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            {showSuggestions && suggestions.length > 0 && (
              <SearchResults
                suggestions={suggestions}
                aiRecommendations={aiRecommendations}
                onCafeSelect={handleCafeSelect}
              />
            )}
          </Command>
        </div>
        <Button 
          variant="outline"
          size="icon"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="shrink-0"
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button 
          className="bg-primary hover:bg-primary/90 shrink-0"
          onClick={handleSearch}
        >
          Search
        </Button>
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