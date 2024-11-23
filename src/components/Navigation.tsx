import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { User, LogIn, Search, BookMarked, Coffee } from "lucide-react";

export const Navigation = () => {
  const navigate = useNavigate();
  const isLoggedIn = false; // TODO: Replace with actual auth state

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2" onClick={() => navigate("/")}>
          <Coffee className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">AntiApp</span>
        </div>

        <div className="flex items-center space-x-4">
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
      </div>
    </nav>
  );
};