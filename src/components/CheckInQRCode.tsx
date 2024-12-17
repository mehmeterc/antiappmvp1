import { QRCodeSVG } from "qrcode.react";
import { useLocation } from "react-router-dom";

interface CheckInQRCodeProps {
  cafeId: string;
  price: string;
}

export const CheckInQRCode = ({ cafeId, price }: CheckInQRCodeProps) => {
  const location = useLocation();
  const baseUrl = window.location.origin;
  const checkInUrl = `${baseUrl}/checkin-status/${cafeId}`;

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
    </div>
  );
};