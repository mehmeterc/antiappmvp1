import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Menu } from "lucide-react";
import { MOCK_MESSAGES, MOCK_USERS, type Message, type User } from "@/data/mockMessages";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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

  const UsersList = () => (
    <div className="overflow-y-auto h-full">
      {MOCK_USERS.filter(user => user.id !== currentUserId).map((user) => (
        <div
          key={user.id}
          className={`p-3 flex items-center gap-2 hover:bg-gray-50 cursor-pointer ${
            selectedUser?.id === user.id ? "bg-gray-100" : ""
          }`}
          onClick={() => setSelectedUser(user)}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-4 h-[calc(100vh-200px)]">
        {/* Mobile users list trigger */}
        <div className="md:hidden flex items-center gap-2 p-2 border-b">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <div className="p-4 border-b bg-gray-50">
                <h2 className="font-semibold">Conversations</h2>
              </div>
              <UsersList />
            </SheetContent>
          </Sheet>
          {selectedUser && (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={selectedUser.avatar} />
                <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm">{selectedUser.name}</span>
            </div>
          )}
        </div>

        {/* Desktop users list */}
        <div className="hidden md:block md:col-span-4 border rounded-lg overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-semibold">Conversations</h2>
          </div>
          <UsersList />
        </div>

        {/* Chat area */}
        <div className="col-span-12 md:col-span-8 border rounded-lg flex flex-col">
          {selectedUser ? (
            <>
              <div className="hidden md:block p-4 border-b bg-gray-50">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
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
                        className={`max-w-[70%] rounded-lg p-2 ${
                          isCurrentUser
                            ? "bg-primary text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString([], { 
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