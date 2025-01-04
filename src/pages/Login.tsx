import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { session, isLoading } = useSessionContext();

  useEffect(() => {
    console.log("Session state changed:", session);
    
    if (session) {
      console.log("User is authenticated, redirecting to home");
      navigate("/");
    }
  }, [session, navigate]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      
      switch (event) {
        case 'SIGNED_IN':
          console.log('User signed in:', session?.user?.email);
          toast.success('Successfully signed in!');
          break;
        case 'SIGNED_OUT':
          console.log('User signed out');
          toast.info('Signed out successfully');
          break;
        case 'PASSWORD_RECOVERY':
          console.log('Password recovery requested');
          toast.info('Password recovery email sent');
          break;
        case 'TOKEN_REFRESHED':
          console.log('Session token refreshed');
          break;
        default:
          console.log('Unhandled auth event:', event);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome to AntiApp</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to find your perfect workspace
          </p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#2563eb',
                  brandAccent: '#1d4ed8',
                },
              },
            },
          }}
          providers={[]}
          redirectTo={`${window.location.origin}/`}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email address',
                password_label: 'Password',
              },
              sign_up: {
                email_label: 'Email address',
                password_label: 'Create a password',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Login;