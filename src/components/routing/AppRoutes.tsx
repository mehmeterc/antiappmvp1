
import { Routes, Route, Navigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { ProtectedRoute } from "./ProtectedRoute";
import { MerchantRoute } from "./MerchantRoute";
import { AdminRoute } from "./AdminRoute";
import Index from "@/pages/Index";
import Search from "@/pages/Search";
import Profile from "@/pages/Profile";
import SavedCafes from "@/pages/SavedCafes";
import History from "@/pages/History";
import Messages from "@/pages/Messages";
import Reviews from "@/pages/Reviews";
import Login from "@/pages/Login";
import ResetPassword from "@/pages/ResetPassword";
import CafeDetails from "@/pages/CafeDetails";
import CheckInStatus from "@/pages/CheckInStatus";
import MerchantRegistration from "@/pages/MerchantRegistration";
import MerchantProfile from "@/pages/MerchantProfile";
import AdminDashboard from "@/pages/AdminDashboard";

export const AppRoutes = () => {
  const session = useSession();

  return (
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
      <Route path="/reset-password" element={<ResetPassword />} />
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
  );
};
