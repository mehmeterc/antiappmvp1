import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { Layout } from "@/components/Layout";
import { BookingForm } from "@/components/BookingForm";
import { CheckInQRCode } from "@/components/CheckInQRCode";
import { ReviewsManager } from "@/components/ReviewsManager";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CafeHeader } from "@/components/cafe/CafeHeader";
import { CafeAmenities } from "@/components/cafe/CafeAmenities";
import { CafeInfo } from "@/components/cafe/CafeInfo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";
import { Cafe } from "@/types/cafe";

const CafeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = useSession();
  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchCafeDetails = async () => {
      try {
        setLoading(true);
        console.log("Fetching cafe details for ID:", id);

        const { data: cafeData, error } = await supabase
          .from('cafes')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching cafe:", error);
          throw error;
        }

        if (!cafeData) {
          throw new Error("Cafe not found");
        }

        console.log("Found cafe:", cafeData);
        setCafe(cafeData);

        // Check if cafe is saved (only if user is logged in)
        if (session?.user?.id) {
          const { data: savedCafe } = await supabase
            .from('saved_cafes')
            .select('*')
            .eq('cafe_id', id)
            .eq('user_id', session.user.id)
            .maybeSingle();
          
          setIsSaved(!!savedCafe);
        }

      } catch (err) {
        console.error("Error in fetchCafeDetails:", err);
        toast.error("Failed to load cafe details");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCafeDetails();
    }
  }, [id, session?.user?.id, navigate]);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      toast.error("Please log in to save cafes");
      return;
    }

    try {
      if (!isSaved) {
        const { error: saveError } = await supabase
          .from('saved_cafes')
          .insert({ 
            cafe_id: id,
            user_id: session.user.id 
          });

        if (saveError) throw saveError;
        setIsSaved(true);
        toast.success("Cafe saved!");
      } else {
        const { error: deleteError } = await supabase
          .from('saved_cafes')
          .delete()
          .eq('cafe_id', id)
          .eq('user_id', session.user.id);

        if (deleteError) throw deleteError;
        setIsSaved(false);
        toast.success("Cafe removed from saved list");
      }
    } catch (error) {
      console.error("Error saving cafe:", error);
      toast.error("Failed to update saved status");
    }
  };

  const handleDirectCheckIn = () => {
    if (!session) {
      toast.error("Please log in to check in");
      return;
    }
    if (id) {
      navigate(`/checkin-status/${id}`);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  if (!cafe) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Cafe not found
          </h2>
          <Button onClick={() => navigate('/')}>Go Back</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <CafeHeader cafe={cafe} isSaved={isSaved} onSave={handleSave} />

          <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            <CafeAmenities amenities={cafe.amenities} />
            <CafeInfo cafe={cafe} pricePerHour={parseFloat(cafe.price)} />
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