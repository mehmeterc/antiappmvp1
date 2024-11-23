export interface Cafe {
  id: string;
  title: string;
  description: string;
  address: string;
  image: string;
  rating: number;
  occupancy: string;
  price: string;
  amenities: string[];
  tags: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const BERLIN_CAFES: Cafe[] = [
  {
    id: "1",
    title: "St. Oberholz",
    description: "Historic coworking cafe with excellent coffee and fast WiFi",
    address: "Rosenthaler Str. 72A, 10119 Berlin",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    rating: 4.7,
    occupancy: "75% Full",
    price: "€4/hour",
    amenities: ["wifi", "power", "coffee", "quiet"],
    tags: ["Historic Building", "Meeting Rooms", "Events"],
    coordinates: {
      lat: 52.529795,
      lng: 13.401590
    }
  },
  {
    id: "2",
    title: "Betahaus Café",
    description: "Cozy cafe inside Berlin's famous coworking space",
    address: "Rudi-Dutschke-Straße 23, 10969 Berlin",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    rating: 4.8,
    occupancy: "45% Full",
    price: "€3.50/hour",
    amenities: ["wifi", "power", "coffee", "baby"],
    tags: ["Coworking", "Community Events", "Workshops"],
    coordinates: {
      lat: 52.507118,
      lng: 13.391737
    }
  },
  {
    id: "3",
    title: "The Barn",
    description: "Specialty coffee roasters with workspace areas",
    address: "Schönhauser Allee 8, 10119 Berlin",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    rating: 4.9,
    occupancy: "60% Full",
    price: "€5/hour",
    amenities: ["wifi", "power", "coffee"],
    tags: ["Coffee Experts", "Quiet Zone", "Garden"],
    coordinates: {
      lat: 52.529671,
      lng: 13.409834
    }
  }
];