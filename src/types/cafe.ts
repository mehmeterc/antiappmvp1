export interface Cafe {
  id: string;
  title: string;
  description: string;
  rating: number;
  image: string;
  address: string;
  occupancy: string;
  price: string;
  amenities: string[];
  tags: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}