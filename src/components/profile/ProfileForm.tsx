import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Mail, User } from "lucide-react";

interface ProfileFormProps {
  fullName: string;
  email: string;
  paymentMethod: string;
  loading: boolean;
  onFieldChange: (field: string, value: string) => void;
}

export const ProfileForm = ({ 
  fullName, 
  email, 
  paymentMethod, 
  loading, 
  onFieldChange 
}: ProfileFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full_name">Name</Label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-500">
            <User className="h-4 w-4" />
          </span>
          <Input
            id="full_name"
            name="full_name"
            value={fullName}
            onChange={(e) => onFieldChange('full_name', e.target.value)}
            className="pl-10"
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-500">
            <Mail className="h-4 w-4" />
          </span>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => onFieldChange('email', e.target.value)}
            className="pl-10"
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment_method">Payment Method</Label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-500">
            <CreditCard className="h-4 w-4" />
          </span>
          <Input
            id="payment_method"
            name="payment_method"
            value={paymentMethod}
            onChange={(e) => onFieldChange('payment_method', e.target.value)}
            className="pl-10"
            placeholder="Enter payment details"
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};