import { useNavigate } from "react-router-dom";
import { Map, BookMarked, History, User } from "lucide-react";

export const Footer = () => {
  const navigate = useNavigate();

  const footerItems = [
    { icon: <Map className="h-6 w-6" />, label: "Map", path: "/search" },
    { icon: <BookMarked className="h-6 w-6" />, label: "Saved", path: "/saved" },
    { icon: <History className="h-6 w-6" />, label: "History", path: "/history" },
    { icon: <User className="h-6 w-6" />, label: "Account", path: "/profile" },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-md py-2 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-4 gap-4">
          {footerItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center p-2 text-gray-600 hover:text-primary transition-colors"
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};