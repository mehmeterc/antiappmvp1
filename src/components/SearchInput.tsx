
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
  isLoading = false
}: SearchInputProps) => {
  // Ensure we have valid arrays
  const safeSuggestions = Array.isArray(suggestions) ? suggestions : [];
  const safeAiRecommendations = Array.isArray(aiRecommendations) ? aiRecommendations : [];

  const renderSuggestions = () => {
    if (!showSuggestions) {
      return null;
    }

    return (
      <CommandList className="max-h-[300px] overflow-y-auto p-2">
        {!isLoading && safeSuggestions.length === 0 && (
          <CommandEmpty className="py-6 text-center">
            <p className="text-gray-600 mb-2">No exact matches found</p>
            {safeAiRecommendations.length > 0 ? (
              <div className="text-sm text-gray-500">
                <p className="mb-2">Try these suggestions:</p>
                <ul className="space-y-2">
                  {safeAiRecommendations.map((rec, index) => (
                    <li 
                      key={index} 
                      className="text-primary cursor-pointer hover:underline px-4 py-1.5 rounded hover:bg-gray-100"
                      onClick={() => onSearchTermChange(rec)}
                    >
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Try searching for a different location or browse our popular spaces
              </p>
            )}
          </CommandEmpty>
        )}
        {safeSuggestions.length > 0 && (
          <SearchResults 
            suggestions={safeSuggestions} 
            aiRecommendations={safeAiRecommendations} 
            onCafeSelect={onCafeSelect} 
          />
        )}
      </CommandList>
    );
  };

  return (
    <Command className="rounded-lg border shadow-md w-full flex flex-col" shouldFilter={false}>
      <div className="flex items-center border-0 px-4 w-full">
        <CommandInput 
          placeholder={isLoading ? "Loading suggestions..." : "Search for spaces near you..."} 
          value={searchTerm} 
          onValueChange={onSearchTermChange} 
          className="w-full outline-none border-0 focus:ring-0 text-base placeholder:text-gray-400 h-12" 
        />
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-500 ml-2" />}
      </div>
      {renderSuggestions()}
    </Command>
  );
};
