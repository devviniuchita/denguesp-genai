"use client";

import { ChatList } from "@/components/chat/ChatList";
import { ConnectionStatus } from "@/components/chat/ConnectionIndicator";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { useHasMounted } from "@/hooks/use-has-mounted";
import {
  CHAT_SHORTCUTS,
  useKeyboardShortcuts,
} from "@/hooks/use-keyboard-shortcuts";
import { useChatStorage } from "@/hooks/use-local-storage";
import { clearMessages, generateChatTitle, loadMessages, saveMessages } from "@/lib/storage/messages";
import { Chat, Message } from "@/types/chat";
import dynamic from "next/dynamic";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

// Helper functions to update message status - extracted to reduce nesting
function updateMessageStatus(
  messages: Message[],
  messageId: string,
  status: Message['status']
): Message[] {
  return messages.map((msg) =>
    msg.id === messageId ? { ...msg, status } : msg
  );
}

function updateMessageContent(
  messages: Message[],
  messageId: string,
  newContent: string
): Message[] {
  return messages.map((msg) =>
    msg.id === messageId
      ? { ...msg, content: newContent, editedAt: new Date().toISOString() }
      : msg
  );
}

function filterOutMessage(messages: Message[], messageId: string): Message[] {
  return messages.filter((msg) => msg.id !== messageId);
}

const HelpModal = dynamic(
  () => import("@/components/chat/HelpModal").then((m) => m.HelpModal),
  {
    ssr: false,
  },
);
const OnboardingTour = dynamic(
  () =>
    import("@/components/chat/OnboardingTour").then((m) => m.OnboardingTour),
  { ssr: false },
);
const ChatWindow = dynamic(
  () => import("@/components/chat/ChatWindow").then((m) => m.ChatWindow),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Preparando o chat...
      </div>
    ),
  },
);

// Default chat - always available
const defaultChat: Chat = {
  id: "ai-assistant",
  name: "Dengue-Gen AI",
  avatar: "/assets/branding/denguegen-icon.png",
  lastMessage: "Olá! Como posso ajudá-lo hoje?",
  lastMessageTime: new Date(),
  unreadCount: 0,
  isOnline: true,
};

// Storage keys
const CHATS_STORAGE_KEY = "dengue_chats";

// Default initial message
const getDefaultMessage = (chatId: string): Message => ({
  id: `welcome-${chatId}`,
  chatId,
  userId: "ai-assistant",
  content: "Olá! Sou a Dengue-Gen AI. Como posso ajudá-lo hoje?",
  role: "assistant",
  timestamp: new Date().toISOString(),
  status: "read",
});

export default function Home() {
  const { addToast } = useToast();
  const mounted = useHasMounted();
  const messagesLoadedRef = useRef(false);

  // Dynamic chats state with localStorage persistence (prevents race condition)
  const [chats, setChats, isChatsLoaded] = useChatStorage<Chat[]>(CHATS_STORAGE_KEY, [defaultChat]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);



  const [messages, setMessages] = useState<Message[]>([getDefaultMessage(defaultChat.id)]);
  const [isLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connected");
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    messageId: string | null;
    type: "message" | "chat";
    chatId?: string;
  }>({ open: false, messageId: null, type: "message" });

  // Set current chat when chats are loaded from localStorage
  useEffect(() => {
    if (isChatsLoaded && chats.length > 0 && !currentChat) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentChat(chats[0]);
    }
  }, [isChatsLoaded, chats, currentChat]);

  // Check if user has completed onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem(
      "chat-onboarding-completed",
    );
    if (!hasCompletedOnboarding) {
      // Show tour after a short delay
      setTimeout(() => {
        setShowTour(true);
      }, 1000);
    }
  }, []);

  // Load messages from localStorage on mount
  useEffect(() => {
    if (currentChat && !messagesLoadedRef.current) {
      const savedMessages = loadMessages(currentChat.id);
      if (savedMessages.length > 0) {
        queueMicrotask(() => {
          setMessages(savedMessages);
        });
      } else {
        // Set default welcome message for new chat
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMessages([getDefaultMessage(currentChat.id)]);
      }
      messagesLoadedRef.current = true;
    }
  }, [currentChat]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (currentChat && messages.length > 0) {
      saveMessages(currentChat.id, messages);
    }
  }, [currentChat, messages]);

  // Keyboard shortcuts
  const shortcuts = {
    ...CHAT_SHORTCUTS,
    "ctrl+/": {
      handler: () => setShowHelpModal(true),
      description: "Mostrar ajuda",
    },
  };
  useKeyboardShortcuts(shortcuts);

  // Update chat's last message info and optionally rename
  const updateChatLastMessage = useCallback((chatId: string, message: string, shouldRename: boolean = false) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== chatId) return chat;
        const updates: Partial<Chat> = {
          lastMessage: message,
          lastMessageTime: new Date(),
        };
        // Rename chat based on first user message (like ChatGPT/Gemini)
        if (shouldRename && chat.name === "Novo Chat") {
          updates.name = generateChatTitle(message);
        }
        return { ...chat, ...updates };
      })
    );
  }, [setChats]);

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!currentChat) return;

      const messageId = `user-${Date.now()}`;
      const aiMessageId = `ai-${Date.now() + 1}`;

      // Create user message
      const userMessage: Message = {
        id: messageId,
        chatId: currentChat.id,
        userId: "user-123",
        content,
        role: "user",
        timestamp: new Date().toISOString(),
        status: "sending",
      };

      setMessages((prev) => [...prev, userMessage]);
      // Rename chat on first user message (like ChatGPT)
      updateChatLastMessage(currentChat.id, content, true);

      // Schedule status updates
      setTimeout(() => {
        setMessages((prev) => updateMessageStatus(prev, messageId, "delivered"));
      }, 1000);

      setTimeout(() => {
        setMessages((prev) => updateMessageStatus(prev, messageId, "sent"));
      }, 1500);

      // Schedule AI response
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const aiContent = "Esta é uma resposta de exemplo. A integração com o backend será adicionada aqui.";
        const aiMessage: Message = {
          id: aiMessageId,
          chatId: currentChat.id,
          userId: "ai-assistant",
          content: aiContent,
          role: "assistant",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        updateChatLastMessage(currentChat.id, aiContent);
      }, 2000);

      // Schedule read status after AI response
      setTimeout(() => {
        setMessages((prev) => updateMessageStatus(prev, messageId, "read"));
      }, 2500);
    },
    [currentChat, updateChatLastMessage],
  );

  // Create new chat
  const handleNewChat = useCallback(() => {
    const newChatId = `chat-${Date.now()}`;
    const newChat: Chat = {
      id: newChatId,
      name: "Novo Chat",
      avatar: "/assets/branding/denguegen-icon.png",
      lastMessage: "Olá! Como posso ajudá-lo hoje?",
      lastMessageTime: new Date(),
      unreadCount: 0,
      isOnline: true,
    };

    setChats((prev) => [newChat, ...prev]);
    setCurrentChat(newChat);
    messagesLoadedRef.current = false;
    setMessages([getDefaultMessage(newChatId)]);
    setShowChat(true);

    addToast({
      type: "success",
      description: "Novo chat criado com sucesso!",
    });
  }, [addToast, setChats]);

  // Rename chat
  const handleRenameChat = useCallback((chatId: string, newName: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, name: newName } : chat
      )
    );
    addToast({
      type: "success",
      description: "Chat renomeado com sucesso!",
    });
  }, [addToast, setChats]);

  // Delete chat
  const handleDeleteChat = useCallback((chatId: string) => {
    setDeleteConfirm({
      open: true,
      messageId: null,
      type: "chat",
      chatId,
    });
  }, []);

  const confirmDeleteChat = useCallback(() => {
    const chatId = deleteConfirm.chatId;
    if (chatId) {
      // Remove chat from list
      setChats((prev) => prev.filter((chat) => chat.id !== chatId));

      // Clear messages from localStorage
      clearMessages(chatId);

      // If this was the current chat, switch to another or show empty
      if (currentChat?.id === chatId) {
        const remainingChats = chats.filter((chat) => chat.id !== chatId);
        if (remainingChats.length > 0) {
          setCurrentChat(remainingChats[0]);
          messagesLoadedRef.current = false;
        } else {
          // Create a new default chat if no chats remain
          const newChat: Chat = {
            id: `chat-${Date.now()}`,
            name: "Novo Chat",
            avatar: "/assets/branding/denguegen-icon.png",
            lastMessage: "Olá! Como posso ajudá-lo hoje?",
            lastMessageTime: new Date(),
            unreadCount: 0,
            isOnline: true,
          };
          setChats([newChat]);
          setCurrentChat(newChat);
          messagesLoadedRef.current = false;
          setMessages([getDefaultMessage(newChat.id)]);
        }
      }

      setDeleteConfirm({ open: false, messageId: null, type: "message" });
      addToast({
        type: "success",
        description: "Chat excluído com sucesso!",
      });
    }
  }, [deleteConfirm.chatId, chats, currentChat, addToast, setChats]);

  const handleSelectChat = useCallback((chat: Chat) => {
    setCurrentChat(chat);
    setShowChat(true);
    messagesLoadedRef.current = false;
    // Load messages for selected chat
    const savedMessages = loadMessages(chat.id);
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    } else {
      setMessages([getDefaultMessage(chat.id)]);
    }
    messagesLoadedRef.current = true;
  }, []);

  const handleCopyMessage = useCallback(
    (_content: string) => {
      addToast({
        type: "success",
        description: "Mensagem copiada para a área de transferência",
      });
    },
    [addToast],
  );

  const handleEditMessage = useCallback(
    (messageId: string, newContent: string) => {
      setMessages((prev) => updateMessageContent(prev, messageId, newContent));
      addToast({
        type: "success",
        description: "Mensagem editada com sucesso",
      });
    },
    [addToast],
  );

  const handleDeleteMessage = useCallback((messageId: string) => {
    // Show confirmation dialog
    setDeleteConfirm({ open: true, messageId, type: "message" });
  }, []);

  const confirmDeleteMessage = useCallback(() => {
    const messageId = deleteConfirm.messageId;
    if (messageId) {
      setMessages((prev) => filterOutMessage(prev, messageId));
      setDeleteConfirm({ open: false, messageId: null, type: "message" });
      addToast({
        type: "success",
        description: "Mensagem excluída",
      });
    }
  }, [deleteConfirm.messageId, addToast]);

  const handleCompleteOnboarding = useCallback(() => {
    localStorage.setItem("chat-onboarding-completed", "true");
    setShowTour(false);
  }, []);

  const handleRetryConnection = useCallback(() => {
    setConnectionStatus("reconnecting");
    addToast({
      type: "info",
      description: "Reconectando...",
    });
    setTimeout(() => {
      setConnectionStatus("connected");
      addToast({
        type: "success",
        description: "Conexão restaurada",
      });
    }, 2000);
  }, [addToast]);

  // Wait for both mount and localStorage to be loaded
  if (!mounted || !isChatsLoaded) {
    return (
      <ErrorBoundary>
        <div
          className="flex h-screen bg-gray-100 dark:bg-[#0B141A] items-center justify-center"
          suppressHydrationWarning
        >
          <div className="text-gray-500 dark:text-gray-400">Carregando...</div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div
        className="flex h-screen bg-gray-100 dark:bg-[#0B141A]"
        suppressHydrationWarning
      >
        {/* Chat List Sidebar */}
        <div
          className={`${showChat ? "hidden md:block" : "block"} ${isSidebarOpen ? "md:w-96" : "md:w-0 md:opacity-0 md:overflow-hidden"} flex-shrink-0 transition-all duration-300 ease-in-out`}
        >
          <ChatList
            chats={chats}
            currentChatId={currentChat?.id || null}
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            onDeleteChat={handleDeleteChat}
            onRenameChat={handleRenameChat}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isLoading={isLoading}
          />
        </div>

        {/* Chat Window */}
        <div
          className={`${showChat ? "block" : "hidden md:block"} flex-1 flex flex-col min-w-0`}
        >
          <ChatWindow
            chat={currentChat}
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            isTyping={isTyping}
            onBack={() => setShowChat(false)}
            onCopyMessage={handleCopyMessage}
            onEditMessage={handleEditMessage}
            onDeleteMessage={handleDeleteMessage}
            connectionStatus={connectionStatus}
            onRetryConnection={handleRetryConnection}
            onToggleSidebar={toggleSidebar}
          />
        </div>

        {/* Help Modal */}
        <HelpModal
          open={showHelpModal}
          onClose={() => setShowHelpModal(false)}
        />

        {/* Onboarding Tour */}
        {showTour && <OnboardingTour onComplete={handleCompleteOnboarding} />}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteConfirm.open}
          title={deleteConfirm.type === "chat" ? "Excluir Chat" : "Excluir Mensagem"}
          description={
            deleteConfirm.type === "chat"
              ? "Tem certeza de que deseja excluir este chat e todas as suas mensagens? Esta ação não pode ser desfeita."
              : "Tem certeza de que deseja excluir esta mensagem? Esta ação não pode ser desfeita."
          }
          confirmText="Excluir"
          cancelText="Cancelar"
          variant="destructive"
          onConfirm={deleteConfirm.type === "chat" ? confirmDeleteChat : confirmDeleteMessage}
          onCancel={() => setDeleteConfirm({ open: false, messageId: null, type: "message" })}
        />
      </div>
    </ErrorBoundary>
  );
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(_error: unknown) {
    return { hasError: true };
  }
  componentDidCatch(_error: unknown, _errorInfo: unknown) {
    // Log error to error reporting service
  }
  render() {
    if (this.state.hasError) {
      return <div className="flex h-screen bg-gray-100 dark:bg-[#0B141A]" />;
    }
    return this.props.children as React.ReactElement;
  }
}
