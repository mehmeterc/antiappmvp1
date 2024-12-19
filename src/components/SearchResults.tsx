import { CommandGroup, CommandItem } from "./ui/command";
import { Cafe } from "@/types/cafe";

interface SearchResultsProps {
  suggestions: Cafe[];
  aiRecommendations: string[];
  onCafeSelect: (cafeId: string) => void;
}

export const SearchResults = ({
  suggestions,
  aiRecommendations,
  onCafeSelect,
}: SearchResultsProps) => {
  return (
    <>
      {suggestions.length > 0 && (
        <CommandGroup heading="Spaces">
          {suggestions.map((cafe) => (
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
              </div>
            </CommandItem>
          ))}
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
};