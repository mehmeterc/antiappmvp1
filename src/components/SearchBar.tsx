import { Wifi, Plug, Coffee, Baby, Volume2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";

export const SearchBar = () => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex gap-4">
        <Input 
          placeholder="Search for spaces near you..." 
          className="flex-1"
        />
        <Button className="bg-primary hover:bg-primary/90">
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