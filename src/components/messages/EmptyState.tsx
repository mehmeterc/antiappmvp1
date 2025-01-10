import { MessageSquare } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 text-gray-500">
      <MessageSquare className="h-12 w-12 mb-4 text-gray-400" />
      <h3 className="font-medium mb-2">No conversation selected</h3>
      <p className="text-sm text-center">
        Choose a user from the list to start messaging
      </p>
    </div>
  );
};