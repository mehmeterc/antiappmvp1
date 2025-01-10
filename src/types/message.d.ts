import { Profile } from './profile';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  cafe_id?: string;
}

export interface ChatProps {
  selectedUser: Profile | null;
  messages: Message[];
  senderProfile: Profile | null;
  isLoading: boolean;
  onBack: () => void;
  onSendMessage: (content: string) => Promise<void>;
}

export interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
  disabled?: boolean;
}

export interface MessageListProps {
  messages: Message[];
  senderProfile: Profile | null;
  receiverProfile: Profile | null;
}

export interface UserListProps {
  currentUserId: string;
  onUserSelect: (user: Profile) => void;
  selectedUser: Profile | null;
}