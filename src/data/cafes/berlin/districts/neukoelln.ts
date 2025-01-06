import { Cafe } from "@/types/cafe";

// Generate 25 cafes for Neukölln district
export const CAFES_NEUKOELLN: Cafe[] = Array.from({ length: 25 }, (_, i) => ({
  id: `n${i + 1}`,
  title: `Neukölln Studio ${i + 1}`,
  description: [
    "Creative workspace with art gallery",
    "Multicultural coworking hub",
    "Urban workspace with rooftop access",
    "Modern space with event facilities",
    "Collaborative environment for startups"
  ][Math.floor(Math.random() * 5)],
  rating: Number((4 + Math.random()).toFixed(1)),
  image: [
    "https://images.unsplash.com/photo-1559925393-8be0ec4767c8",
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb",
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24",
    "https://images.unsplash.com/photo-1497366216548-37526070297c",
  ][Math.floor(Math.random() * 4)],
  address: `${["Weserstraße", "Sonnenallee", "Karl-Marx-Straße", "Hermannstraße"][Math.floor(Math.random() * 4)]} ${Math.floor(Math.random() * 100)}, 12045 Berlin`,
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
  tags: ["creative hub", "coworking", "events space"].sort(() => Math.random() - 0.5),
  coordinates: {
    lat: 52.48 + (Math.random() * 0.02),
    lng: 13.43 + (Math.random() * 0.02)
  },
  reviews: []
}));