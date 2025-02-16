
import { memo } from "react";
import { CommandGroup, CommandItem } from "./ui/command";
import { Cafe } from "@/types/cafe";
import { MapPin, Star } from "lucide-react";

interface SearchResultsProps {
  suggestions: Cafe[];
  aiRecommendations: string[];
  onCafeSelect: (cafeId: string) => void;
}

export const SearchResults = memo(({
  suggestions = [], // Add default value
  aiRecommendations = [], // Add default value
  onCafeSelect,
}: SearchResultsProps) => {
  // Ensure arrays are valid
  const safeSuggestions = Array.isArray(suggestions) ? suggestions : [];
  const safeAiRecommendations = Array.isArray(aiRecommendations) ? aiRecommendations : [];

  return (
    <div className="space-y-4">
      {/* Suggestions Section */}
      {safeSuggestions.length > 0 && (
        <CommandGroup heading="Spaces" className="space-y-1">
          {safeSuggestions.slice(0, 8).map((cafe) => (
            <CommandItem
              key={cafe.id}
              value={cafe.title}
              onSelect={() => onCafeSelect(cafe.id)}
              className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {cafe.title}
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-0.5">
                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{cafe.address}</span>
                </div>
              </div>
              {cafe.rating && (
                <div className="flex items-center text-sm text-gray-500 ml-2">
                  <Star className="h-3 w-3 mr-1 text-yellow-400 fill-current" />
                  {cafe.rating}
                </div>
              )}
            </CommandItem>
          ))}
          {safeSuggestions.length > 8 && (
            <CommandItem className="text-sm text-gray-500 italic px-4">
              + {safeSuggestions.length - 8} more spaces available
            </CommandItem>
          )}
        </CommandGroup>
      )}

      {/* Similar Spaces Section */}
      {safeSuggestions.length > 0 && safeAiRecommendations.length > 0 && (
        <CommandGroup heading="Similar Spaces" className="space-y-1">
          {safeSuggestions
            .filter(cafe => safeAiRecommendations.includes(cafe.id))
            .slice(0, 3)
            .map((cafe) => (
              <CommandItem
                key={cafe.id}
                value={cafe.title}
                onSelect={() => onCafeSelect(cafe.id)}
                className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {cafe.title}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-0.5">
                    <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{cafe.address}</span>
                  </div>
                </div>
              </CommandItem>
            ))}
        </CommandGroup>
      )}
    </div>
  );
});

SearchResults.displayName = "SearchResults";
