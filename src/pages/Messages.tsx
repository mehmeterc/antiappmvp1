import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useSession } from "@supabase/auth-helpers-react";
import { UserList } from "@/components/messages/UserList";
import { MessageContainer } from "@/components/messages/MessageContainer";
import { EmptyState } from "@/components/messages/EmptyState";
import { Profile } from "@/types/profile";
import { useMessages } from "@/hooks/useMessages";

const Messages = () => {
  const session = useSession();
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const { messages, senderProfile, isLoading, handleSendMessage } = useMessages(selectedUser);

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
            <MessageContainer
              selectedUser={selectedUser}
              messages={messages}
              senderProfile={senderProfile}
              isLoading={isLoading}
              onBack={() => setSelectedUser(null)}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Messages;