import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wifi, Plug, Coffee, Baby, Volume2, Phone, Users, Bed, Mic, Dumbbell, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { BERLIN_CAFES } from "@/data/mockCafes";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "./ui/command";
import { Collapsible, CollapsibleContent } from "./ui/collapsible";

interface FilterOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const FILTER_OPTIONS: FilterOption[] = [
  { id: "wifi", label: "WiFi", icon: <Wifi className="w-4 h-4" /> },
  { id: "power", label: "Power", icon: <Plug className="w-4 h-4" /> },
  { id: "coffee", label: "Coffee", icon: <Coffee className="w-4 h-4" /> },
  { id: "quiet", label: "Quiet", icon: <Volume2 className="w-4 h-4" /> },
  { id: "baby", label: "Baby-friendly", icon: <Baby className="w-4 h-4" /> },
  { id: "phonebooth", label: "Phone Booth", icon: <Phone className="w-4 h-4" /> },
  { id: "community", label: "Community Factor", icon: <Users className="w-4 h-4" /> },
  { id: "nap-pods", label: "Nap Pods", icon: <Bed className="w-4 h-4" /> },
  { id: "podcast-room", label: "Podcast Room", icon: <Mic className="w-4 h-4" /> },
  { id: "gym", label: "Gym Access", icon: <Dumbbell className="w-4 h-4" /> },
];

export const SearchBar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  const suggestions = BERLIN_CAFES.filter(cafe => {
    const matchesSearch = searchTerm.length === 0 || 
      cafe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cafe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cafe.address.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedFilters.length === 0) return matchesSearch;
    
    const matchesFilters = selectedFilters.every(filter => 
      cafe.amenities.includes(filter)
    );

    return matchesSearch && matchesFilters;
  });

  const handleFilterChange = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
    console.log("Filters updated:", selectedFilters);
  };

  const handleCafeSelect = (cafeId: string) => {
    navigate(`/cafe/${cafeId}`);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    console.log("Searching with filters:", selectedFilters);
    navigate("/search", {
      state: { filters: selectedFilters, searchTerm }
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex gap-4 relative">
        <div className="flex-1">
          <Command className="rounded-lg border shadow-md">
            <CommandInput
              placeholder="Search for spaces near you..."
              value={searchTerm}
              onValueChange={(value) => {
                setSearchTerm(value);
                setShowSuggestions(true);
              }}
            />
            {showSuggestions && (
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {suggestions.map((cafe) => (
                    <CommandItem
                      key={cafe.id}
                      value={cafe.title}
                      onSelect={() => handleCafeSelect(cafe.id)}
                    >
                      <div className="flex items-center gap-2">
                        <span>{cafe.title}</span>
                        <span className="text-sm text-gray-500">({cafe.address})</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            )}
          </Command>
        </div>
        <Button 
          variant="outline"
          size="icon"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="shrink-0"
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button 
          className="bg-primary hover:bg-primary/90 shrink-0"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>

      <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <CollapsibleContent className="space-y-2">
          <div className="flex flex-wrap gap-4">
            {FILTER_OPTIONS.map(({ id, label, icon }) => (
              <div key={id} className="flex items-center space-x-2">
                <Checkbox 
                  id={id}
                  checked={selectedFilters.includes(id)}
                  onCheckedChange={() => handleFilterChange(id)}
                />
                <label htmlFor={id} className="flex items-center gap-1 cursor-pointer">
                  {icon} {label}
                </label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};