import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';

// Fix for default marker icon in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface CafeMapProps {
  cafes: Array<{
    id: string;
    title: string;
    coordinates: { lat: number; lng: number };
    address: string;
  }>;
}

export const CafeMap = ({ cafes }: CafeMapProps) => {
  const navigate = useNavigate();
  
  // Berlin center coordinates
  const defaultCenter = { lat: 52.520008, lng: 13.404954 };
  
  return (
    <MapContainer
      center={[defaultCenter.lat, defaultCenter.lng]}
      zoom={12}
      style={{ height: '600px', width: '100%', borderRadius: '0.5rem' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {cafes.map((cafe) => (
        <Marker
          key={cafe.id}
          position={[cafe.coordinates.lat, cafe.coordinates.lng]}
          eventHandlers={{
            click: () => navigate(`/cafe/${cafe.id}`),
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">{cafe.title}</h3>
              <p className="text-sm text-gray-600">{cafe.address}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};