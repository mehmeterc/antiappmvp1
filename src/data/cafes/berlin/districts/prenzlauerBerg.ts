import { Cafe } from "@/types/cafe";

export const CAFES_PRENZLAUER_BERG: Cafe[] = [
  {
    id: "3",
    title: "Bonanza Coffee Heroes",
    description: "Pioneer of Berlin's third-wave coffee scene with in-house roasting. Bright, minimalist space perfect for coffee enthusiasts.",
    rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24",
    address: "Oderberger Str. 35, 10435 Berlin",
    occupancy: "Moderate",
    price: "3",
    price_range: "moderate",
    amenities: ["wifi", "power", "coffee", "community"],
    tags: ["coffee", "roastery", "specialty"],
    lat: 52.541512,
    lng: 13.409894,
    created_at: new Date().toISOString(),
    reviews: []
  },
  {
    id: "4",
    title: "No Fire No Glory",
    description: "Cozy café with excellent coffee and homemade cakes. Popular among digital nomads and locals.",
    rating: 4.6,
    image_url: "https://images.unsplash.com/photo-1521017432531-fbd92d768814",
    address: "Rykestraße 45, 10405 Berlin",
    occupancy: "Busy weekends",
    price: "2",
    price_range: "budget",
    amenities: ["wifi", "coffee", "food", "outdoor"],
    tags: ["cozy", "cakes", "work-friendly"],
    lat: 52.532562,
    lng: 13.419894,
    created_at: new Date().toISOString(),
    reviews: []
  }
];