import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { 
  Users, 
  TrendingUp, 
  Clock, 
  Star,
  Calendar
} from "lucide-react";

interface DashboardStats {
  totalBookings: number;
  averageRating: number;
  activePromotions: number;
  todayBookings: number;
}

const Dashboard = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    averageRating: 0,
    activePromotions: 0,
    todayBookings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!session?.user?.id) return;

      try {
        console.log("Fetching dashboard stats for merchant:", session.user.id);
        
        // Get total bookings
        const { data: bookings } = await supabase
          .from('booking_history')
          .select('*')
          .eq('merchant_id', session.user.id);

        // Get average rating
        const { data: reviews } = await supabase
          .from('reviews')
          .select('rating')
          .eq('merchant_id', session.user.id);

        // Get active promotions
        const { data: promotions } = await supabase
          .from('promotions')
          .select('*')
          .eq('merchant_id', session.user.id)
          .eq('active', true);

        // Calculate stats
        const totalBookings = bookings?.length || 0;
        const averageRating = reviews?.length 
          ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length 
          : 0;
        const activePromotions = promotions?.length || 0;
        
        // Calculate today's bookings
        const today = new Date().toISOString().split('T')[0];
        const todayBookings = bookings?.filter(booking => 
          booking.check_in_time.startsWith(today)
        ).length || 0;

        setStats({
          totalBookings,
          averageRating,
          activePromotions,
          todayBookings
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [session, supabase]);

  const statCards = [
    {
      title: "Today's Bookings",
      value: stats.todayBookings,
      icon: <Calendar className="h-6 w-6 text-blue-500" />,
      description: "Bookings for today"
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: <Users className="h-6 w-6 text-green-500" />,
      description: "All-time bookings"
    },
    {
      title: "Average Rating",
      value: `${stats.averageRating.toFixed(1)}/5`,
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      description: "Overall rating"
    },
    {
      title: "Active Promotions",
      value: stats.activePromotions,
      icon: <TrendingUp className="h-6 w-6 text-purple-500" />,
      description: "Current promotions"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Merchant Dashboard</h1>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">{stat.title}</h3>
                  {stat.icon}
                </div>
                <p className="text-3xl font-bold mb-2">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.description}</p>
              </Card>
            ))}
          </div>
        )}

        {/* Recent Activity Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
          <Card className="p-6">
            <div className="flex items-center justify-center h-40 text-gray-500">
              <Clock className="h-6 w-6 mr-2" />
              <span>Activity feed coming soon</span>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;