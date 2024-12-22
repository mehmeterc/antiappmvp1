import { useParams, useNavigate } from "react-router-dom";
import { BERLIN_CAFES } from "@/data/mockCafes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wifi, Plug, Coffee, Baby, Volume2, MapPin, Clock, Euro, Bookmark, QrCode } from "lucide-react";
import { Layout } from "@/components/Layout";
import { BookingForm } from "@/components/BookingForm";
import { CheckInQRCode } from "@/components/CheckInQRCode";
import { Reviews } from "@/components/Reviews";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AddressLink } from "@/components/AddressLink";

const CafeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const cafe = BERLIN_CAFES.find(c => c.id === id);
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedCafes = JSON.parse(localStorage.getItem('savedCafes') || '[]');
    const isAlreadySaved = savedCafes.some((savedCafe: { id: string }) => savedCafe.id === id);
    setIsSaved(isAlreadySaved);
  }, [id]);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSaved(!isSaved);
    
    const savedCafes = JSON.parse(localStorage.getItem('savedCafes') || '[]');
    if (!isSaved && cafe) {
      localStorage.setItem('savedCafes', JSON.stringify([...savedCafes, cafe]));
      toast({
        title: "Cafe saved!",
        description: "Added to your saved spaces.",
      });
    } else {
      localStorage.setItem('savedCafes', JSON.stringify(savedCafes.filter((savedCafe: { id: string }) => savedCafe.id !== id)));
      toast({
        title: "Cafe removed",
        description: "Removed from your saved spaces.",
      });
    }
  };

  const handleDirectCheckIn = () => {
    if (id) {
      navigate(`/checkin-status/${id}`);
    }
  };

  if (!cafe) {
    return <div className="text-center py-12">Cafe not found</div>;
  }

  const getPricePerHour = (priceLevel: string) => {
    const level = parseInt(priceLevel);
    return level * 2; // Now each price level represents 2€ increments
  };

  const pricePerHour = getPricePerHour(cafe.price);

  return (
    <Layout>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-96">
              <img
                src={cafe.image}
                alt={cafe.title}
                className="w-full h-full object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                onClick={handleSave}
              >
                <Bookmark className="h-5 w-5" fill={isSaved ? "currentColor" : "none"} />
              </Button>
              <div className="absolute top-4 left-4 bg-white rounded-full px-3 py-1 flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span className="font-medium">{cafe.rating}</span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{cafe.title}</h1>
                <AddressLink address={cafe.address} className="text-gray-600" />
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
                  <span>{pricePerHour}€/hour ({cafe.price.includes('€€€') ? 'Private Space' : cafe.price.includes('€€') ? 'Premium Desk' : 'Basic Desk'})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-gray-600" />
                  <span>{cafe.occupancy}</span>
                </div>
              </div>

              <p className="text-gray-700">{cafe.description}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <Reviews reviews={cafe.reviews} />
          </div>
        </div>

        <div className="md:col-span-1">
          <BookingForm cafeId={cafe.id} price={pricePerHour.toString()} />
        </div>
      </div>
    </Layout>
  );
};

export default CafeDetails;
