
import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError } from "@supabase/supabase-js";
import { Coffee } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Setting up auth state change listener");
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session check error:", error);
          handleAuthError(error);
          return;
        }
        
        if (session) {
          console.log("Active session found, redirecting");
          const returnPath = location.state?.from || "/";
          navigate(returnPath, { replace: true });
        }
      } catch (error) {
        console.error("Session check error:", error);
        handleAuthError(error as AuthError);
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === "SIGNED_IN") {
        console.log("User signed in successfully:", session?.user);
        setAuthError(null);
        toast.success("Successfully signed in!");
        const returnPath = location.state?.from || "/";
        navigate(returnPath, { replace: true });
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
        setAuthError(null);
        toast.info("Signed out successfully");
      } else if (event === "PASSWORD_RECOVERY") {
        setAuthError(null);
        toast.info("Please check your email to reset your password");
      } else if (event === "USER_UPDATED") {
        console.log("User updated:", session?.user);
        setAuthError(null);
        toast.success("Profile updated successfully");
        navigate('/reset-password', { replace: true });
      }
    });

    return () => {
      console.log("Cleaning up auth state change listener");
      subscription.unsubscribe();
    };
  }, [navigate, location.state]);

  const handleAuthError = (error: AuthError) => {
    console.error("Auth error:", error);
    let errorMessage = "An error occurred during authentication";
    
    // More specific error messages based on the error response
    if (error.message.includes("Invalid login credentials")) {
      errorMessage = "The email or password you entered is incorrect. Please try again.";
    } else if (error.message.includes("Email not confirmed")) {
      errorMessage = "Please verify your email address before signing in.";
    } else if (error.message.includes("rate limit")) {
      errorMessage = "Too many login attempts. Please try again in a few minutes.";
    }
    
    setAuthError(errorMessage);
    toast.error(errorMessage);
  };

  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10 flex flex-col items-center justify-center px-4">
      <div className="mb-8 flex items-center gap-2">
        <Coffee className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-gray-900">AntiApp</h1>
      </div>
      
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Welcome back</h2>
          <p className="text-gray-500 mt-2">Sign in to your account to continue</p>
        </div>

        {authError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#0D9F6C',
                  brandAccent: '#0B8A5C',
                }
              }
            },
            className: {
              container: 'w-full',
              button: 'w-full px-4 py-2 rounded-lg font-medium',
              input: 'w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary',
              label: 'text-sm font-medium text-gray-700',
              message: 'text-sm text-red-600 mt-1',
              loader: 'text-primary'
            }
          }}
          theme="light"
          providers={[]}
          redirectTo={`${origin}/auth/callback`}
          onlyThirdPartyProviders={false}
        />
      </div>

      <p className="mt-8 text-center text-sm text-gray-500">
        By signing in, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
};

export default Login;
