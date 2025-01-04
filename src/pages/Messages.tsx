import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { UserList } from "@/components/messages/UserList";
import { MessageList } from "@/components/messages/MessageList";
import { MessageInput } from "@/components/messages/MessageInput";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types/profile";
import { Message } from "@/types/message";
import { toast } from "sonner";

const Messages = () => {
  const session = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [senderProfile, setSenderProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchCurrentUserProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error("Error fetching current user profile:", error);
          toast.error("Error loading your profile");
          return;
        }

        setSenderProfile(data);
      } catch (error) {
        console.error("Error in fetchCurrentUserProfile:", error);
      }
    };

    fetchCurrentUserProfile();
  }, [session?.user?.id]);

  useEffect(() => {
    if (!session?.user?.id || !selectedUser) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${session.user.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${session.user.id})`)
          .order('created_at', { ascending: true });

        if (error) {
          console.error("Error fetching messages:", error);
          toast.error("Error loading messages");
          return;
        }

        setMessages(data);
        console.log("Messages fetched:", data);
      } catch (error) {
        console.error("Error in fetchMessages:", error);
      }
    };

    fetchMessages();

    // Subscribe to new messages
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
  }, [selectedUser, session?.user?.id]);

  const handleSendMessage = async (content: string) => {
    if (!session?.user?.id || !selectedUser) {
      console.error("Missing user session or selected user");
      return;
    }

    try {
      console.log("Sending message:", {
        sender_id: session.user.id,
        receiver_id: selectedUser.id,
        content
      });

      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: session.user.id,
          receiver_id: selectedUser.id,
          content,
        })
        .select()
        .single();

      if (error) {
        console.error("Error sending message:", error);
        throw error;
      }

      console.log("Message sent successfully:", data);
      setMessages(prev => [...prev, data]);
      toast.success("Message sent!");
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      throw error;
    }
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
          <UserList
            currentUserId={session.user.id}
            onUserSelect={setSelectedUser}
            selectedUser={selectedUser}
          />
        </div>

        <div className={`col-span-12 ${!selectedUser ? 'hidden md:block' : ''} md:col-span-8 border rounded-lg flex flex-col`}>
          {selectedUser ? (
            <>
              <div className="p-3 border-b bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
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

              <MessageList 
                messages={messages}
                senderProfile={senderProfile}
                receiverProfile={selectedUser}
              />

              <MessageInput onSendMessage={handleSendMessage} />
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