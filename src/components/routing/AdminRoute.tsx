import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        navigate("/login", { replace: true });
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        setIsAdmin(data?.account_type === 'admin');
      } catch (error) {
        console.error("Error checking admin status:", error);
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [session, supabase, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session || !isAdmin) {
    return null;
  }

  return <>{children}</>;
};