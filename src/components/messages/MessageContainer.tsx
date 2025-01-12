import { Message } from "@/types/message";
import { Profile } from "@/types/profile";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { MessageHeader } from "./MessageHeader";

interface MessageContainerProps {
  selectedUser: Profile;
  messages: Message[];
  senderProfile: Profile | null;
  isLoading: boolean;
  onBack: () => void;
  onSendMessage: (content: string) => Promise<void>;
}

export const MessageContainer = ({
  selectedUser,
  messages,
  senderProfile,
  isLoading,
  onBack,
  onSendMessage,
}: MessageContainerProps) => {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <MessageHeader selectedUser={selectedUser} onBack={onBack} />
      <MessageList 
        messages={messages}
        senderProfile={senderProfile}
        receiverProfile={selectedUser}
      />
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};