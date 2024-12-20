import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { MOCK_MESSAGES, MOCK_USERS, type Message, type User } from "@/data/mockMessages";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Messages = () => {
  const [messages] = useState<Message[]>(MOCK_MESSAGES);
  const [users] = useState<User[]>(MOCK_USERS);
  const currentUserId = "1"; // Mock current user

  const getUserById = (id: string) => {
    return users.find(user => user.id === id);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Messages</h1>
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </div>
        
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => {
              const sender = getUserById(message.senderId);
              const isCurrentUser = message.senderId === currentUserId;
              
              return (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    isCurrentUser ? "flex-row-reverse" : ""
                  }`}
                >
                  <Avatar>
                    <AvatarImage src={sender?.avatar} />
                    <AvatarFallback>{sender?.name[0]}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex flex-col ${
                      isCurrentUser ? "items-end" : "items-start"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{sender?.name}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div
                      className={`mt-1 rounded-lg p-3 ${
                        isCurrentUser
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-lg font-medium mb-2">No messages yet</h2>
            <p className="text-gray-600 mb-4">
              Start connecting with other users and share your favorite spots!
            </p>
            <Button>Start a Conversation</Button>
          </div>
        )}
        
        <div className="fixed bottom-24 left-0 right-0 bg-white p-4 border-t">
          <div className="max-w-4xl mx-auto flex gap-2">
            <Input
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;