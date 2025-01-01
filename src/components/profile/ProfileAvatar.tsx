import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

interface ProfileAvatarProps {
  avatarUrl: string;
  fullName: string;
  userId: string;
  onAvatarUpdate: (url: string) => void;
}

export const ProfileAvatar = ({ avatarUrl, fullName, userId, onAvatarUpdate }: ProfileAvatarProps) => {
  const [loading, setLoading] = useState(false);
  const supabase = useSupabaseClient();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setLoading(true);
      console.log("Starting avatar upload for user:", userId);

      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`;

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

      onAvatarUpdate(publicUrl);
      toast.success("Profile picture updated!");
      console.log("Avatar updated successfully:", publicUrl);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Error updating profile picture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{fullName?.[0] || "U"}</AvatarFallback>
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
  );
};