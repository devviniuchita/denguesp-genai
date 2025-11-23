import { Message } from "@/types/chat";

/**
 * Utilitários para persistência de mensagens no localStorage
 */

const STORAGE_PREFIX = "dengue_chat_messages_";

/**
 * Salva mensagens de um chat no localStorage
 */
export function saveMessages(chatId: string, messages: Message[]): void {
  try {
    const key = `${STORAGE_PREFIX}${chatId}`;
    localStorage.setItem(key, JSON.stringify(messages));
  } catch (error) {
    console.error("Error saving messages to localStorage:", error);
  }
}

/**
 * Carrega mensagens de um chat do localStorage
 */
export function loadMessages(chatId: string): Message[] {
  try {
    const key = `${STORAGE_PREFIX}${chatId}`;
    const data = localStorage.getItem(key);
    if (!data) return [];
    return JSON.parse(data) as Message[];
  } catch (error) {
    console.error("Error loading messages from localStorage:", error);
    return [];
  }
}

/**
 * Limpa mensagens de um chat do localStorage
 */
export function clearMessages(chatId: string): void {
  try {
    const key = `${STORAGE_PREFIX}${chatId}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error clearing messages from localStorage:", error);
  }
}

/**
 * Lista todos os chats com mensagens salvas
 */
export function listSavedChats(): string[] {
  try {
    const chatIds: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        chatIds.push(key.replace(STORAGE_PREFIX, ""));
      }
    }
    return chatIds;
  } catch (error) {
    console.error("Error listing saved chats:", error);
    return [];
  }
}

/**
 * Limpa todas as mensagens de todos os chats
 */
export function clearAllMessages(): void {
  try {
    const chatIds = listSavedChats();
    chatIds.forEach((chatId) => clearMessages(chatId));
  } catch (error) {
    console.error("Error clearing all messages:", error);
  }
}
