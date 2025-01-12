import { useEffect, useRef } from "react";
import { Message } from "@/types/message";
import { format } from "date-fns";
import { useSession } from "@supabase/auth-helpers-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageListProps {
  messages: Message[];
  senderProfile: any;
  receiverProfile: any;
}

export const MessageList = ({ messages, senderProfile, receiverProfile }: MessageListProps) => {
  const session = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const isCurrentUser = message.sender_id === session?.user?.id;
        const profile = isCurrentUser ? senderProfile : receiverProfile;
        
        return (
          <div
            key={message.id}
            className={`flex items-start gap-2 ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}
          >
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback>{profile?.full_name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div
              className={`max-w-[70%] rounded-lg p-2 ${
                isCurrentUser
                  ? "bg-primary text-white"
                  : "bg-gray-100"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {format(new Date(message.created_at), 'HH:mm')}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};