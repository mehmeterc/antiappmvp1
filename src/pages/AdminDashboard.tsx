import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { MerchantList } from "@/components/admin/MerchantList";
import { AdminLogs } from "@/components/admin/AdminLogs";

interface MerchantProfile {
  id: string;
  business_name: string;
  contact_email: string;
  profiles: {
    verification_status: 'pending' | 'approved' | 'rejected';
  };
  created_at: string;
}

interface AdminLog {
  id: string;
  admin_id: string;
  table_name: string;
  action: string;
  target_id: string;
  timestamp: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const session = useSession();
  const supabase = useSupabaseClient();
  const [merchants, setMerchants] = useState<MerchantProfile[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!session?.user?.id) {
        navigate('/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', session.user.id)
        .single();

      if (error || profile?.account_type !== 'admin') {
        console.error('Not authorized as admin:', error);
        navigate('/');
        toast.error('You do not have permission to access this page');
        return;
      }

      fetchMerchants();
      fetchAdminLogs();
    };

    checkAdminStatus();
  }, [session, navigate, supabase]);

  const fetchMerchants = async () => {
    try {
      console.log('Fetching merchants...');
      const { data, error } = await supabase
        .from('merchant_profiles')
        .select(`
          id,
          business_name,
          contact_email,
          profiles!inner (verification_status),
          created_at
        `);

      if (error) {
        console.error('Error fetching merchants:', error);
        throw error;
      }

      if (data) {
        console.log('Raw merchant data:', data);
        const formattedMerchants: MerchantProfile[] = data.map(merchant => ({
          id: merchant.id,
          business_name: merchant.business_name,
          contact_email: merchant.contact_email,
          profiles: {
            verification_status: merchant.profiles.verification_status
          },
          created_at: merchant.created_at,
        }));

        console.log('Formatted merchants:', formattedMerchants);
        setMerchants(formattedMerchants);
      }
    } catch (error) {
      console.error('Error fetching merchants:', error);
      toast.error('Failed to load merchants');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdminLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_logs')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;
      setAdminLogs(data);
    } catch (error) {
      console.error('Error fetching admin logs:', error);
      toast.error('Failed to load admin logs');
    }
  };

  const updateMerchantStatus = async (merchantId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ verification_status: status })
        .eq('id', merchantId);

      if (error) throw error;

      toast.success(`Merchant ${status} successfully`);
      fetchMerchants();
      fetchAdminLogs();
    } catch (error) {
      console.error('Error updating merchant status:', error);
      toast.error('Failed to update merchant status');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="merchants">
        <TabsList className="mb-4">
          <TabsTrigger value="merchants">Merchant Management</TabsTrigger>
          <TabsTrigger value="logs">Admin Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="merchants">
          <MerchantList 
            merchants={merchants} 
            onUpdateStatus={updateMerchantStatus} 
          />
        </TabsContent>

        <TabsContent value="logs">
          <AdminLogs logs={adminLogs} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;