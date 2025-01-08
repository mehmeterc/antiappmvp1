import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UserLoginTabProps {
  authError: string | null;
}

export const UserLoginTab = ({ authError }: UserLoginTabProps) => {
  return (
    <>
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
    </>
  );
};