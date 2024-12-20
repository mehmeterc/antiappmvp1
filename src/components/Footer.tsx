import { useNavigate } from "react-router-dom";
import { Home, BookMarked, History, MessageSquare, MapPin } from "lucide-react";

export const Footer = () => {
  const navigate = useNavigate();

  const footerItems = [
    { icon: <Home className="h-6 w-6" />, label: "Home", path: "/" },
    { icon: <BookMarked className="h-6 w-6" />, label: "Saved", path: "/saved" },
    { icon: <History className="h-6 w-6" />, label: "History", path: "/history" },
    { icon: <MessageSquare className="h-6 w-6" />, label: "Messages", path: "/messages" },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-md py-2 z-40">
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

export const FloatingMapButton = ({ location }: { location: string }) => {
  const handleMapClick = () => {
    const encodedLocation = encodeURIComponent(location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`, '_blank');
  };

  return (
    <button
      onClick={handleMapClick}
      className="fixed bottom-24 right-4 bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg z-50 transition-transform hover:scale-105"
    >
      <MapPin className="h-6 w-6" />
    </button>
  );
};