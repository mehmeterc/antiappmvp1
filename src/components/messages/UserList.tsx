import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";
import { toast } from "sonner";
import { UserListProps } from "@/types/message";
import { Skeleton } from "@/components/ui/skeleton";

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
          .neq('id', currentUserId)
          .order('full_name');
        
        if (error) {
          console.error("Error fetching users:", error);
          toast.error("Unable to load users");
          return;
        }
        
        console.log("Users fetched:", data?.length);
        setUsers(data || []);
      } catch (error) {
        console.error("Error in fetchUsers:", error);
        toast.error("An error occurred while loading users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    const channel = supabase
      .channel('public:profiles')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles' 
        }, 
        () => {
          console.log('Profile changes detected, refreshing user list');
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  const getDisplayName = (user: Profile) => {
    if (!user.full_name) return user.email?.split('@')[0] || 'Anonymous';
    const names = user.full_name.split(' ');
    return names.length > 1 
      ? `${names[0]} ${names[names.length - 1][0]}.`
      : names[0];
  };

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
        ))}
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
    <div className="divide-y">
      <div className="p-4 bg-gray-50">
        <h2 className="font-medium">Messages</h2>
      </div>
      
      <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => onUserSelect(user)}
            className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left ${
              selectedUser?.id === user.id ? "bg-gray-100" : ""
            }`}
          >
            <Avatar>
              <AvatarImage src={user.avatar_url || undefined} />
              <AvatarFallback>{user.full_name?.[0] || user.email?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate">
                {getDisplayName(user)}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.email}
              </p>
            </div>
            
            {user.id === selectedUser?.id && (
              <Badge variant="secondary" className="ml-auto">
                Selected
              </Badge>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};