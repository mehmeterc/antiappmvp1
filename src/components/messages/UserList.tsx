import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";

interface UserListProps {
  currentUserId: string;
  onUserSelect: (user: Profile) => void;
  selectedUser: Profile | null;
}

export const UserList = ({ currentUserId, onUserSelect, selectedUser }: UserListProps) => {
  const [users, setUsers] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
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
    };

    fetchUsers();
  }, [currentUserId]);

  const getDisplayName = (user: Profile) => {
    if (!user.full_name) return 'Anonymous';
    const names = user.full_name.split(' ');
    return names.length > 1 
      ? `${names[0]} ${names[names.length - 1][0]}.`
      : names[0];
  };

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
            <AvatarFallback>{user.full_name?.[0] || user.email?.[0]}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm truncate">{getDisplayName(user)}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
      ))}
    </div>
  );
};