import { useEffect, useState } from "react";
import { SpaceCard } from "@/components/SpaceCard";
import { BERLIN_CAFES } from "@/data/mockCafes";
import { useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { calculateDistance } from "@/utils/searchUtils";
import { Cafe } from "@/types/cafe";
import { toast } from "sonner";

const Search = () => {
  const location = useLocation();
  const { filters = [], searchTerm = "", priceRange = [0, 12] } = location.state || {};
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [cafesWithDistance, setCafesWithDistance] = useState<Cafe[]>([]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not get your location. Distances will not be shown.");
        }
      );
    }
  }, []);

  useEffect(() => {
    let filteredCafes = BERLIN_CAFES.filter(cafe => {
      const matchesSearch = searchTerm.length === 0 || 
        cafe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cafe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cafe.address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters = filters.length === 0 || 
        filters.every(filter => cafe.amenities.includes(filter));

      const priceValue = parseFloat(cafe.price.replace('€', ''));
      const matchesPrice = priceValue >= priceRange[0] && priceValue <= priceRange[1];

      return matchesSearch && matchesFilters && matchesPrice;
    });

    if (userLocation) {
      filteredCafes = filteredCafes.map(cafe => ({
        ...cafe,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          cafe.coordinates.lat,
          cafe.coordinates.lng
        )
      })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    setCafesWithDistance(filteredCafes);
  }, [filters, searchTerm, priceRange, userLocation]);

  return (
    <Layout>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cafesWithDistance.map((cafe) => (
          <SpaceCard key={cafe.id} {...cafe} />
        ))}
      </div>
    </Layout>
  );
};

export default Search;