
import { memo } from "react";
import { CommandGroup, CommandItem } from "./ui/command";
import { Cafe } from "@/types/cafe";
import { MapPin } from "lucide-react";

interface SearchResultsProps {
  suggestions: Cafe[];
  aiRecommendations: string[];
  onCafeSelect: (cafeId: string) => void;
}

export const SearchResults = memo(({
  suggestions,
  aiRecommendations,
  onCafeSelect,
}: SearchResultsProps) => {
  return (
    <div className="space-y-4">
      {suggestions.length > 0 && (
        <CommandGroup heading="Spaces" className="space-y-1">
          {suggestions.slice(0, 8).map((cafe) => (
            <CommandItem
              key={cafe.id}
              value={cafe.title}
              onSelect={() => onCafeSelect(cafe.id)}
              className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">{cafe.title}</div>
                <div className="flex items-center text-sm text-gray-500 mt-0.5">
                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{cafe.address}</span>
                </div>
              </div>
            </CommandItem>
          ))}
          {suggestions.length > 8 && (
            <CommandItem className="text-sm text-gray-500 italic px-4">
              + {suggestions.length - 8} more spaces available
            </CommandItem>
          )}
        </CommandGroup>
      )}

      {aiRecommendations.length > 0 && searchTerm && (
        <CommandGroup heading="You might also like" className="space-y-1">
          {aiRecommendations.map((recommendation, index) => (
            <CommandItem 
              key={index} 
              className="text-sm text-gray-600 px-4 py-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              {recommendation}
            </CommandItem>
          ))}
        </CommandGroup>
      )}
    </div>
  );
});

SearchResults.displayName = "SearchResults";
