import { 
  LayoutDashboard,
  User,
  Tag,
  Star,
  Info,
  HelpCircle,
  LogOut 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

interface MerchantMenuProps {
  onClose?: () => void;
}

export const MerchantMenu = ({ onClose }: MerchantMenuProps) => {
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  const menuItems = [
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
      icon: <Tag className="h-4 w-4" />, 
      path: "/merchant/promotions" 
    },
    { 
      label: "Reviews", 
      icon: <Star className="h-4 w-4" />, 
      path: "/merchant/reviews" 
    },
    { 
      label: "About AntiApp", 
      icon: <Info className="h-4 w-4" />, 
      path: "/about" 
    },
    { 
      label: "Support", 
      icon: <HelpCircle className="h-4 w-4" />, 
      path: "/support" 
    },
  ];

  const handleLogout = async () => {
    try {
      console.log("MerchantMenu: Starting logout process");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log("MerchantMenu: Logout successful");
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');
      toast.success("Logged out successfully");
    } catch (error) {
      console.error('MerchantMenu: Logout error:', error);
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');
      toast.error("Error during logout, session cleared");
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <div className="space-y-4 mt-4">
      {menuItems.map((item) => (
        <Button
          key={item.path}
          variant="ghost"
          className="w-full justify-start"
          onClick={() => handleNavigation(item.path)}
        >
          {item.icon}
          <span className="ml-2">{item.label}</span>
        </Button>
      ))}
      <Button
        variant="destructive"
        className="w-full justify-start mt-8"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  );
};