import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { User, LogIn, Search, BookMarked, Coffee, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Navigation = () => {
  const navigate = useNavigate();
  const isLoggedIn = false; // TODO: Replace with actual auth state

  const menuItems = [
    { label: "Find Spaces", icon: <Search className="h-4 w-4" />, path: "/search" },
    { label: "Saved Cafes", icon: <BookMarked className="h-4 w-4" />, path: "/saved" },
    { label: "Profile", icon: <User className="h-4 w-4" />, path: "/profile" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md py-4 z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2" onClick={() => navigate("/")}>
          <Coffee className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">AntiApp</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="ghost"
            className="flex items-center"
            onClick={() => navigate("/search")}
          >
            <Search className="h-4 w-4 mr-2" />
            Find Spaces
          </Button>

          {isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                className="flex items-center"
                onClick={() => navigate("/saved")}
              >
                <BookMarked className="h-4 w-4 mr-2" />
                Saved
              </Button>
              <Button
                variant="ghost"
                className="flex items-center"
                onClick={() => navigate("/profile")}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </>
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

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
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
                {!isLoggedIn && (
                  <Button
                    className="w-full justify-start"
                    onClick={() => navigate("/login")}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};