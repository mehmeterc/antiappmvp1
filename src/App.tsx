import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider, useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import SavedCafes from "./pages/SavedCafes";
import History from "./pages/History";
import Messages from "./pages/Messages";
import Reviews from "./pages/Reviews";
import Login from "./pages/Login";
import CafeDetails from "./pages/CafeDetails";
import CheckInStatus from "./pages/CheckInStatus";
import MerchantRegistration from "./pages/MerchantRegistration";
import MerchantProfile from "./pages/MerchantProfile";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen pt-16 pb-20">
              <Navigation />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/search" element={<Search />} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/saved" element={
                  <ProtectedRoute>
                    <SavedCafes />
                  </ProtectedRoute>
                } />
                <Route path="/history" element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                } />
                <Route path="/messages" element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                } />
                <Route path="/reviews" element={
                  <ProtectedRoute>
                    <Reviews />
                  </ProtectedRoute>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/cafe/:id" element={<CafeDetails />} />
                <Route path="/checkin-status/:id" element={
                  <ProtectedRoute>
                    <CheckInStatus />
                  </ProtectedRoute>
                } />
                <Route path="/merchant/register" element={
                  <ProtectedRoute>
                    <MerchantRegistration />
                  </ProtectedRoute>
                } />
                <Route path="/merchant/profile" element={
                  <MerchantRoute>
                    <MerchantProfile />
                  </MerchantRoute>
                } />
              </Routes>
              <Footer />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  );
};

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  
  if (!session) {
    console.log("No session found, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Merchant Route component
const MerchantRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(true);
  const [isMerchant, setIsMerchant] = useState(false);

  useEffect(() => {
    const checkMerchantStatus = async () => {
      if (!session?.user?.id) {
        setLoading(false);
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
      } finally {
        setLoading(false);
      }
    };

    checkMerchantStatus();
  }, [session, supabase]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    console.log("No session found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (!isMerchant) {
    console.log("User is not a merchant, redirecting to home");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default App;