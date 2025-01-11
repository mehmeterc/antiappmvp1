import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Tag, Calendar, Percent } from "lucide-react";
import { toast } from "sonner";

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount_percentage: number;
  start_time: string;
  end_time: string;
  active: boolean;
}

const Promotions = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      if (!session?.user?.id) return;

      try {
        console.log("Fetching promotions for merchant:", session.user.id);
        const { data, error } = await supabase
          .from('promotions')
          .select('*')
          .eq('merchant_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        console.log("Fetched promotions:", data);
        setPromotions(data || []);
      } catch (error) {
        console.error("Error fetching promotions:", error);
        toast.error("Failed to load promotions");
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, [session, supabase]);

  const handleCreatePromotion = () => {
    // TODO: Implement promotion creation modal
    toast.info("Promotion creation coming soon!");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Promotions</h1>
          <Button onClick={handleCreatePromotion}>
            <Plus className="h-4 w-4 mr-2" />
            Create Promotion
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        ) : promotions.length === 0 ? (
          <Card className="p-8 text-center">
            <Tag className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No Promotions Yet</h3>
            <p className="text-gray-500 mb-4">
              Create your first promotion to attract more customers!
            </p>
            <Button onClick={handleCreatePromotion}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Promotion
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6">
            {promotions.map((promotion) => (
              <Card key={promotion.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{promotion.title}</h3>
                    <p className="text-gray-600 mb-4">{promotion.description}</p>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center text-sm text-gray-500">
                        <Percent className="h-4 w-4 mr-1" />
                        {promotion.discount_percentage}% off
                      </span>
                      <span className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(promotion.start_time).toLocaleDateString()} - {new Date(promotion.end_time).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant={promotion.active ? "default" : "secondary"}
                    className="min-w-[100px]"
                  >
                    {promotion.active ? "Active" : "Inactive"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Promotions;