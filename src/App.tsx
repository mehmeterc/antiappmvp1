import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import AdminDashboard from "./pages/AdminDashboard";
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
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  );
};

// Separate component for main app content to use hooks
const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error checking session:", error);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Session check error:", error);
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
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
        <Route path="/login" element={
          session ? <Navigate to="/" replace /> : <Login />
        } />
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
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
      </Routes>
      <Footer />
    </div>
  );
};

// Protected Route component with loading state
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (!currentSession) {
          console.log("No session found, redirecting to login");
          navigate("/login", { state: { from: location.pathname }, replace: true });
        }
      } catch (error) {
        console.error("Auth check error:", error);
        navigate("/login", { state: { from: location.pathname }, replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
};

// Merchant Route component with improved session handling
const MerchantRoute = ({ children }: { children: React.ReactNode }) => {
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

// Admin Route component with improved session handling
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
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

export default App;