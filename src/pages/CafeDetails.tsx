import { useParams, useNavigate } from "react-router-dom";
import { BERLIN_CAFES } from "@/data/mockCafes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Wifi, Coffee, Plug, Baby, Volume2, MapPin, Clock, Euro, QrCode, LogIn } from "lucide-react";
import { Layout } from "@/components/Layout";
import { BookingForm } from "@/components/BookingForm";
import { CheckInQRCode } from "@/components/CheckInQRCode";
import { ReviewsManager } from "@/components/ReviewsManager";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AddressLink } from "@/components/AddressLink";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const getAmenityIcon = (amenity: string) => {
  switch (amenity.toLowerCase()) {
    case 'wifi':
      return <Wifi className="h-4 w-4" />;
    case 'coffee':
      return <Coffee className="h-4 w-4" />;
    case 'power':
      return <Plug className="h-4 w-4" />;
    case 'baby':
      return <Baby className="h-4 w-4" />;
    case 'quiet':
      return <Volume2 className="h-4 w-4" />;
    default:
      return null;
  }
};

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

    // Load and merge reviews from both cafe data and booking history
    if (cafe) {
      const bookingHistory = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
      const historyReviews = bookingHistory
        .filter((booking: any) => booking.cafeId === id && booking.review)
        .map((booking: any) => ({
          id: `hist_${booking.id}`,
          userId: booking.deviceId || 'anonymous',
          userName: "Anonymous User",
          rating: booking.review.rating,
          comment: booking.review.comment,
          date: booking.review.date
        }));

      // Update local storage with merged reviews
      const updatedCafes = JSON.parse(localStorage.getItem('BERLIN_CAFES') || '[]').map((c: any) => {
        if (c.id === id) {
          return {
            ...c,
            reviews: [...(c.reviews || []), ...historyReviews]
          };
        }
        return c;
      });
      localStorage.setItem('BERLIN_CAFES', JSON.stringify(updatedCafes));
    }
  }, [id, cafe]);

  const handleDirectCheckIn = () => {
    if (id) {
      navigate(`/checkin-status/${id}`);
    }
  };

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

  if (!cafe) {
    return <div className="text-center py-12">Cafe not found</div>;
  }

  const getPricePerHour = (priceLevel: string) => {
    const level = parseInt(priceLevel);
    return level * 2;
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
                <AddressLink 
                  address={cafe.address} 
                  cafeName={cafe.title} 
                  className="text-gray-600" 
                />
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
            <ReviewsManager cafeId={cafe.id} initialReviews={cafe.reviews || []} />
          </div>
        </div>

        <div className="md:col-span-1 space-y-6">
          <BookingForm cafeId={cafe.id} price={cafe.price} />
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Check In Options</h3>
            <Tabs defaultValue="qr">
              <TabsList className="w-full">
                <TabsTrigger value="qr" className="flex-1">QR Code</TabsTrigger>
                <TabsTrigger value="direct" className="flex-1">Direct Check-in</TabsTrigger>
              </TabsList>
              <TabsContent value="qr">
                <CheckInQRCode cafeId={cafe.id} price={cafe.price} />
              </TabsContent>
              <TabsContent value="direct">
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600">Click below to check in directly</p>
                  <Button 
                    onClick={handleDirectCheckIn}
                    className="w-full"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Check In Here
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CafeDetails;