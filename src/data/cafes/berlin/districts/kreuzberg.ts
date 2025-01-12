import { Cafe } from "@/types/cafe";

export const CAFES_KREUZBERG: Cafe[] = [
  {
    id: "5",
    title: "Five Elephant",
    description: "Specialty coffee roastery and cake shop known for their legendary cheesecake. Bright, modern space with expert baristas.",
    rating: 4.8,
    image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c",
    address: "Reichenberger Str. 101, 10999 Berlin",
    occupancy: "Busy",
    price: "3",
    price_range: "moderate",
    amenities: ["wifi", "power", "coffee", "cake"],
    tags: ["specialty coffee", "cake", "roastery"],
    lat: 52.497377,
    lng: 13.428041,
    created_at: new Date().toISOString(),
    reviews: []
  },
  {
    id: "6",
    title: "Concierge Coffee",
    description: "Tiny but charming coffee spot serving exceptional espresso drinks. Known for their attention to detail.",
    rating: 4.7,
    image_url: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8",
    address: "Paul-Lincke-Ufer 39-40, 10999 Berlin",
    occupancy: "Cozy",
    price: "2",
    price_range: "budget",
    amenities: ["coffee", "outdoor"],
    tags: ["specialty coffee", "intimate", "takeaway"],
    lat: 52.497730,
    lng: 13.422150,
    created_at: new Date().toISOString(),
    reviews: []
  }
];