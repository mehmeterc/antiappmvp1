import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/message";
import { Profile } from "@/types/profile";
import { toast } from "sonner";

export const useMessages = (selectedUser: Profile | null) => {
  const session = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [senderProfile, setSenderProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) {
      console.log("No session found");
      setIsLoading(false);
      return;
    }

    const fetchCurrentUserProfile = async () => {
      try {
        console.log("Fetching current user profile for ID:", session.user.id);
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

        console.log("Current user profile fetched:", data);
        setSenderProfile(data);
      } catch (error) {
        console.error("Error in fetchCurrentUserProfile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUserProfile();
  }, [session?.user?.id]);

  useEffect(() => {
    if (!session?.user?.id || !selectedUser) {
      console.log("No session or selected user");
      return;
    }

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching messages between", session.user.id, "and", selectedUser.id);
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

        console.log("Messages fetched:", data);
        setMessages(data || []);
      } catch (error) {
        console.error("Error in fetchMessages:", error);
      } finally {
        setIsLoading(false);
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
      toast.error("Please log in to send messages");
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
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      throw new Error("Failed to send message. Please try again.");
    }
  };

  return {
    messages,
    senderProfile,
    isLoading,
    handleSendMessage,
  };
};