import { Command, CommandInput } from "./ui/command";
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
  searchTerm,
  onSearchTermChange,
  showSuggestions,
  suggestions,
  aiRecommendations,
  onCafeSelect,
  isLoading,
}: SearchInputProps) => {
  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput
        placeholder={isLoading ? "AI is analyzing your search..." : "Search for spaces near you..."}
        value={searchTerm}
        onValueChange={onSearchTermChange}
      />
      {showSuggestions && suggestions && suggestions.length > 0 && searchTerm.length > 0 && (
        <SearchResults
          suggestions={suggestions}
          aiRecommendations={aiRecommendations}
          onCafeSelect={onCafeSelect}
        />
      )}
    </Command>
  );
};