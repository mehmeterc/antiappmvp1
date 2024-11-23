import { SearchBar } from "@/components/SearchBar";
import { SpaceCard } from "@/components/SpaceCard";

const FEATURED_SPACES = [
  {
    id: "featured-1",
    title: "The Creative Hub",
    description: "A vibrant workspace with natural light and creative atmosphere",
    image: "/lovable-uploads/a60c1e0e-8ca4-4d34-9249-bc543090df63.png",
    rating: 4.8,
    occupancy: "65% Full",
    price: "€3/hour",
    amenities: ["wifi", "power", "coffee", "quiet", "baby"],
    tags: ["Quiet Zone", "Baby-Friendly", "24/7 Access"]
  },
  {
    id: "featured-2",
    title: "Quiet Corner Library",
    description: "Perfect for focused work with dedicated quiet zones",
    image: "/lovable-uploads/a60c1e0e-8ca4-4d34-9249-bc543090df63.png",
    rating: 4.9,
    occupancy: "30% Full",
    price: "€2/hour",
    amenities: ["wifi", "power", "quiet"],
    tags: ["Silent Space", "Study Rooms", "Print Service"]
  },
  {
    id: "featured-3",
    title: "Community Cafe",
    description: "Cozy atmosphere with great coffee and friendly community",
    image: "/lovable-uploads/a60c1e0e-8ca4-4d34-9249-bc543090df63.png",
    rating: 4.7,
    occupancy: "80% Full",
    price: "€4/hour",
    amenities: ["wifi", "power", "coffee", "baby"],
    tags: ["Social Space", "Events", "Baby Corner"]
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6 fade-in">
          <h1 className="text-4xl md:text-6xl font-bold">
            Find Your Perfect Third Place
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Discover cafes, libraries, and community spaces perfect for remote work and connection.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 space-y-16 pb-16">
        <SearchBar />
        
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Featured Spaces</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_SPACES.map((space) => (
              <SpaceCard key={space.id} {...space} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;