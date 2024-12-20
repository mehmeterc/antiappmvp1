import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { MOCK_MESSAGES, MOCK_USERS, type Message, type User } from "@/data/mockMessages";
import { toast } from "sonner";

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const currentUserId = "1"; // Mock current user

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !newMessage.trim()) return;

    const message: Message = {
      id: `${Date.now()}`,
      senderId: currentUserId,
      receiverId: selectedUser.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
    console.log("Message sent:", message);
    toast.success("Message sent!");
  };

  const getConversationMessages = () => {
    if (!selectedUser) return [];
    return messages.filter(
      (msg) =>
        (msg.senderId === currentUserId && msg.receiverId === selectedUser.id) ||
        (msg.senderId === selectedUser.id && msg.receiverId === currentUserId)
    );
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-4 h-[calc(100vh-200px)]">
        {/* Users list */}
        <div className="col-span-4 border rounded-lg overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-semibold">Conversations</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100%-60px)]">
            {MOCK_USERS.filter(user => user.id !== currentUserId).map((user) => (
              <div
                key={user.id}
                className={`p-4 flex items-center gap-3 hover:bg-gray-50 cursor-pointer ${
                  selectedUser?.id === user.id ? "bg-gray-100" : ""
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="col-span-8 border rounded-lg flex flex-col">
          {selectedUser ? (
            <>
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedUser.avatar} />
                    <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedUser.name}</p>
                    <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {getConversationMessages().map((message) => {
                  const isCurrentUser = message.senderId === currentUserId;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          isCurrentUser
                            ? "bg-primary text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Messages;