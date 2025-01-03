import { useRef } from "react";
import { Cafe } from "@/types/cafe";
import { useHereMap } from "./map/useHereMap";
import { MapMarkers } from "./map/MapMarkers";

// Declare the HERE Maps types
declare global {
  interface Window {
    H: any;
  }
}

interface CafeMapProps {
  cafes: Cafe[];
  centerLat?: number;
  centerLng?: number;
}

export const CafeMap = ({ 
  cafes, 
  centerLat = 52.520008, 
  centerLng = 13.404954 
}: CafeMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { map, error } = useHereMap(mapRef, centerLat, centerLng);

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="relative">
      <div ref={mapRef} className="w-full h-[400px]" />
      <MapMarkers map={map} cafes={cafes} />
    </div>
  );
};