import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

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
        const formattedMerchants = data.map(merchant => ({
          id: merchant.id,
          business_name: merchant.business_name,
          contact_email: merchant.contact_email,
          profiles: {
            verification_status: (merchant.profiles as { verification_status: 'pending' | 'approved' | 'rejected' }).verification_status
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

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
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
          <div className="bg-white rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Contact Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {merchants.map((merchant) => (
                  <TableRow key={merchant.id}>
                    <TableCell>{merchant.business_name}</TableCell>
                    <TableCell>{merchant.contact_email}</TableCell>
                    <TableCell>{getStatusBadge(merchant.profiles.verification_status)}</TableCell>
                    <TableCell>
                      {format(new Date(merchant.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      {merchant.profiles.verification_status === 'pending' && (
                        <div className="space-x-2">
                          <Button
                            size="sm"
                            onClick={() => updateMerchantStatus(merchant.id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateMerchantStatus(merchant.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <div className="bg-white rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Target ID</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="capitalize">{log.action.toLowerCase()}</TableCell>
                    <TableCell>{log.table_name}</TableCell>
                    <TableCell className="font-mono text-sm">{log.target_id}</TableCell>
                    <TableCell>
                      {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;