export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Cafe {
  id: string;
  title: string;
  description: string;
  rating: number;
  image_url: string;
  address: string;
  occupancy: string;
  price: string;
  price_range: string;
  amenities: string[];
  tags: string[];
  lat: number;
  lng: number;
  created_at: string;
  distance?: number;
  reviews?: Review[];
}