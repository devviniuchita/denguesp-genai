// Types for chat interface - prepared for backend/IA integration

export interface Message {
  id: string;
  chatId: string;
  userId: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string; // ISO 8601 string
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  isTyping?: boolean;
  editedAt?: string;
}

export interface Chat {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
  isOnline?: boolean;
  isTyping?: boolean;
}

export interface ChatState {
  currentChat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

// API types for backend integration
export interface SendMessageRequest {
  chatId: string;
  content: string;
  userId: string;
}

export interface SendMessageResponse {
  messageId: string;
  message: Message;
  success: boolean;
}

export interface GetMessagesRequest {
  chatId: string;
  limit?: number;
  offset?: number;
}

export interface GetMessagesResponse {
  messages: Message[];
  hasMore: boolean;
}
