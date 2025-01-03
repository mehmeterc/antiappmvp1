import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Cafe } from '@/types/cafe';

interface MapComponentProps {
  cafes: Cafe[];
}

export const LeafletMap = ({ cafes }: MapComponentProps) => {
  // Berlin center coordinates
  const position: L.LatLngExpression = [52.52, 13.405];

  // Custom marker icon to fix the missing icon issue
  const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Add leaflet CSS to document head
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer 
        defaultCenter={position}
        zoom={13} 
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
        className="map-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {cafes.map((cafe) => {
          const cafePosition: L.LatLngExpression = [cafe.coordinates.lat, cafe.coordinates.lng];
          return (
            <Marker 
              key={cafe.id}
              position={cafePosition}
              icon={customIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">{cafe.title}</h3>
                  <p className="text-sm text-gray-600">{cafe.address}</p>
                  <p className="text-sm mt-1">⭐️ {cafe.rating}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${cafe.coordinates.lat},${cafe.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:text-blue-700 mt-2 inline-block"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};