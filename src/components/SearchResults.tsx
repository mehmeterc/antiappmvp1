import { CommandList, CommandEmpty, CommandGroup, CommandItem } from "./ui/command";
import { Badge } from "./ui/badge";
import { Cafe } from "@/types/cafe";

interface SearchResultsProps {
  suggestions: Cafe[];
  aiRecommendations: string[];
  onCafeSelect: (cafeId: string) => void;
}

export const SearchResults = ({ suggestions, aiRecommendations, onCafeSelect }: SearchResultsProps) => {
  return (
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup>
        {suggestions.map((cafe) => (
          <CommandItem
            key={cafe.id}
            value={cafe.title}
            onSelect={() => onCafeSelect(cafe.id)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span>{cafe.title}</span>
                {aiRecommendations.includes(cafe.id) && (
                  <Badge variant="secondary" className="ml-2">
                    AI Recommended
                  </Badge>
                )}
                <span className="text-sm text-gray-500">({cafe.address})</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50">
                  Available Now
                </Badge>
                <span className="text-primary font-semibold">{cafe.price}/h</span>
              </div>
            </div>
          </CommandItem>
        ))}
      </CommandGroup>
    </CommandList>
  );
};