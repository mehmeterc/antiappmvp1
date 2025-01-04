import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";
import { Badge } from "@/components/ui/badge";

interface UserListProps {
  currentUserId: string;
  onUserSelect: (user: Profile) => void;
  selectedUser: Profile | null;
}

export const UserList = ({ currentUserId, onUserSelect, selectedUser }: UserListProps) => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        console.log("Fetching users for UserList");
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', currentUserId);
        
        if (error) {
          console.error("Error fetching users:", error);
          return;
        }
        
        console.log("Users fetched:", data);
        setUsers(data || []);
      } catch (error) {
        console.error("Error in fetchUsers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    // Subscribe to profile changes
    const channel = supabase
      .channel('public:profiles')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles' 
        }, 
        (payload) => {
          console.log('Profile change received:', payload);
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  const getDisplayName = (user: Profile) => {
    if (!user.full_name) return 'Anonymous';
    const names = user.full_name.split(' ');
    return names.length > 1 
      ? `${names[0]} ${names[names.length - 1][0]}.`
      : names[0];
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading users...
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No other users found
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      {users.map((user) => (
        <div
          key={user.id}
          className={`p-2 flex items-center gap-2 hover:bg-gray-50 cursor-pointer border-b ${
            selectedUser?.id === user.id ? "bg-gray-100" : ""
          }`}
          onClick={() => onUserSelect(user)}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar_url || undefined} />
            <AvatarFallback>{user.full_name?.[0] || user.email?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm truncate">{getDisplayName(user)}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          {user.id === selectedUser?.id && (
            <Badge variant="secondary" className="ml-auto">
              Selected
            </Badge>
          )}
        </div>
      ))}
    </div>
  );
};