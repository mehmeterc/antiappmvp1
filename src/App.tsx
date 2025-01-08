import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { Index } from "./pages/Index";
import { Search } from "./pages/Search";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { SavedCafes } from "./pages/SavedCafes";
import { History } from "./pages/History";
import { Messages } from "./pages/Messages";
import { Reviews } from "./pages/Reviews";
import { MerchantProfile } from "./pages/MerchantProfile";
import { MerchantRegistration } from "./pages/MerchantRegistration";
import { AdminDashboard } from "./pages/AdminDashboard";
import { CafeDetails } from "./pages/CafeDetails";
import { CheckInStatus } from "./pages/CheckInStatus";
import { About } from "./pages/About";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <Router>
      <Navigation />
      <div className="pt-16 pb-20">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/saved" element={<SavedCafes />} />
          <Route path="/history" element={<History />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/merchant/profile" element={<MerchantProfile />} />
          <Route path="/merchant/register" element={<MerchantRegistration />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/cafe/:id" element={<CafeDetails />} />
          <Route path="/check-in/:id" element={<CheckInStatus />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
      <Footer />
      <Toaster />
    </Router>
  );
}

export default App;