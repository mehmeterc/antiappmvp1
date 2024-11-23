import { useState } from "react";
import { Wifi, Plug, Coffee, Baby, Volume2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { BERLIN_CAFES } from "@/data/mockCafes";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "./ui/command";

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const suggestions = BERLIN_CAFES.filter(cafe => 
    cafe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cafe.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex gap-4 relative">
        <div className="flex-1">
          <Command className="rounded-lg border shadow-md">
            <CommandInput
              placeholder="Search for spaces near you..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && (
              <CommandList>
                {suggestions.length === 0 ? (
                  <CommandEmpty>No results found.</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {suggestions.map((cafe) => (
                      <CommandItem
                        key={cafe.id}
                        value={cafe.title}
                        onSelect={(value) => {
                          setSearchTerm(value);
                          setShowSuggestions(false);
                        }}
                      >
                        <span>{cafe.title}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            )}
          </Command>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={() => setShowSuggestions(false)}
        >
          Search
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="wifi" />
          <label htmlFor="wifi" className="flex items-center gap-1">
            <Wifi className="w-4 h-4" /> WiFi
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="power" />
          <label htmlFor="power" className="flex items-center gap-1">
            <Plug className="w-4 h-4" /> Power
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="coffee" />
          <label htmlFor="coffee" className="flex items-center gap-1">
            <Coffee className="w-4 h-4" /> Coffee
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="quiet" />
          <label htmlFor="quiet" className="flex items-center gap-1">
            <Volume2 className="w-4 h-4" /> Quiet
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="baby" />
          <label htmlFor="baby" className="flex items-center gap-1">
            <Baby className="w-4 h-4" /> Baby-friendly
          </label>
        </div>
      </div>
    </div>
  );
};