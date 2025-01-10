import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ChatProps } from "@/types/message";

export const ChatInterface = ({
  selectedUser,
  messages,
  senderProfile,
  isLoading,
  onBack,
  onSendMessage,
}: ChatProps) => {
  return (
    <>
      <header className="p-4 border-b bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="font-medium">{selectedUser?.full_name || 'Anonymous'}</h2>
        </div>
      </header>

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