import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  cafe_id?: string | null;
}

const Messages = () => {
  const session = useSession();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [newMessage, setNewMessage] = useState("");
  
  // Fetch all profiles except current user
  useEffect(() => {
    const fetchProfiles = async () => {
      if (!session?.user?.id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', session.user.id);
      
      if (error) {
        console.error("Error fetching profiles:", error);
        return;
      }
      
      setProfiles(data);
      console.log("Profiles fetched:", data);
    };

    fetchProfiles();
  }, [session?.user?.id]);

  // Subscribe to new messages
  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${session.user.id}`,
        },
        (payload) => {
          console.log("New message received:", payload);
          setMessages(prev => [...prev, payload.new as Message]);
          toast.info("New message received!");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id]);

  // Fetch messages when user selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!session?.user?.id || !selectedUser) return;

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${session.user.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${session.user.id})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      setMessages(data);
      console.log("Messages fetched:", data);
    };

    fetchMessages();
  }, [selectedUser, session?.user?.id]);

  const handleUserClick = (user: Profile) => {
    if (selectedUser?.id === user.id) {
      setSelectedUser(null);
      console.log("Closing conversation with:", user.full_name);
    } else {
      setSelectedUser(user);
      console.log("Opening conversation with:", user.full_name);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || !selectedUser || !newMessage.trim()) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: session.user.id,
        receiver_id: selectedUser.id,
        content: newMessage,
      });

    if (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      return;
    }

    setNewMessage("");
    toast.success("Message sent!");
  };

  if (!session) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <p className="text-gray-500">Please login to use the messaging feature</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-4 h-[calc(100vh-200px)]">
        <div className={`col-span-12 ${selectedUser ? 'hidden md:block' : ''} md:col-span-4 border rounded-lg overflow-hidden`}>
          <div className="p-3 border-b bg-gray-50">
            <h2 className="font-semibold text-sm">Messages</h2>
          </div>
          <div className="overflow-y-auto h-full">
            {profiles.map((user) => (
              <div
                key={user.id}
                className={`p-2 flex items-center gap-2 hover:bg-gray-50 cursor-pointer border-b ${
                  selectedUser?.id === user.id ? "bg-gray-100" : ""
                }`}
                onClick={() => handleUserClick(user)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar_url || undefined} />
                  <AvatarFallback>{user.full_name?.[0] || user.email?.[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{user.full_name || 'Anonymous'}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`col-span-12 ${!selectedUser ? 'hidden md:block' : ''} md:col-span-8 border rounded-lg flex flex-col`}>
          {selectedUser ? (
            <>
              <div className="p-3 border-b bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={selectedUser.avatar_url || undefined} />
                    <AvatarFallback>{selectedUser.full_name?.[0] || selectedUser.email?.[0]}</AvatarFallback>
                  </Avatar>
                  <p className="font-medium text-sm">{selectedUser.full_name || 'Anonymous'}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="md:hidden"
                  onClick={() => setSelectedUser(null)}
                >
                  Back
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => {
                  const isCurrentUser = message.sender_id === session.user.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-2 ${
                          isCurrentUser
                            ? "bg-primary text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(message.created_at).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSendMessage} className="p-2 border-t">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="text-sm"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Messages;