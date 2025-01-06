import { EuroIcon, Wifi, Plug, Coffee, Baby, Volume2, Phone, Users, Bed, 
  Mic, Dumbbell, Zap, Brain, Signal, Timer, Group, Laptop, Clock } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";

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
  { id: "available-now", label: "Available Now", icon: <Clock className="w-4 h-4" />, category: 'services' },
  { id: "fast-internet", label: "Gigabit Internet", icon: <Zap className="w-4 h-4" />, category: 'services' },
  { id: "real-time", label: "Real-time Availability", icon: <Signal className="w-4 h-4" />, category: 'services' },
  { id: "instant-booking", label: "Instant Booking", icon: <Timer className="w-4 h-4" />, category: 'services' },
  { id: "workspace", label: "Dedicated Workspace", icon: <Laptop className="w-4 h-4" />, category: 'services' },
];

interface FilterOptionsProps {
  selectedFilters: string[];
  onFilterChange: (filterId: string) => void;
  priceRange: number[];
  onPriceRangeChange: (value: number[]) => void;
}

export const FilterOptions = ({
  selectedFilters,
  onFilterChange,
  priceRange,
  onPriceRangeChange
}: FilterOptionsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <EuroIcon className="w-4 h-4" />
          Price Range (€/hour)
        </label>
        <Slider
          defaultValue={[0, 12]}
          max={12}
          step={1}
          value={priceRange}
          onValueChange={onPriceRangeChange}
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {FILTER_OPTIONS.filter(option => option.category === category).map(({ id, label, icon }) => (
              <div key={id} className="flex items-center space-x-2">
                <Checkbox 
                  id={id}
                  checked={selectedFilters.includes(id)}
                  onCheckedChange={() => onFilterChange(id)}
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
  );
};