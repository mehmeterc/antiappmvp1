import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

export const MerchantRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(true);
  const [isMerchant, setIsMerchant] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMerchantStatus = async () => {
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

        setIsMerchant(data?.account_type === 'merchant');
      } catch (error) {
        console.error("Error checking merchant status:", error);
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkMerchantStatus();
  }, [session, supabase, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session || !isMerchant) {
    return null;
  }

  return <>{children}</>;
};