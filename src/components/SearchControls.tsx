
import { Settings } from "lucide-react";
import { Button } from "./ui/button";

interface SearchControlsProps {
  onToggleFilters: () => void;
  onSearch: () => void;
}

export const SearchControls = ({ onToggleFilters, onSearch }: SearchControlsProps) => {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <Button 
        variant="outline"
        size="icon"
        onClick={onToggleFilters}
        className="h-10 w-10"
      >
        <Settings className="h-4 w-4 text-gray-600" />
      </Button>
      <Button 
        className="bg-primary hover:bg-primary/90 h-10 px-6"
        onClick={onSearch}
      >
        Search
      </Button>
    </div>
  );
};
