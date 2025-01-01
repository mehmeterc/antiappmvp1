import { useEffect, useRef, useState } from 'react';
import { Card } from './ui/card';
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    H: any;
  }
}

interface CafeMapProps {
  cafes: Array<{
    id: string;
    title: string;
    address: string;
    coordinates: { lat: number; lng: number };
  }>;
  centerLat?: number;
  centerLng?: number;
}

export const CafeMap = ({ cafes, centerLat = 52.520008, centerLng = 13.404954 }: CafeMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initializeMap = async () => {
      try {
        // Get API key from Supabase
        const { data: { secret }, error } = await supabase.rpc('get_secret', {
          secret_name: 'HERE_MAPS_API_KEY'
        });

        if (error) throw error;

        // Initialize the platform with the API key
        const platform = new window.H.service.Platform({
          apikey: secret
        });

        // Get default map layers
        const defaultLayers = platform.createDefaultLayers();

        // Create map instance
        const mapInstance = new window.H.Map(
          mapRef.current,
          defaultLayers.vector.normal.map,
          {
            center: { lat: centerLat, lng: centerLng },
            zoom: 13,
            pixelRatio: window.devicePixelRatio || 1
          }
        );

        // Add map behavior (pan, zoom, etc.)
        const behavior = new window.H.mapevents.Behavior(
          new window.H.mapevents.MapEvents(mapInstance)
        );

        // Add UI components
        const ui = new window.H.ui.UI.createDefault(mapInstance, defaultLayers);

        // Create marker group
        const markerGroup = new window.H.map.Group();
        mapInstance.addObject(markerGroup);

        // Add markers for each cafe
        cafes.forEach(cafe => {
          const marker = new window.H.map.Marker({
            lat: cafe.coordinates.lat,
            lng: cafe.coordinates.lng
          });

          // Add info bubble to marker
          marker.addEventListener('tap', (evt: any) => {
            const bubble = new window.H.ui.InfoBubble(evt.target.getGeometry(), {
              content: `<div style="padding: 8px;"><b>${cafe.title}</b><br/>${cafe.address}</div>`
            });
            ui.addBubble(bubble);
          });

          markerGroup.addObject(marker);
        });

        // Request user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              mapInstance.setCenter(userLocation);
            },
            (error) => {
              console.log('Geolocation error:', error);
              toast({
                title: "Location access denied",
                description: "Using default map center location",
              });
            }
          );
        }

        setMap(mapInstance);

        // Cleanup function
        return () => {
          if (mapInstance) {
            mapInstance.dispose();
          }
        };
      } catch (error) {
        console.error('Error initializing map:', error);
        toast({
          title: "Error loading map",
          description: "Please try again later",
          variant: "destructive"
        });
      }
    };

    if (mapRef.current && !map) {
      initializeMap();
    }
  }, [centerLat, centerLng, cafes, map, toast]);

  return (
    <Card className="w-full h-[400px] overflow-hidden">
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </Card>
  );
};