import { Button } from "@/components/ui/button";
import { Profile } from "@/types/profile";

interface MessageHeaderProps {
  selectedUser: Profile;
  onBack: () => void;
}

export const MessageHeader = ({ selectedUser, onBack }: MessageHeaderProps) => {
  return (
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
  );
};