import { useState } from "react";
import { MapPin } from "lucide-react";

interface AddressLinkProps {
  address: string;
  className?: string;
}

export const AddressLink = ({ address, className = "" }: AddressLinkProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const encodedAddress = encodeURIComponent(address);
    // Check if user is on iOS for Apple Maps
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const mapUrl = isIOS
      ? `maps://maps.apple.com/?q=${encodedAddress}`
      : `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
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