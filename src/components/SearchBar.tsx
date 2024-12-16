import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Wifi, Plug, Coffee, Baby, Volume2, Phone, Users, Bed, 
  Mic, Dumbbell, Settings, EuroIcon, Zap, Brain, 
  Signal, Timer, Group, Laptop
} from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { BERLIN_CAFES } from "@/data/mockCafes";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "./ui/command";
import { Collapsible, CollapsibleContent } from "./ui/collapsible";
import { Badge } from "./ui/badge";
import { useToast } from "./ui/use-toast";
import { analyzeSearchTerm } from "@/utils/aiUtils";

interface FilterOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  category: 'amenities' | 'atmosphere' | 'services';
}

const FILTER_OPTIONS: FilterOption[] = [
  // Amenities
  { id: "wifi", label: "High-Speed WiFi", icon: <Wifi className="w-4 h-4" />, category: 'amenities' },
  { id: "power", label: "Power Outlets", icon: <Plug className="w-4 h-4" />, category: 'amenities' },
  { id: "coffee", label: "Premium Coffee", icon: <Coffee className="w-4 h-4" />, category: 'amenities' },
  { id: "phonebooth", label: "Phone Booth", icon: <Phone className="w-4 h-4" />, category: 'amenities' },
  { id: "nap-pods", label: "Nap Pods", icon: <Bed className="w-4 h-4" />, category: 'amenities' },
  { id: "podcast-room", label: "Podcast Room", icon: <Mic className="w-4 h-4" />, category: 'amenities' },
  { id: "gym", label: "Gym Access", icon: <Dumbbell className="w-4 h-4" />, category: 'amenities' },
  
  // Atmosphere
  { id: "quiet", label: "Quiet Zone", icon: <Volume2 className="w-4 h-4" />, category: 'atmosphere' },
  { id: "baby", label: "Family Friendly", icon: <Baby className="w-4 h-4" />, category: 'atmosphere' },
  { id: "community", label: "Community Space", icon: <Users className="w-4 h-4" />, category: 'atmosphere' },
  { id: "focus", label: "Focus-Optimized", icon: <Brain className="w-4 h-4" />, category: 'atmosphere' },
  { id: "group-friendly", label: "Group Friendly", icon: <Group className="w-4 h-4" />, category: 'atmosphere' },
  
  // Services
  { id: "fast-internet", label: "Gigabit Internet", icon: <Zap className="w-4 h-4" />, category: 'services' },
  { id: "real-time", label: "Real-time Availability", icon: <Signal className="w-4 h-4" />, category: 'services' },
  { id: "instant-booking", label: "Instant Booking", icon: <Timer className="w-4 h-4" />, category: 'services' },
  { id: "workspace", label: "Dedicated Workspace", icon: <Laptop className="w-4 h-4" />, category: 'services' },
];

export const SearchBar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 30]);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAiRecommendations = async () => {
      if (searchTerm.length < 3) return;
      
      setIsLoading(true);
      try {
        const analysis = await analyzeSearchTerm(searchTerm);
        console.log("Search term analysis:", analysis);
        
        // Use the analysis to enhance search results
        const enhancedSuggestions = BERLIN_CAFES.filter(cafe => {
          const matchScore = analysis.confidence > 0.5;
          return matchScore && cafe.title.toLowerCase().includes(searchTerm.toLowerCase());
        });
        
        setAiRecommendations(enhancedSuggestions.map(cafe => cafe.id));
      } catch (error) {
        console.error("AI recommendation error:", error);
        toast({
          title: "AI Enhancement",
          description: "Using standard search while AI features are loading...",
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      getAiRecommendations();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, toast]);

  const suggestions = BERLIN_CAFES.filter(cafe => {
    const matchesSearch = searchTerm.length === 0 || 
      cafe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cafe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cafe.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters = selectedFilters.length === 0 || 
      selectedFilters.every(filter => cafe.amenities.includes(filter));

    const priceValue = parseFloat(cafe.price.replace('€', ''));
    const matchesPrice = priceValue >= priceRange[0] && priceValue <= priceRange[1];

    const isRecommended = aiRecommendations.includes(cafe.id);

    return (matchesSearch || isRecommended) && matchesFilters && matchesPrice;
  });

  const handleFilterChange = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const handleCafeSelect = (cafeId: string) => {
    navigate(`/cafe/${cafeId}`);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    navigate("/search", {
      state: { 
        filters: selectedFilters, 
        searchTerm,
        priceRange,
        aiRecommendations 
      }
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex gap-4 relative">
        <div className="flex-1">
          <Command className="rounded-lg border shadow-md">
            <CommandInput
              placeholder={isLoading ? "AI is analyzing your search..." : "Search for spaces near you..."}
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
        <CollapsibleContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <EuroIcon className="w-4 h-4" />
                Price Range (€/hour)
              </label>
              <Slider
                defaultValue={[0, 30]}
                max={30}
                step={1}
                value={priceRange}
                onValueChange={setPriceRange}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{priceRange[0]}€/h</span>
                <span>{priceRange[1]}€/h</span>
              </div>
            </div>

            {(['amenities', 'atmosphere', 'services'] as const).map((category) => (
              <div key={category} className="space-y-2">
                <h3 className="font-medium capitalize">{category}</h3>
                <div className="flex flex-wrap gap-4">
                  {FILTER_OPTIONS.filter(option => option.category === category).map(({ id, label, icon }) => (
                    <div key={id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={id}
                        checked={selectedFilters.includes(id)}
                        onCheckedChange={() => handleFilterChange(id)}
                      />
                      <label htmlFor={id} className="flex items-center gap-1 cursor-pointer text-sm">
                        {icon} {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
