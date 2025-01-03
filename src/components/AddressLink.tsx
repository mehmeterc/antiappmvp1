import { useState } from "react";
import { MapPin } from "lucide-react";

interface AddressLinkProps {
  address: string;
  cafeName: string;
  className?: string;
}

export const AddressLink = ({ address, cafeName, className = "" }: AddressLinkProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Combine cafe name and address for better findability
    const searchQuery = `${cafeName}, ${address}`;
    const encodedQuery = encodeURIComponent(searchQuery);
    
    // Check if user is on iOS for Apple Maps
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const mapUrl = isIOS
      ? `maps://maps.apple.com/?q=${encodedQuery}`
      : `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
    
    window.open(mapUrl, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`flex items-center gap-1 text-left transition-colors duration-200 ${
        isHovered ? "text-[#0D9F6C]" : ""
      } ${className}`}
    >
      <MapPin className="h-4 w-4" />
      <span>{address}</span>
    </button>
  );
};