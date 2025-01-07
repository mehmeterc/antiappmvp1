import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

interface VerificationBannerProps {
  status: 'pending' | 'approved' | 'rejected';
}

export const VerificationBanner = ({ status }: VerificationBannerProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          message: "Your account is pending verification.",
          variant: "default" as const
        };
      case 'approved':
        return {
          icon: <CheckCircle2 className="h-4 w-4" />,
          message: "Your account has been verified.",
          variant: "default" as const
        };
      case 'rejected':
        return {
          icon: <XCircle className="h-4 w-4" />,
          message: "Your account verification was rejected. Please contact support.",
          variant: "destructive" as const
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Alert variant={config.variant}>
      <AlertDescription className="flex items-center gap-2">
        {config.icon}
        {config.message}
      </AlertDescription>
    </Alert>
  );
};