"use client";

import { ChatList } from "@/components/chat/ChatList";
import { ConnectionStatus } from "@/components/chat/ConnectionIndicator";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import {
  CHAT_SHORTCUTS,
  useKeyboardShortcuts,
} from "@/hooks/use-keyboard-shortcuts";
import { loadMessages, saveMessages } from "@/lib/storage/messages";
import { Chat, Message } from "@/types/chat";
import dynamic from "next/dynamic";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
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

// Mock data - será substituído por integração com backend
const mockChats: Chat[] = [
  {
    id: "ai-assistant",
    name: "Dengue-Gen AI",
    avatar: "/assets/branding/denguegen-icon.png",
    lastMessage: "Olá! Como posso ajudá-lo hoje?",
    lastMessageTime: new Date("2025-11-18T22:05:00"),
    unreadCount: 0,
    isOnline: true,
  },
];

export default function Home() {
  const { addToast } = useToast();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const [currentChat, setCurrentChat] = useState<Chat | null>(
    mockChats[0] || null,
  );
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      chatId: mockChats[0]?.id || "chat-1",
      userId: "ai-assistant",
      content: "Olá! Sou a Dengue-Gen AI. Como posso ajudá-lo hoje?",
      role: "assistant",
      timestamp: new Date("2025-11-18T22:05:00").toISOString(),
      status: "read",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
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
  }>({
    open: false,
    messageId: null,
  });

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
    if (currentChat) {
      const savedMessages = loadMessages(currentChat.id);
      if (savedMessages.length > 0) {
        setMessages(savedMessages);
      }
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

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!currentChat) return;

      // Create user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        chatId: currentChat.id,
        userId: "user-123",
        content,
        role: "user",
        timestamp: new Date().toISOString(),
        status: "sending",
      };

      setMessages((prev) => [...prev, userMessage]);

      // Simulate sending
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessage.id ? { ...msg, status: "sent" } : msg,
          ),
        );
      }, 1500);

      // Simulate delivered status
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessage.id ? { ...msg, status: "delivered" } : msg,
          ),
        );
      }, 1000);

      // Simulate AI response
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          chatId: currentChat.id,
          userId: "ai-assistant",
          content:
            "Esta é uma resposta de exemplo. A integração com o backend será adicionada aqui.",
          role: "assistant",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);

        // Mark user message as read when AI responds
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === userMessage.id ? { ...msg, status: "read" } : msg,
            ),
          );
        }, 500);
      }, 2000);
    },
    [currentChat],
  );

  const handleSelectChat = useCallback((chat: Chat) => {
    setCurrentChat(chat);
    setShowChat(true);
    // Aqui você pode carregar mensagens do chat selecionado
    // Exemplo: loadChatMessages(chat.id)
  }, []);

  const handleCopyMessage = useCallback(
    (content: string) => {
      addToast({
        type: "success",
        description: "Mensagem copiada para a área de transferência",
      });
    },
    [addToast],
  );

  const handleEditMessage = useCallback(
    (messageId: string, newContent: string) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                content: newContent,
                editedAt: new Date().toISOString(),
              }
            : msg,
        ),
      );
      addToast({
        type: "success",
        description: "Mensagem editada com sucesso",
      });
    },
    [addToast],
  );

  const handleDeleteMessage = useCallback((messageId: string) => {
    // Show confirmation dialog
    setDeleteConfirm({ open: true, messageId });
  }, []);

  const confirmDeleteMessage = useCallback(() => {
    if (deleteConfirm.messageId) {
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== deleteConfirm.messageId),
      );
      setDeleteConfirm({ open: false, messageId: null });
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
    // Retry WebSocket connection - to be implemented
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

  if (!mounted) {
    return (
      <ErrorBoundary>
        <div
          className="flex h-screen bg-gray-100 dark:bg-[#0B141A]"
          suppressHydrationWarning
        />
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
          className={`${showChat ? "hidden md:block" : "block"} w-full md:w-96 flex-shrink-0`}
        >
          <ChatList
            chats={mockChats}
            currentChatId={currentChat?.id || null}
            onSelectChat={handleSelectChat}
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
          title="Excluir Mensagem"
          description="Tem certeza de que deseja excluir esta mensagem? Esta ação não pode ser desfeita."
          confirmText="Excluir"
          cancelText="Cancelar"
          variant="destructive"
          onConfirm={confirmDeleteMessage}
          onCancel={() => setDeleteConfirm({ open: false, messageId: null })}
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
  static getDerivedStateFromError(_: unknown) {
    return { hasError: true };
  }
  componentDidCatch(_: unknown) {}
  render() {
    if (this.state.hasError) {
      return <div className="flex h-screen bg-gray-100 dark:bg-[#0B141A]" />;
    }
    return this.props.children as React.ReactElement;
  }
}
