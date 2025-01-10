import { 
  User, 
  Eye, 
  History, 
  MessageSquare, 
  Info, 
  Star,
  HelpCircle,
  LogOut 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

interface UserMenuProps {
  onClose?: () => void;
}

export const UserMenu = ({ onClose }: UserMenuProps) => {
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  const menuItems = [
    { 
      label: "Profile", 
      icon: <User className="h-4 w-4" />, 
      path: "/profile" 
    },
    { 
      label: "Saved Cafes", 
      icon: <Eye className="h-4 w-4" />, 
      path: "/saved" 
    },
    { 
      label: "History", 
      icon: <History className="h-4 w-4" />, 
      path: "/history" 
    },
    { 
      label: "Messages", 
      icon: <MessageSquare className="h-4 w-4" />, 
      path: "/messages" 
    },
    { 
      label: "Reviews", 
      icon: <Star className="h-4 w-4" />, 
      path: "/reviews" 
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

  const handleLogout = async () => {
    try {
      console.log("UserMenu: Starting logout process");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log("UserMenu: Logout successful");
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');
      toast.success("Logged out successfully");
    } catch (error) {
      console.error('UserMenu: Logout error:', error);
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
    <div className="space-y-4">
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
        className="w-full justify-start"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  );
};