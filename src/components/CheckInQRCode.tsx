import { QRCodeSVG } from "qrcode.react";
import { useLocation } from "react-router-dom";

interface CheckInQRCodeProps {
  cafeId: string;
  price: string;
}

export const CheckInQRCode = ({ cafeId, price }: CheckInQRCodeProps) => {
  const location = useLocation();
  
  // Get the current window location and ensure proper URL formatting
  const baseUrl = window.location.origin.replace(/:\/$/, ''); // Remove any trailing :/ 
  const checkInUrl = `${baseUrl}/checkin-status/${cafeId}`;
  
  console.log("Generated QR Code URL:", checkInUrl); // Debug log

  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold">Scan to Check In/Out</h3>
      <QRCodeSVG
        value={checkInUrl}
        size={200}
        level="H"
        includeMargin={true}
      />
      <p className="text-sm text-gray-600">Scan this QR code with your phone camera to check in or out</p>
      <p className="text-xs text-gray-500">Rate: {price}/hour</p>
    </div>
  );
};