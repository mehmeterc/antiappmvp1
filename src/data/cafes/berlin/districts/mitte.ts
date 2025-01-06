import { Cafe } from "@/types/cafe";

export const CAFES_MITTE: Cafe[] = [
  {
    id: "m1",
    title: "The Barn Coffee Roasters",
    description: "Specialty coffee roastery with minimalist design and expert baristas.",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24",
    address: "Auguststraße 58, 10119 Berlin",
    occupancy: "Usually busy",
    price: "6",
    priceRange: "premium",
    amenities: ["wifi", "power", "coffee", "quiet", "focus"],
    tags: ["specialty coffee", "minimalist", "roastery"],
    coordinates: { lat: 52.527977, lng: 13.399520 },
    reviews: []
  },
  {
    id: "m2",
    title: "Father Carpenter",
    description: "Hidden gem in a beautiful courtyard serving excellent coffee and brunch.",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
    address: "Münzstraße 21, 10178 Berlin",
    occupancy: "Busy weekends",
    price: "4",
    priceRange: "moderate",
    amenities: ["wifi", "power", "coffee", "food", "outdoor"],
    tags: ["brunch", "courtyard", "specialty coffee"],
    coordinates: { lat: 52.524556, lng: 13.409364 },
    reviews: []
  }
  // ... Add more Mitte cafes
];