import { Cafe } from "@/types/cafe";

export const CAFES_NEUKOELLN: Cafe[] = [
  {
    id: "nk1",
    title: "K-fet",
    description: "Cozy neighborhood café with excellent pastries and coffee.",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8",
    address: "Weichselstraße 7, 12043 Berlin",
    occupancy: "Moderate",
    price: "2",
    priceRange: "budget",
    amenities: ["wifi", "coffee", "food"],
    tags: ["cozy", "pastries", "neighborhood"],
    coordinates: { lat: 52.497730, lng: 13.422150 },
    reviews: []
  }
  // ... Add more Neukölln cafes
];