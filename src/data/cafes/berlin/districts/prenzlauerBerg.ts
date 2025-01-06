import { Cafe } from "@/types/cafe";

export const CAFES_PRENZLAUER_BERG: Cafe[] = [
  {
    id: "pb1",
    title: "Bonanza Coffee Heroes",
    description: "Pioneer of Berlin's third-wave coffee scene with in-house roasting.",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24",
    address: "Oderberger Str. 35, 10435 Berlin",
    occupancy: "Moderate",
    price: "3",
    priceRange: "moderate",
    amenities: ["wifi", "power", "coffee", "community"],
    tags: ["coffee", "roastery", "specialty"],
    coordinates: { lat: 52.541512, lng: 13.409894 },
    reviews: []
  }
  // ... Add more Prenzlauer Berg cafes
];