export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  cafe_id?: string;
  created_at?: string;
}

export interface ChatProps {
  receiverId: string;
  cafeId?: string;
}

export interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export interface UserListProps {
  onSelectUser: (userId: string) => void;
  selectedUserId?: string;
}