import { Cafe } from "@/types/cafe";

// Generate 25 cafes for Mitte district
export const CAFES_MITTE: Cafe[] = Array.from({ length: 25 }, (_, i) => ({
  id: `m${i + 1}`,
  title: `Mitte Workspace ${i + 1}`,
  description: [
    "Modern coworking space with premium amenities",
    "Quiet workspace perfect for focused work",
    "Creative hub with community events",
    "Tech-friendly environment with high-speed internet",
    "Boutique workspace with artisanal coffee"
  ][Math.floor(Math.random() * 5)],
  rating: Number((4 + Math.random()).toFixed(1)),
  image: [
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24",
    "https://images.unsplash.com/photo-1521017432531-fbd92d768814",
    "https://images.unsplash.com/photo-1497366216548-37526070297c",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
  ][Math.floor(Math.random() * 4)],
  address: `${["Auguststraße", "Torstraße", "Rosenthaler", "Münzstraße"][Math.floor(Math.random() * 4)]} ${Math.floor(Math.random() * 100)}, 10119 Berlin`,
  occupancy: ["Quiet", "Moderate", "Busy"][Math.floor(Math.random() * 3)],
  price: String(Math.floor(Math.random() * 12) + 1),
  priceRange: ["budget", "moderate", "premium"][Math.floor(Math.random() * 3)],
  amenities: [
    ...new Set([
      "wifi",
      "power",
      "coffee",
      "quiet",
      "focus",
      "food",
      "outdoor",
      "community",
      "podcast-room",
      "phone-booth",
      "gym",
      "nap-pods"
    ].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 6) + 3))
  ],
  tags: ["specialty coffee", "workspace", "coworking"].sort(() => Math.random() - 0.5),
  coordinates: {
    lat: 52.52 + (Math.random() * 0.02),
    lng: 13.39 + (Math.random() * 0.02)
  },
  reviews: []
}));