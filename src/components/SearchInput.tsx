
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
    <Command className="rounded-lg border shadow-md w-full" shouldFilter={false}>
      <div className="flex items-center border-0 px-4">
        <CommandInput 
          placeholder={isLoading ? "Loading suggestions..." : "Search for spaces near you..."} 
          value={searchTerm} 
          onValueChange={onSearchTermChange} 
          className="flex-1 outline-none border-0 focus:ring-0 text-base placeholder:text-gray-400 h-12" 
        />
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-500 ml-2" />}
      </div>
      {showSuggestions && searchTerm && (
        <CommandList className="max-h-[300px] overflow-y-auto p-2">
          {!isLoading && suggestions.length === 0 && (
            <CommandEmpty className="py-6 text-center">
              <p className="text-gray-600 mb-2">No exact matches found</p>
              <p className="text-sm text-gray-500">
                Try searching for a different location or browse our popular spaces
              </p>
            </CommandEmpty>
          )}
          {suggestions.length > 0 && (
            <SearchResults 
              suggestions={suggestions} 
              aiRecommendations={aiRecommendations} 
              onCafeSelect={onCafeSelect} 
            />
          )}
        </CommandList>
      )}
    </Command>
  );
};
