import { CommandList, CommandEmpty, CommandGroup, CommandItem } from "./ui/command";
import { Badge } from "./ui/badge";
import { Cafe } from "@/types/cafe";

interface SearchResultsProps {
  suggestions: Cafe[];
  aiRecommendations: string[];
  onCafeSelect: (cafeId: string) => void;
}

export const SearchResults = ({ 
  suggestions = [], 
  aiRecommendations = [], 
  onCafeSelect 
}: SearchResultsProps) => {
  // Ensure we have valid arrays to work with
  const validSuggestions = Array.isArray(suggestions) ? suggestions : [];
  const validRecommendations = Array.isArray(aiRecommendations) ? aiRecommendations : [];

  console.log('Rendering SearchResults with suggestions:', validSuggestions.length);
  console.log('AI recommendations:', validRecommendations.length);

  return (
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup>
        {validSuggestions.map((cafe) => (
          <CommandItem
            key={cafe.id}
            value={cafe.title}
            onSelect={() => onCafeSelect(cafe.id)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span>{cafe.title}</span>
                {validRecommendations.includes(cafe.id) && (
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