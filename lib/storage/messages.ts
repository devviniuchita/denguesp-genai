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

/**
 * Busca mensagens em todos os chats que contenham o termo de busca
 * Retorna um mapa de chatId -> mensagens que contêm o termo
 */
export function searchMessagesInAllChats(searchTerm: string): Map<string, Message[]> {
  const results = new Map<string, Message[]>();

  if (!searchTerm.trim()) return results;

  try {
    const chatIds = listSavedChats();
    const lowerSearchTerm = searchTerm.toLowerCase();

    for (const chatId of chatIds) {
      const messages = loadMessages(chatId);
      const matchingMessages = messages.filter(
        (msg) => msg.content.toLowerCase().includes(lowerSearchTerm)
      );

      if (matchingMessages.length > 0) {
        results.set(chatId, matchingMessages);
      }
    }
  } catch (error) {
    console.error("Error searching messages:", error);
  }

  return results;
}

/**
 * Verifica se um chat contém mensagens que correspondem ao termo de busca
 */
export function chatHasMatchingMessages(chatId: string, searchTerm: string): boolean {
  if (!searchTerm.trim()) return false;

  try {
    const messages = loadMessages(chatId);
    const lowerSearchTerm = searchTerm.toLowerCase();
    return messages.some((msg) => msg.content.toLowerCase().includes(lowerSearchTerm));
  } catch {
    return false;
  }
}

/**
 * Gera um título para o chat baseado na primeira mensagem do usuário
 * Estilo ChatGPT/Gemini: trunca para ~30 caracteres
 */
export function generateChatTitle(content: string): string {
  // Remove quebras de linha e espaços extras
  const cleaned = content.replaceAll(/\s+/g, " ").trim();

  // Limite de caracteres para o título
  const maxLength = 35;

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  // Trunca no último espaço antes do limite para não cortar palavras
  const truncated = cleaned.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > 20) {
    return truncated.substring(0, lastSpace) + "...";
  }

  return truncated + "...";
}
