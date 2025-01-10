import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  LogIn, 
  Search, 
  Eye, 
  Coffee, 
  Menu, 
  History, 
  MessageSquare, 
  Info, 
  Star, 
  LayoutDashboard,
  Gift,
  HelpCircle,
  LogOut
} from "lucide-react";
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export const Navigation = () => {
  const navigate = useNavigate();
  const session = useSession();
  const supabase = useSupabaseClient();
  const [accountType, setAccountType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Navigation: Initializing auth and profile check");
    
    const fetchAccountType = async () => {
      if (session?.user?.id) {
        console.log("Navigation: Fetching profile for user:", session.user.id);
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('account_type')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error("Navigation: Profile fetch error:", error);
            toast.error("Error loading profile");
          } else if (data) {
            console.log("Navigation: Profile loaded, account type:", data.account_type);
            setAccountType(data.account_type);
          }
        } catch (error) {
          console.error("Navigation: Unexpected error:", error);
          toast.error("Unexpected error occurred");
        }
      } else {
        setAccountType(null);
      }
      setLoading(false);
    };

    fetchAccountType();
  }, [session, supabase]);

  const getMerchantMenuItems = () => [
    { 
      label: "Dashboard", 
      icon: <LayoutDashboard className="h-4 w-4" />, 
      path: "/merchant/dashboard" 
    },
    { 
      label: "Profile", 
      icon: <User className="h-4 w-4" />, 
      path: "/merchant/profile" 
    },
    { 
      label: "Promotions", 
      icon: <Gift className="h-4 w-4" />, 
      path: "/merchant/promotions" 
    },
    { 
      label: "Reviews", 
      icon: <Star className="h-4 w-4" />, 
      path: "/merchant/reviews" 
    },
    { 
      label: "Support", 
      icon: <HelpCircle className="h-4 w-4" />, 
      path: "/support" 
    },
    { 
      label: "About", 
      icon: <Info className="h-4 w-4" />, 
      path: "/about" 
    },
  ];

  const getUserMenuItems = () => [
    { label: "Profile", icon: <User className="h-4 w-4" />, path: "/profile" },
    { label: "Saved Cafes", icon: <Eye className="h-4 w-4" />, path: "/saved" },
    { label: "History", icon: <History className="h-4 w-4" />, path: "/history" },
    { label: "Messages", icon: <MessageSquare className="h-4 w-4" />, path: "/messages" },
    { label: "Reviews", icon: <Star className="h-4 w-4" />, path: "/reviews" },
    { label: "About", icon: <Info className="h-4 w-4" />, path: "/about" },
  ];

  const menuItems = accountType === 'merchant' ? getMerchantMenuItems() : getUserMenuItems();

  const handleLogout = async () => {
    try {
      console.log("Navigation: Starting logout process");
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log("Navigation: Logout successful");
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');
      toast.success("Logged out successfully");
    } catch (error) {
      console.error('Navigation: Logout error:', error);
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');
      toast.error("Error during logout, session cleared");
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md py-4 z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
          <Coffee className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">AntiApp</span>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="hidden md:flex items-center"
            onClick={() => navigate("/search")}
          >
            <Search className="h-4 w-4 mr-2" />
            Find Spaces
          </Button>

          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          ) : session ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigate through AntiApp
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  {menuItems.map((item) => (
                    <Button
                      key={item.path}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => navigate(item.path)}
                    >
                      {item.icon}
                      <span className="ml-2">{item.label}</span>
                    </Button>
                  ))}
                  <Button
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <Button
              className="flex items-center"
              onClick={() => navigate("/login")}
            >
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};