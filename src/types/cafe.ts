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
  image: string;
  address: string;
  occupancy: string;
  price: string;
  priceRange: string;
  amenities: string[];
  tags: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  reviews?: Review[]; // Added reviews as optional property
}