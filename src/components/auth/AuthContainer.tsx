import { Coffee } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AuthContainerProps {
  children: React.ReactNode;
}

export const AuthContainer = ({ children }: AuthContainerProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10 flex flex-col items-center justify-center px-4">
      <div className="mb-8 flex items-center gap-2">
        <Coffee className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-gray-900">AntiApp</h1>
      </div>
      
      <Card className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        {children}
      </Card>

      <p className="mt-8 text-center text-sm text-gray-500">
        By signing in, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
};