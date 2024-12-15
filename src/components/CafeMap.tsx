import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLngExpression } from 'leaflet';
import { useNavigate } from 'react-router-dom';

// Fix for default marker icon in react-leaflet
const icon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
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
  
  // Define center coordinates as LatLngExpression
  const center: LatLngExpression = [52.520008, 13.404954];
  
  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: '600px', width: '100%', borderRadius: '0.5rem' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {cafes.map((cafe) => {
        const position: LatLngExpression = [cafe.coordinates.lat, cafe.coordinates.lng];
        return (
          <Marker
            key={cafe.id}
            position={position}
            icon={icon}
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
        );
      })}
    </MapContainer>
  );
};