import { Cafe } from "@/types/cafe";

export const CAFES_KREUZBERG: Cafe[] = [
  {
    id: "kb1",
    title: "Five Elephant",
    description: "Specialty coffee roastery and cake shop known for their legendary cheesecake.",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c",
    address: "Reichenberger Str. 101, 10999 Berlin",
    occupancy: "Busy",
    price: "3",
    priceRange: "moderate",
    amenities: ["wifi", "power", "coffee", "cake"],
    tags: ["specialty coffee", "cake", "roastery"],
    coordinates: { lat: 52.497377, lng: 13.428041 },
    reviews: []
  }
  // ... Add more Kreuzberg cafes
];