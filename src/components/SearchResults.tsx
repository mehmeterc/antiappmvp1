
import { memo } from "react";
import { CommandGroup, CommandItem } from "./ui/command";
import { Cafe } from "@/types/cafe";

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
    <>
      {suggestions.length > 0 && (
        <CommandGroup heading="Spaces">
          {suggestions.slice(0, 8).map((cafe) => (
            <CommandItem
              key={cafe.id}
              value={cafe.title}
              onSelect={() => onCafeSelect(cafe.id)}
              className="flex justify-between items-center"
            >
              <div>
                <div className="font-medium">{cafe.title}</div>
                <div className="text-sm text-gray-500">{cafe.address}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">★ {cafe.rating}</span>
                {cafe.price && <span className="text-xs text-gray-500">{cafe.price}</span>}
              </div>
            </CommandItem>
          ))}
          {suggestions.length > 8 && (
            <CommandItem className="text-sm text-gray-500 italic">
              + {suggestions.length - 8} more results...
            </CommandItem>
          )}
        </CommandGroup>
      )}

      {aiRecommendations.length > 0 && (
        <CommandGroup heading="AI Recommendations">
          {aiRecommendations.map((recommendation, index) => (
            <CommandItem key={index} className="text-sm text-gray-600">
              {recommendation}
            </CommandItem>
          ))}
        </CommandGroup>
      )}
    </>
  );
});

SearchResults.displayName = "SearchResults";
