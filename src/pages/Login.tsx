import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError } from "@supabase/supabase-js";
import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Setting up auth state change listener in Login");
    
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session check error:", error);
          handleAuthError(error);
          return;
        }
        
        if (session) {
          console.log("Active session found in Login, redirecting to home");
          navigate("/");
        }
      } catch (error) {
        console.error("Session check error:", error);
        handleAuthError(error as AuthError);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed in Login:", event);
      
      if (event === "SIGNED_IN") {
        console.log("User signed in successfully:", session?.user);
        setAuthError(null);
        toast.success("Successfully signed in!");
        navigate("/");
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
      }
    });

    return () => {
      console.log("Cleaning up auth state change listener in Login");
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleAuthError = (error: AuthError) => {
    console.error("Auth error:", error);
    let errorMessage = "An error occurred during authentication";
    
    if (error.message.includes("Invalid login credentials")) {
      errorMessage = "Invalid email or password. Please try again.";
    } else if (error.message.includes("Email not confirmed")) {
      errorMessage = "Please verify your email address before signing in.";
    }
    
    setAuthError(errorMessage);
    toast.error(errorMessage);
  };

  const handleMerchantSignup = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.signUp({
        options: {
          data: {
            account_type: 'merchant'
          }
        }
      });

      if (error) throw error;
      
      if (session) {
        toast.success("Merchant account created successfully!");
        navigate("/merchant/profile");
      } else {
        toast.info("Please check your email to verify your account");
      }
    } catch (error) {
      console.error("Merchant signup error:", error);
      toast.error("Failed to create merchant account");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10 flex flex-col items-center justify-center px-4">
      <div className="mb-8 flex items-center gap-2">
        <Coffee className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-gray-900">AntiApp</h1>
      </div>
      
      <Card className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="user">User Login</TabsTrigger>
            <TabsTrigger value="merchant">Merchant</TabsTrigger>
          </TabsList>

          <TabsContent value="user">
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
                }
              }}
              theme="light"
              providers={[]}
            />
          </TabsContent>

          <TabsContent value="merchant">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">Merchant Access</h2>
              <p className="text-gray-500 mt-2">Register or sign in as a merchant</p>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={() => navigate("/merchant/register")} 
                className="w-full"
              >
                Register as Merchant
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>

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
                  }
                }}
                theme="light"
                providers={[]}
              />
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <p className="mt-8 text-center text-sm text-gray-500">
        By signing in, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
};

export default Login;