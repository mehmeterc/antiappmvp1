import { Cafe } from "@/types/cafe";

interface MapMarkersProps {
  map: any;
  cafes: Cafe[];
}

export const MapMarkers = ({ map, cafes }: MapMarkersProps) => {
  if (!map) return null;

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
      const ui = window.H.ui.UI.getDefault(map);
      ui.addBubble(bubble);
    });
    
    // Add marker to map
    map.addObject(marker);
  });

  return null;
};