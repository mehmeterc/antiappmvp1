import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Login component mounted');
    
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session check error:', sessionError);
          toast.error('Error checking login status');
          return;
        }
        
        if (session) {
          console.log('User already logged in, redirecting to home');
          navigate('/');
        }
      } catch (error) {
        console.error('Unexpected error during session check:', error);
        toast.error('An unexpected error occurred');
      }
    };

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      
      switch (event) {
        case 'SIGNED_IN':
          if (session) {
            console.log('Sign in successful:', session);
            toast.success('Successfully logged in!');
            navigate('/');
          }
          break;
        case 'SIGNED_OUT':
          console.log('Sign out successful');
          toast.success('Successfully logged out!');
          break;
        case 'PASSWORD_RECOVERY':
          toast.info('Please check your email for password reset instructions');
          break;
        case 'USER_UPDATED':
          console.log('User profile updated');
          break;
        case 'TOKEN_REFRESHED':
          console.log('Session token refreshed');
          break;
        default:
          console.log('Unhandled auth event:', event);
      }
    });

    return () => {
      console.log('Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <Layout>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome to AntiApp</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#000000',
                  brandAccent: '#333333',
                }
              }
            },
            style: {
              button: {
                borderRadius: '6px',
                height: '40px',
              },
              input: {
                borderRadius: '6px',
                height: '40px',
              },
              anchor: {
                color: '#000000',
              },
            },
          }}
          providers={[]}
          redirectTo={`${window.location.origin}/`}
          onError={(error) => {
            console.error('Auth error:', error);
            toast.error(error.message || 'An error occurred during authentication');
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Password',
                email_input_placeholder: 'Your email',
                password_input_placeholder: 'Your password',
                button_label: 'Sign in',
                loading_button_label: 'Signing in ...',
                social_provider_text: 'Sign in with {{provider}}',
                link_text: 'Already have an account? Sign in',
              },
              sign_up: {
                email_label: 'Email',
                password_label: 'Create a Password',
                email_input_placeholder: 'Your email',
                password_input_placeholder: 'Create a password',
                button_label: 'Sign up',
                loading_button_label: 'Signing up ...',
                social_provider_text: 'Sign up with {{provider}}',
                link_text: "Don't have an account? Sign up",
              },
            },
          }}
        />
      </div>
    </Layout>
  );
};

export default Login;