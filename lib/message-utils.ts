import { Message } from '@/types/chat';

/**
 * Helper para criar mensagem com o novo formato
 */
export function createMessage(params: {
  id?: string;
  chatId: string;
  userId: string;
  content: string;
  role: 'user' | 'assistant';
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}): Message {
  return {
    id: params.id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    chatId: params.chatId,
    userId: params.userId,
    content: params.content,
    role: params.role,
    timestamp: new Date().toISOString(),
    status: params.status || 'sent',
  };
}

/**
 * Helper para checar se a mensagem é do usuário
 */
export function isUserMessage(message: Message): boolean {
  return message.role === 'user';
}

/**
 * Helper para checar se a mensagem é do assistente
 */
export function isAssistantMessage(message: Message): boolean {
  return message.role === 'assistant';
}

/**
 * Helper para formatar timestamp
 */
export function getMessageTimestamp(message: Message): Date {
  return new Date(message.timestamp);
}
