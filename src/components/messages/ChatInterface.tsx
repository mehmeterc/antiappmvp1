import { useState } from "react";
import { Message } from "@/types/message";
import { Profile } from "@/types/profile";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Button } from "@/components/ui/button";

interface ChatInterfaceProps {
  selectedUser: Profile;
  messages: Message[];
  senderProfile: Profile | null;
  isLoading: boolean;
  onBack: () => void;
  onSendMessage: (content: string) => Promise<void>;
}

export const ChatInterface = ({
  selectedUser,
  messages,
  senderProfile,
  isLoading,
  onBack,
  onSendMessage,
}: ChatInterfaceProps) => {
  return (
    <>
      <div className="p-3 border-b bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm">{selectedUser.full_name || 'Anonymous'}</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="md:hidden"
          onClick={onBack}
        >
          Back
        </Button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Loading messages...</p>
        </div>
      ) : (
        <MessageList 
          messages={messages}
          senderProfile={senderProfile}
          receiverProfile={selectedUser}
        />
      )}

      <MessageInput onSendMessage={onSendMessage} />
    </>
  );
};