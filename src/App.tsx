import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import SavedCafes from "./pages/SavedCafes";
import History from "./pages/History";
import Messages from "./pages/Messages";
import Reviews from "./pages/Reviews";
import MerchantProfile from "./pages/MerchantProfile";
import MerchantRegistration from "./pages/MerchantRegistration";
import AdminDashboard from "./pages/AdminDashboard";
import CafeDetails from "./pages/CafeDetails";
import CheckInStatus from "./pages/CheckInStatus";
import About from "./pages/About";
import { Toaster } from "./components/ui/sonner";
import { useSession } from "@supabase/auth-helpers-react";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const session = useSession();

  useEffect(() => {
    console.log("App: Auth session state changed:", session ? "Logged in" : "Logged out");
  }, [session]);

  return (
    <Router>
      <Navigation />
      <div className="pt-16 pb-20">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/cafe/:id" element={<CafeDetails />} />
          
          {/* Protected Routes */}
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
          <Route path="/merchant/profile" element={
            <ProtectedRoute>
              <MerchantProfile />
            </ProtectedRoute>
          } />
          <Route path="/merchant/register" element={
            <ProtectedRoute>
              <MerchantRegistration />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/check-in/:id" element={
            <ProtectedRoute>
              <CheckInStatus />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
      <Footer />
      <Toaster />
    </Router>
  );
}

export default App;