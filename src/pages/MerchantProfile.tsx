import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';

interface MerchantProfileProps {
  preview?: boolean;
}

const MerchantProfile = ({ preview = false }: MerchantProfileProps) => {
  const session = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!session?.user?.id) return;

        console.log("Fetching merchant profile for ID:", session.user.id);
        const { data, error } = await supabase
          .from('merchant_profiles')
          .select('*')
          .eq('id', session.user.id)  // Changed from user_id to id
          .single();

        if (error) {
          console.error("Error fetching merchant profile:", error);
          throw error;
        }
        
        console.log("Merchant profile fetched:", data);
        setProfile(data);
      } catch (err: any) {
        console.error("Error in fetchProfile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session, supabase]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile && !preview) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Merchant Profile</h1>
        <p className="mb-4">You haven't registered as a merchant yet.</p>
        <Button onClick={() => navigate('/merchant/register')}>
          Register as Merchant
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {preview ? 'Preview Merchant Profile' : 'Merchant Profile'}
      </h1>
      
      {profile && (
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">Business Name</h2>
            <p>{profile.business_name}</p>
          </div>
          
          <div>
            <h2 className="font-semibold">Business Description</h2>
            <p>{profile.business_description || 'No description provided'}</p>
          </div>
          
          <div>
            <h2 className="font-semibold">Contact Information</h2>
            <p>Email: {profile.contact_email}</p>
            <p>Phone: {profile.contact_phone || 'Not provided'}</p>
          </div>
          
          <div>
            <h2 className="font-semibold">Website</h2>
            <p>{profile.website || 'Not provided'}</p>
          </div>
          
          {!preview && (
            <Button onClick={() => navigate('/merchant/edit')}>
              Edit Profile
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default MerchantProfile;