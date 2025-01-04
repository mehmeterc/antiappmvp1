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
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error checking session:', sessionError);
          toast.error('Error checking session. Please try again.');
          return;
        }
        
        console.log('Current session:', session);
        if (session) {
          navigate('/');
        }
      } catch (error) {
        console.error('Unexpected error during session check:', error);
        toast.error('An unexpected error occurred. Please try again.');
      }
    };

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('Sign in successful:', session);
        toast.success('Successfully logged in!');
        navigate('/');
      } else if (event === 'SIGNED_OUT') {
        console.log('Sign out successful');
        toast.success('Successfully logged out!');
      } else if (event === 'PASSWORD_RECOVERY') {
        toast.info('Please check your email for password reset instructions');
      } else if (event === 'USER_UPDATED') {
        console.log('User updated:', session);
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed:', session);
      }
    });

    return () => {
      console.log('Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Get the current URL for redirect
  const redirectUrl = window.location.origin;
  console.log('Redirect URL:', redirectUrl);

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
          redirectTo={redirectUrl}
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