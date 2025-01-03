import { useParams, useNavigate } from "react-router-dom";
import { BERLIN_CAFES } from "@/data/mockCafes";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { Layout } from "@/components/Layout";
import { BookingForm } from "@/components/BookingForm";
import { CheckInQRCode } from "@/components/CheckInQRCode";
import { ReviewsManager } from "@/components/ReviewsManager";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CafeHeader } from "@/components/cafe/CafeHeader";
import { CafeAmenities } from "@/components/cafe/CafeAmenities";
import { CafeInfo } from "@/components/cafe/CafeInfo";

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
          <CafeHeader cafe={cafe} isSaved={isSaved} onSave={handleSave} />

          <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            <CafeAmenities amenities={cafe.amenities} />
            <CafeInfo cafe={cafe} pricePerHour={pricePerHour} />
            <p className="text-gray-700">{cafe.description}</p>
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