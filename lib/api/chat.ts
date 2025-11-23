import { GetMessagesResponse, SendMessageRequest, SendMessageResponse } from '@/types/chat';

/**
 * Client-side API para Chat
 * Aponta para o BFF Next.js que eventualmente fará proxy para o FastAPI
 */

export async function sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
}

export async function getMessages(
  chatId: string,
  limit = 50,
  offset = 0
): Promise<GetMessagesResponse> {
  const response = await fetch(`/api/chat?chatId=${chatId}&limit=${limit}&offset=${offset}`);

  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }

  return response.json();
}
