import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Cafe } from "@/types/cafe";

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

// Define the type for the RPC response
interface SecretResponse {
  data: {
    secret: string | null;
  } | null;
  error: Error | null;
}

export const CafeMap = ({ cafes, centerLat = 52.520008, centerLng = 13.404954 }: CafeMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        // Get API key from Supabase with proper type handling
        const { data, error } = await supabase.rpc('get_secret', {
          secret_name: 'HERE_MAPS_API_KEY'
        });

        if (error) throw error;
        if (!data?.secret) {
          throw new Error('HERE Maps API key not found');
        }

        // Initialize the platform with the API key
        const platform = new window.H.service.Platform({
          apikey: data.secret
        });

        // Get default map layers
        const defaultLayers = platform.createDefaultLayers();

        // Create a new map instance
        const newMap = new window.H.Map(
          mapRef.current,
          defaultLayers.vector.normal.map,
          {
            zoom: 13,
            center: { lat: centerLat, lng: centerLng }
          }
        );

        // Add window resize handler
        window.addEventListener('resize', () => newMap.getViewPort().resize());

        // Add map interaction and UI controls
        new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(newMap));
        const ui = window.H.ui.UI.createDefault(newMap, defaultLayers);

        // Add markers for each cafe
        cafes.forEach(cafe => {
          if (!cafe.coordinates || typeof cafe.coordinates.lat !== 'number' || typeof cafe.coordinates.lng !== 'number') {
            console.warn('Invalid coordinates for cafe:', cafe);
            return;
          }
          
          // Create marker
          const marker = new window.H.map.Marker({
            lat: cafe.coordinates.lat,
            lng: cafe.coordinates.lng
          });
          
          // Create info bubble
          const bubble = new window.H.ui.InfoBubble(
            { lat: cafe.coordinates.lat, lng: cafe.coordinates.lng },
            {
              content: `
                <div style="padding: 10px;">
                  <h3 style="margin: 0 0 8px;">${cafe.title}</h3>
                  <p style="margin: 0;">${cafe.address}</p>
                </div>
              `
            }
          );
          
          // Add event listener to marker
          marker.addEventListener('tap', () => {
            ui.addBubble(bubble);
          });
          
          // Add marker to map
          newMap.addObject(marker);
        });

        setMap(newMap);
      } catch (err) {
        console.error('Error initializing map:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize map');
      }
    };

    if (mapRef.current && !map) {
      initializeMap();
    }

    // Cleanup function
    return () => {
      if (map) {
        map.dispose();
      }
    };
  }, [cafes, centerLat, centerLng, map]);

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div ref={mapRef} style={{ width: '100%', height: '400px' }} />
  );
};