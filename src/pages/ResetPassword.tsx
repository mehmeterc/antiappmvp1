
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'success' | 'error' | 'loading'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const handlePasswordReset = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Password reset error:", error);
          setStatus('error');
          setErrorMessage("Unable to verify password reset. Please try again or contact support.");
          return;
        }

        if (data.session) {
          console.log("Password reset successful");
          setStatus('success');
          // Log the successful password reset
          await supabase
            .from('page_views')
            .insert([{ 
              page_name: 'password_reset_success',
              visitor_id: data.session.user.id 
            }]);
        } else {
          setStatus('error');
          setErrorMessage("No active session found. Please try resetting your password again.");
        }
      } catch (error) {
        console.error("Password reset verification error:", error);
        setStatus('error');
        setErrorMessage("An unexpected error occurred. Please try again later.");
      }
    };

    handlePasswordReset();
  }, []);

  const handleGoToLogin = () => {
    navigate('/login');
    toast.success("Password has been reset successfully. Please log in with your new password.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6 fade-in">
        {status === 'loading' ? (
          <div className="text-center">
            <p className="text-gray-600">Verifying password reset...</p>
          </div>
        ) : status === 'success' ? (
          <>
            <div className="text-center space-y-2">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
              <h1 className="text-2xl font-bold text-gray-900">Password Reset Successful</h1>
              <p className="text-gray-600">
                Your password has been reset successfully. You can now log in with your new password.
              </p>
            </div>
            <Button 
              onClick={handleGoToLogin}
              className="w-full"
            >
              Go to Login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <div className="text-center space-y-2">
              <XCircle className="mx-auto h-12 w-12 text-red-500" />
              <h1 className="text-2xl font-bold text-gray-900">Password Reset Failed</h1>
              <Alert variant="destructive">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
              <p className="text-gray-600 mt-4">
                You can try:
              </p>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                <li>Requesting another password reset</li>
                <li>Checking your email for a new reset link</li>
                <li>Contacting support if the issue persists</li>
              </ul>
            </div>
            <Button 
              onClick={() => navigate('/login')}
              className="w-full"
            >
              Return to Login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
