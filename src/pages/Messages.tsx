import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare } from "lucide-react";

const Messages = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Messages</h1>
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h2 className="text-lg font-medium mb-2">No messages yet</h2>
          <p className="text-gray-600 mb-4">
            Start connecting with other users and share your favorite spots!
          </p>
          <Button>Start a Conversation</Button>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;