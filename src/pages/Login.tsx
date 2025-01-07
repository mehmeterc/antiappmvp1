import { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Setting up auth state change listener");
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      
      if (event === "SIGNED_IN") {
        console.log("User signed in successfully:", session?.user);
        toast.success("Successfully signed in!");
        navigate("/");
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
        toast.info("Signed out successfully");
        navigate("/login");
      } else if (event === "PASSWORD_RECOVERY") {
        toast.info("Please check your email to reset your password");
      } else if (event === "USER_UPDATED") {
        console.log("User updated:", session?.user);
        toast.success("Profile updated successfully");
      } else if (event === "INITIAL_SESSION") {
        // Handle initial session check
        if (session) {
          console.log("Active session found, redirecting to home");
          navigate("/");
        }
      } else {
        console.log("Other auth event:", event);
      }
    });

    // Check current session on mount
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log("Checking current session:", session, error);
        
        if (error) {
          console.error("Session check error:", error);
          toast.error("Error checking session");
          return;
        }
        
        if (session) {
          console.log("Active session found, redirecting to home");
          navigate("/");
        }
      } catch (error) {
        console.error("Session check error:", error);
        toast.error("Error checking session");
      }
    };
    
    checkSession();

    return () => {
      console.log("Cleaning up auth state change listener");
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome to AntiApp</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#0D9F6C',
                  brandAccent: '#0B8A5C',
                },
              },
            },
            style: {
              button: { width: '100%' },
              container: { width: '100%' },
              anchor: { color: '#0D9F6C' },
              message: { color: 'red' },
            },
          }}
          providers={[]}
          redirectTo={`${window.location.origin}/`}
          onlyThirdPartyProviders={false}
        />
      </div>
    </div>
  );
};

export default Login;