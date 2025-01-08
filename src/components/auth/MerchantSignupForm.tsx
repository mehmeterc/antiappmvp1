import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const MerchantSignupForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return null;
  };

  const handleMerchantSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate password
      const passwordError = validatePassword(password);
      if (passwordError) {
        setError(passwordError);
        return;
      }

      console.log("Attempting merchant signup with email:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            account_type: 'merchant'
          }
        }
      });

      if (error) throw error;
      
      if (data.session) {
        console.log("Merchant signup successful, session created");
        toast.success("Merchant account created successfully!");
        navigate("/merchant/profile");
      } else {
        console.log("Signup successful, verification email sent");
        toast.info("Please check your email to verify your account");
      }
    } catch (error: any) {
      console.error("Merchant signup error:", error);
      setError(error.message || "Failed to create merchant account");
      toast.error(error.message || "Failed to create merchant account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleMerchantSignup} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div>
        <Label htmlFor="merchant-email">Email</Label>
        <Input
          id="merchant-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1"
          required
          disabled={loading}
        />
      </div>
      
      <div>
        <Label htmlFor="merchant-password">Password</Label>
        <Input
          id="merchant-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1"
          required
          minLength={6}
          disabled={loading}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating Account..." : "Sign Up as Merchant"}
      </Button>
    </form>
  );
};