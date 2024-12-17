import { Command, CommandInput, CommandList, CommandEmpty } from "./ui/command";
import { SearchResults } from "./SearchResults";
import { Cafe } from "@/types/cafe";

interface SearchInputProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  showSuggestions: boolean;
  suggestions: Cafe[];
  aiRecommendations: string[];
  onCafeSelect: (cafeId: string) => void;
  isLoading: boolean;
}

export const SearchInput = ({
  searchTerm = "",
  onSearchTermChange,
  showSuggestions = false,
  suggestions = [],
  aiRecommendations = [],
  onCafeSelect,
  isLoading = false,
}: SearchInputProps) => {
  console.log('SearchInput render - suggestions:', suggestions?.length ?? 0);
  
  return (
    <Command 
      className="rounded-lg border shadow-md"
      shouldFilter={false}
    >
      <CommandInput
        placeholder={isLoading ? "AI is analyzing your search..." : "Search for spaces near you..."}
        value={searchTerm}
        onValueChange={onSearchTermChange}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {showSuggestions && Array.isArray(suggestions) && suggestions.length > 0 && searchTerm.length > 0 && (
          <SearchResults
            suggestions={suggestions}
            aiRecommendations={aiRecommendations}
            onCafeSelect={onCafeSelect}
          />
        )}
      </CommandList>
    </Command>
  );
};