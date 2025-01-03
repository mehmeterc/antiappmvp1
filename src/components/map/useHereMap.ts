import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useHereMap = (mapRef: React.RefObject<HTMLDivElement>, centerLat: number, centerLng: number) => {
  const [map, setMap] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [platform, setPlatform] = useState<any>(null);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        // Get API key from Supabase
        const { data, error } = await supabase.rpc('get_secret', { 
          secret_name: 'HERE_MAPS_API_KEY' 
        });

        if (error) throw error;
        
        if (!data || typeof data !== 'object' || !('secret' in data) || typeof data.secret !== 'string') {
          throw new Error('HERE Maps API key not found or invalid');
        }

        console.log('Initializing HERE Maps with API key');

        // Initialize the platform
        const herePlatform = new window.H.service.Platform({
          apikey: data.secret
        });

        setPlatform(herePlatform);

        // Get default map layers
        const defaultLayers = herePlatform.createDefaultLayers();

        // Create map instance
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
        window.H.ui.UI.createDefault(newMap, defaultLayers);

        setMap(newMap);
      } catch (err) {
        console.error('Error initializing map:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize map');
      }
    };

    if (mapRef.current && !map) {
      initializeMap();
    }

    return () => {
      if (map) {
        map.dispose();
      }
    };
  }, [mapRef, centerLat, centerLng, map]);

  return { map, error, platform };
};