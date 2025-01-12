import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { VerificationBanner } from "@/components/merchant/VerificationBanner";
import { toast } from "sonner";

const MerchantProfile = () => {
  const navigate = useNavigate();
  const session = useSession();
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [profile, setProfile] = useState({
    business_name: "",
    business_description: "",
    contact_email: "",
    contact_phone: "",
    website: "",
  });

  useEffect(() => {
    if (!session?.user?.id) {
      console.log("No session found, redirecting to login");
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        console.log("Loading merchant profile for user:", session.user.id);
        
        // Get verification status from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('verification_status')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;
        
        if (profileData?.verification_status) {
          setVerificationStatus(profileData.verification_status);
        }

        // Get merchant profile data
        const { data, error } = await supabase
          .from('merchant_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        if (data) {
          console.log("Merchant profile loaded:", data);
          setProfile({
            business_name: data.business_name || "",
            business_description: data.business_description || "",
            contact_email: data.contact_email || "",
            contact_phone: data.contact_phone || "",
            website: data.website || "",
          });
        }
      } catch (error) {
        console.error("Error loading merchant profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [session, navigate, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast.error("Please log in to update your profile");
      return;
    }

    try {
      setSaving(true);
      console.log("Updating merchant profile for user:", session.user.id);

      const { error } = await supabase
        .from('merchant_profiles')
        .update({
          business_name: profile.business_name,
          business_description: profile.business_description,
          contact_email: profile.contact_email,
          contact_phone: profile.contact_phone,
          website: profile.website
        })
        .eq('id', session.user.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
      console.log("Merchant profile updated successfully");
    } catch (error) {
      console.error("Error updating merchant profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <VerificationBanner status={verificationStatus} />
        
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Merchant Profile</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="business_name">Business Name *</Label>
              <Input
                id="business_name"
                name="business_name"
                value={profile.business_name}
                onChange={handleChange}
                required
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_description">Business Description</Label>
              <Textarea
                id="business_description"
                name="business_description"
                value={profile.business_description}
                onChange={handleChange}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact Email *</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                value={profile.contact_email}
                onChange={handleChange}
                required
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                type="tel"
                value={profile.contact_phone}
                onChange={handleChange}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={profile.website}
                onChange={handleChange}
                disabled={saving}
              />
            </div>

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default MerchantProfile;