
import { Command, CommandInput, CommandList, CommandEmpty } from "./ui/command";
import { SearchResults } from "./SearchResults";
import { Cafe } from "@/types/cafe";
import { Search, Loader2 } from "lucide-react";

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
  isLoading = false
}: SearchInputProps) => {
  return (
    <Command className="rounded-lg border shadow-md w-full bg-white" shouldFilter={false}>
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <CommandInput 
          placeholder={isLoading ? "Loading suggestions..." : "Search for spaces near you..."} 
          value={searchTerm} 
          onValueChange={onSearchTermChange} 
          className="w-full bg-transparent outline-none border-0 focus:ring-0 text-base placeholder:text-muted-foreground p-0"
        />
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>
      <CommandList className="max-h-[300px] overflow-y-auto p-2">
        {!isLoading && searchTerm && suggestions.length === 0 && (
          <CommandEmpty className="py-6 text-center">
            <p className="text-gray-600 mb-2">No exact matches found</p>
            <p className="text-sm text-muted-foreground">
              Try searching for a different location or browse our popular spaces
            </p>
          </CommandEmpty>
        )}
        {searchTerm && showSuggestions && (
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
