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

        const { data, error } = await supabase
          .from('merchant_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (err: any) {
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
            <h2 className="font-semibold">Business Address</h2>
            <p>{profile.business_address}</p>
          </div>
          
          <div>
            <h2 className="font-semibold">Contact Information</h2>
            <p>Phone: {profile.phone}</p>
            <p>Email: {profile.email}</p>
          </div>
          
          <div>
            <h2 className="font-semibold">Business Hours</h2>
            <p>{profile.business_hours}</p>
          </div>
          
          <div>
            <h2 className="font-semibold">Description</h2>
            <p>{profile.description}</p>
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