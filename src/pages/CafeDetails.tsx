import { useParams } from "react-router-dom";
import { BERLIN_CAFES } from "@/data/mockCafes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wifi, Plug, Coffee, Baby, Volume2, MapPin, Clock, Euro } from "lucide-react";
import { toast } from "sonner";

const CafeDetails = () => {
  const { id } = useParams();
  const cafe = BERLIN_CAFES.find(c => c.id === id);

  if (!cafe) {
    return <div className="text-center py-12">Cafe not found</div>;
  }

  const handleBooking = () => {
    toast.success("Booking successful! Check your email for confirmation.");
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "wifi":
        return <Wifi className="w-4 h-4" />;
      case "power":
        return <Plug className="w-4 h-4" />;
      case "coffee":
        return <Coffee className="w-4 h-4" />;
      case "quiet":
        return <Volume2 className="w-4 h-4" />;
      case "baby":
        return <Baby className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-96">
          <img
            src={cafe.image}
            alt={cafe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="font-medium">{cafe.rating}</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{cafe.title}</h1>
            <p className="text-gray-600 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {cafe.address}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {cafe.amenities.map((amenity, i) => (
              <Badge key={i} variant="secondary" className="flex items-center gap-1">
                {getAmenityIcon(amenity)}
                {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
              </Badge>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <span>Open 9:00 - 18:00</span>
            </div>
            <div className="flex items-center gap-2">
              <Euro className="w-4 h-4 text-gray-600" />
              <span>{cafe.price}</span>
            </div>
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-gray-600" />
              <span>{cafe.occupancy}</span>
            </div>
          </div>

          <p className="text-gray-700">{cafe.description}</p>

          <div className="flex gap-4">
            <Button onClick={handleBooking} className="flex-1">
              Book Now
            </Button>
            <Button variant="outline" className="flex-1">
              Contact Space
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CafeDetails;