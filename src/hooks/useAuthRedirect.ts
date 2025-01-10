import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const handleAuthError = (error: AuthError) => {
    console.error("Login: Auth error:", error);
    let errorMessage = "An error occurred during authentication";
    
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          if (error.message.includes("Invalid login credentials")) {
            errorMessage = "Invalid email or password. Please try again.";
          }
          break;
        case 422:
          errorMessage = "Please fill in all required fields.";
          break;
        case 429:
          errorMessage = "Too many login attempts. Please try again later.";
          break;
        default:
          errorMessage = error.message;
      }
    }
    
    console.log("Login: Setting error message:", errorMessage);
    setAuthError(errorMessage);
    toast.error(errorMessage);
  };

  useEffect(() => {
    console.log("Login: Component mounted, checking session");
    
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Login: Session check error:", error);
          handleAuthError(error);
          return;
        }
        
        if (session) {
          console.log("Login: Active session found, redirecting to home");
          navigate("/");
        }
      } catch (error) {
        console.error("Login: Unexpected error during session check:", error);
        handleAuthError(error as AuthError);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Login: Auth state changed:", event, session?.user?.email);
      
      switch (event) {
        case "SIGNED_IN":
          console.log("Login: User signed in successfully");
          setAuthError(null);
          toast.success("Successfully signed in!");
          navigate("/");
          break;
          
        case "SIGNED_OUT":
          console.log("Login: User signed out");
          setAuthError(null);
          toast.info("Signed out successfully");
          break;
          
        case "PASSWORD_RECOVERY":
          setAuthError(null);
          toast.info("Please check your email to reset your password");
          break;
          
        case "USER_UPDATED":
          console.log("Login: User profile updated");
          setAuthError(null);
          toast.success("Profile updated successfully");
          break;
          
        case "INITIAL_SESSION":
          console.log("Login: Initial session loaded");
          if (session) {
            navigate("/");
          }
          break;
      }
    });

    return () => {
      console.log("Login: Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, [navigate]);

  return { authError, loading };
};