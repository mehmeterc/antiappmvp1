import { useParams, useNavigate } from "react-router-dom";
import { BERLIN_CAFES } from "@/data/mockCafes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wifi, Plug, Coffee, Baby, Volume2, MapPin, Clock, Euro, Bookmark, QrCode } from "lucide-react";
import { Layout } from "@/components/Layout";
import { BookingForm } from "@/components/BookingForm";
import { CheckInQRCode } from "@/components/CheckInQRCode";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

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

  const getPricePerHour = (priceLevel: string) => {
    const level = priceLevel.replace(/[^€]/g, '').length;
    switch (level) {
      case 1: return 5; // Basic desk
      case 2: return 10; // Premium desk
      case 3: return 30; // Private space/room
      default: return 5;
    }
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
                className="absolute top-4 left-4 bg-white/80 hover:bg-white"
                onClick={handleSave}
              >
                <Bookmark className="h-5 w-5" fill={isSaved ? "currentColor" : "none"} />
              </Button>
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
            <div className="flex flex-col space-y-4">
              <h3 className="text-xl font-semibold mb-4">Check In Options</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <QrCode className="w-4 h-4" />
                    Scan QR Code
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">Scan the QR code with your phone to check in</p>
                  <CheckInQRCode cafeId={cafe.id} price={pricePerHour.toString()} />
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Direct Check In</h4>
                  <p className="text-sm text-gray-600 mb-4">Check in directly from this device</p>
                  <Button 
                    onClick={handleDirectCheckIn}
                    className="w-full"
                  >
                    Check In Now
                  </Button>
                </div>
              </div>
            </div>
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