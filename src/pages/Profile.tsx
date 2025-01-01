import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { CreditCard, Mail, User, Camera } from "lucide-react";
import { toast } from "sonner";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";

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

      if (error) {
        throw error;
      }

      if (!data) {
        console.log("No profile found, creating new profile");
        // Create a new profile if none exists
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: session?.user?.email,
            full_name: "",
            avatar_url: "",
            payment_method: ""
          })
          .select()
          .single();

        if (insertError) {
          console.error("Error creating profile:", insertError);
          throw insertError;
        }

        console.log("New profile created:", newProfile);
        setProfile({
          full_name: newProfile.full_name || "",
          email: newProfile.email || "",
          avatar_url: newProfile.avatar_url || "",
          payment_method: newProfile.payment_method || ""
        });
      } else {
        console.log("Profile data retrieved:", data);
        setProfile({
          full_name: data.full_name || "",
          email: data.email || "",
          avatar_url: data.avatar_url || "",
          payment_method: data.payment_method || ""
        });
      }
    } catch (error) {
      console.error("Error fetching/creating profile:", error);
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setLoading(true);
      const userId = session?.user?.id;
      
      if (!userId) {
        console.error("No user ID found");
        return;
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`;

      console.log("Uploading avatar:", filePath);

      // Create avatars bucket if it doesn't exist
      const { data: bucketData, error: bucketError } = await supabase
        .storage
        .getBucket('avatars');

      if (!bucketData) {
        console.log("Creating avatars bucket");
        const { error: createBucketError } = await supabase
          .storage
          .createBucket('avatars', { public: true });

        if (createBucketError) throw createBucketError;
      }

      // Upload image
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
      toast.success("Profile picture updated!");
      console.log("Avatar updated successfully:", publicUrl);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Error updating profile picture");
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="p-6 space-y-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback>{profile.full_name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0">
              <input
                type="file"
                id="avatar"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={loading}
              />
              <label htmlFor="avatar">
                <Button
                  size="icon"
                  variant="secondary"
                  className="cursor-pointer"
                  disabled={loading}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </label>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile.full_name || "Your Name"}</h1>
            <p className="text-gray-500">{profile.email || "your.email@example.com"}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">
                <User className="h-4 w-4" />
              </span>
              <Input
                id="name"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
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
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment">Payment Method</Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">
                <CreditCard className="h-4 w-4" />
              </span>
              <Input
                id="payment"
                value={profile.payment_method}
                onChange={(e) => setProfile({ ...profile, payment_method: e.target.value })}
                className="pl-10"
                placeholder="Enter payment details"
                disabled={loading}
              />
            </div>
          </div>
        </div>

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