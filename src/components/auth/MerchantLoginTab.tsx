import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { AuthDivider } from "./AuthDivider";

interface MerchantLoginTabProps {
  authError: string | null;
}

export const MerchantLoginTab = ({ authError }: MerchantLoginTabProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log("Attempting merchant login with email:", email);
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (session) {
        // Check if the user is a merchant
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('account_type, verification_status')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;

        if (profile?.account_type !== 'merchant') {
          // If not a merchant, sign out and show error
          await supabase.auth.signOut();
          throw new Error('This account is not registered as a merchant. Please use the regular login.');
        }

        if (profile?.verification_status !== 'approved') {
          await supabase.auth.signOut();
          throw new Error('Your merchant account is pending approval. Please wait for admin verification.');
        }

        console.log("Merchant login successful");
        toast.success("Welcome back!");
        navigate('/merchant/profile');
      }
    } catch (error: any) {
      console.error("Merchant login error:", error);
      let errorMessage = "Failed to sign in";
      
      if (error instanceof AuthApiError) {
        switch (error.status) {
          case 400:
            errorMessage = "Invalid email or password";
            break;
          case 422:
            errorMessage = "Please fill in all required fields";
            break;
          default:
            errorMessage = error.message;
        }
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Merchant Access</h2>
        <p className="text-gray-500 mt-2">Sign in to your merchant account</p>
      </div>

      {(error || authError) && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error || authError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <Label htmlFor="merchant-email">Email</Label>
          <Input
            id="merchant-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div>
          <Label htmlFor="merchant-password">Password</Label>
          <Input
            id="merchant-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in as Merchant"}
        </Button>
      </form>

      <AuthDivider />

      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">Want to register as a merchant?</p>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate("/merchant/signup")}
        >
          Register your Business
        </Button>
      </div>
    </>
  );
};