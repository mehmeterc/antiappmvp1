import { Settings } from "lucide-react";
import { Button } from "./ui/button";

interface SearchControlsProps {
  onToggleFilters: () => void;
  onSearch: () => void;
}

export const SearchControls = ({ onToggleFilters, onSearch }: SearchControlsProps) => {
  return (
    <>
      <Button 
        variant="outline"
        size="icon"
        onClick={onToggleFilters}
        className="shrink-0"
      >
        <Settings className="h-4 w-4" />
      </Button>
      <Button 
        className="bg-primary hover:bg-primary/90 shrink-0"
        onClick={onSearch}
      >
        Search
      </Button>
    </>
  );
};