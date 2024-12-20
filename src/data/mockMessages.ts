export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  cafeId?: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

export const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    email: "john@example.com",
  },
  {
    id: "2",
    name: "Jane Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    email: "jane@example.com",
  },
  {
    id: "3",
    name: "Alice Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    email: "alice@example.com",
  },
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    senderId: "2",
    receiverId: "1",
    content: "Hey! Have you tried the new café on Torstraße?",
    timestamp: "2024-02-20T10:00:00Z",
    cafeId: "1",
  },
  {
    id: "2",
    senderId: "1",
    receiverId: "2",
    content: "Not yet! Is it good for working?",
    timestamp: "2024-02-20T10:05:00Z",
  },
  {
    id: "3",
    senderId: "3",
    receiverId: "1",
    content: "Looking for study buddies at Community Hub!",
    timestamp: "2024-02-20T11:00:00Z",
    cafeId: "2",
  },
];