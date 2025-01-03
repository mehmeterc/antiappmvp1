import { SearchBar } from "@/components/SearchBar";
import { BERLIN_CAFES } from "@/data/mockCafes";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { LeafletMap } from "@/components/LeafletMap";

const Index = () => {
  // Get top rated cafes for highlights
  const highlightedCafes = BERLIN_CAFES
    .filter(cafe => cafe.rating >= 4.7)
    .slice(0, 4);

  // Get all cafes for the main list
  const allCafes = BERLIN_CAFES.slice(0, 8);

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

      <div className="max-w-7xl mx-auto px-4 -mt-10 space-y-12 pb-16">
        <SearchBar />

        {/* Map Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Explore Nearby Spaces</h2>
          <LeafletMap cafes={BERLIN_CAFES} />
        </section>

        {/* Highlights of the Week */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Highlights of the Week</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {highlightedCafes.map((cafe) => (
              <Link 
                key={cafe.id} 
                to={`/cafe/${cafe.id}`}
                className="group hover:opacity-95 transition-opacity"
              >
                <Card className="overflow-hidden border-none shadow-md">
                  <div className="relative h-32">
                    <img
                      src={cafe.image}
                      alt={cafe.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {cafe.rating}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm truncate">{cafe.title}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {cafe.address.split(',')[0]}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* All Available Spaces */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Available Spaces</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCafes.map((cafe) => (
              <Link 
                key={cafe.id} 
                to={`/cafe/${cafe.id}`}
                className="group hover:opacity-95 transition-opacity"
              >
                <Card className="overflow-hidden h-full border-none shadow-md">
                  <div className="relative h-48">
                    <img
                      src={cafe.image}
                      alt={cafe.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {cafe.rating}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-lg">{cafe.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-2">
                      <MapPin className="w-4 h-4" />
                      {cafe.address}
                    </p>
                    <div className="flex gap-2 mt-3">
                      {cafe.amenities.slice(0, 3).map((amenity) => (
                        <Badge key={amenity} variant="outline">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;