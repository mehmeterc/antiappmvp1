
import { Command, CommandInput, CommandList, CommandEmpty } from "./ui/command";
import { SearchResults } from "./SearchResults";
import { Cafe } from "@/types/cafe";
import { Loader2 } from "lucide-react";

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
  return (
    <Command 
      className="rounded-lg border shadow-md"
      shouldFilter={false}
    >
      <div className="flex items-center px-3">
        <CommandInput
          placeholder={isLoading ? "Loading suggestions..." : "Search for spaces near you..."}
          value={searchTerm}
          onValueChange={onSearchTermChange}
          className="flex-1"
        />
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-gray-500 ml-2" />
        )}
      </div>
      <CommandList>
        {!isLoading && searchTerm && suggestions.length === 0 && (
          <CommandEmpty>No spaces found matching your criteria.</CommandEmpty>
        )}
        {showSuggestions && suggestions.length > 0 && (
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
