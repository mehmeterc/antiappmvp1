import { SearchBar } from "@/components/SearchBar";
import { SpaceCard } from "@/components/SpaceCard";
import { BERLIN_CAFES } from "@/data/mockCafes";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const Index = () => {
  // Get top rated cafes (rating >= 4.7)
  const highlightedCafes = BERLIN_CAFES
    .filter(cafe => cafe.rating >= 4.7)
    .slice(0, 5);

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
          <h2 className="text-3xl font-bold">Top Rated Spaces</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {highlightedCafes.map((cafe) => (
                <CarouselItem key={cafe.id} className="md:basis-1/2 lg:basis-1/3">
                  <SpaceCard {...cafe} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Index;