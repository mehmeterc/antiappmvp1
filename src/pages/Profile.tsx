import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";

const Profile = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    avatar_url: "",
    payment_method: ""
  });

  useEffect(() => {
    if (!session?.user?.id) {
      console.log("No session found, redirecting to login");
      navigate('/login');
      return;
    }

    getProfile();
  }, [session]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const userId = session?.user?.id;
      
      if (!userId) {
        console.error("No user ID found");
        return;
      }

      console.log("Fetching profile for user:", userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        console.log("Profile data retrieved:", data);
        setProfile({
          full_name: data.full_name || "",
          email: data.email || "",
          avatar_url: data.avatar_url || "",
          payment_method: data.payment_method || ""
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Error loading profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const userId = session?.user?.id;
      
      if (!userId) {
        console.error("No user ID found");
        return;
      }

      console.log("Updating profile for user:", userId);
      console.log("Profile data to update:", profile);

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          email: profile.email,
          payment_method: profile.payment_method,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success("Profile updated successfully!");
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (!session) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="p-6 space-y-8">
        <div className="flex items-center gap-6">
          <ProfileAvatar 
            avatarUrl={profile.avatar_url}
            fullName={profile.full_name}
            userId={session.user.id}
            onAvatarUpdate={(url) => setProfile(prev => ({ ...prev, avatar_url: url }))}
          />
          <div>
            <h1 className="text-2xl font-bold">{profile.full_name || "Your Name"}</h1>
            <p className="text-gray-500">{profile.email || "your.email@example.com"}</p>
          </div>
        </div>

        <ProfileForm 
          fullName={profile.full_name}
          email={profile.email}
          paymentMethod={profile.payment_method}
          loading={loading}
          onFieldChange={handleFieldChange}
        />

        <Button 
          onClick={handleSave} 
          className="w-full"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </Card>
    </div>
  );
};

export default Profile;