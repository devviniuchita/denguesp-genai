import { Message } from '@/types/chat';
import { useEffect, useRef, useState } from 'react';

/**
 * Hook para gerenciar conexão WebSocket com o chat
 * Conecta ao WebSocket server que será servido pelo FastAPI
 * Por enquanto, tenta conectar mas espera falhar graciosamente
 */

export function useChatWebSocket(chatId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!chatId) return;

    // Usar variável de ambiente ou fallback para localhost
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';

    try {
      const ws = new WebSocket(`${wsUrl}/ws/chat/${chatId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[WebSocket] Connected to chat:', chatId);
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'ai_response') {
            setMessages((prev) => [...prev, data.message]);
            setIsTyping(false);
          } else if (data.type === 'typing') {
            setIsTyping(data.isTyping);
          }
        } catch (error) {
          console.error('[WebSocket] Error parsing message:', error);
        }
      };

      ws.onerror = (error) => {
        console.warn('[WebSocket] Connection error (expected during dev):', error);
        setIsConnected(false);
      };

      ws.onclose = () => {
        console.log('[WebSocket] Disconnected from chat');
        setIsConnected(false);
      };

      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };
    } catch (error) {
      console.warn('[WebSocket] Failed to initialize connection:', error);
      setIsConnected(false);
    }
  }, [chatId]);

  const sendTypingIndicator = (isTyping: boolean) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'typing', isTyping }));
    }
  };

  return { messages, isTyping, isConnected, sendTypingIndicator };
}
