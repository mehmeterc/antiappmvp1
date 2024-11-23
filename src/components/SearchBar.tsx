import { useState, useEffect } from "react";
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
            {showSuggestions && searchTerm && (
              <CommandList className="absolute w-full bg-white border rounded-b-lg shadow-lg">
                <CommandEmpty>No results found.</CommandEmpty>
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
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <label className="flex items-center space-x-2">
          <Checkbox />
          <span className="flex items-center gap-2">
            <Wifi className="w-4 h-4" /> Wi-Fi
          </span>
        </label>
        
        <label className="flex items-center space-x-2">
          <Checkbox />
          <span className="flex items-center gap-2">
            <Plug className="w-4 h-4" /> Power Outlets
          </span>
        </label>
        
        <label className="flex items-center space-x-2">
          <Checkbox />
          <span className="flex items-center gap-2">
            <Coffee className="w-4 h-4" /> Coffee Available
          </span>
        </label>
        
        <label className="flex items-center space-x-2">
          <Checkbox />
          <span className="flex items-center gap-2">
            <Volume2 className="w-4 h-4" /> Quiet Zone
          </span>
        </label>
        
        <label className="flex items-center space-x-2">
          <Checkbox />
          <span className="flex items-center gap-2">
            <Baby className="w-4 h-4" /> Baby Friendly
          </span>
        </label>
      </div>
      
      <div className="pt-4">
        <label className="text-sm text-gray-600">Price Range (per hour)</label>
        <input
          type="range"
          min="0"
          max="10"
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>€0</span>
          <span>€10</span>
        </div>
      </div>
    </div>
  );
};