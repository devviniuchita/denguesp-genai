"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatMessageTime } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import { motion } from 'framer-motion';
import { Check, CheckCheck, Copy, MoreVertical, Save, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import * as React from 'react';

const MarkdownMessage = dynamic(
  () => import('./MarkdownMessage').then((mod) => mod.MarkdownMessage),
  {
    ssr: false,
    loading: () => (
      <p className="text-sm text-muted-foreground animate-pulse">
        Processando resposta...
      </p>
    ),
  },
);

const MessageContextMenu = dynamic(
  () =>
    import('./MessageContextMenu').then((mod) => mod.MessageContextMenu),
  { ssr: false },
);

interface MessageBubbleProps {
  readonly message: Message;
  readonly isConsecutive?: boolean;
  readonly onCopy?: (content: string) => void;
  readonly onEdit?: (messageId: string, newContent: string) => void;
  readonly onDelete?: (messageId: string) => void;
}

export function MessageBubble({
  message,
  isConsecutive = false,
  onCopy,
  onEdit,
  onDelete,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isAI = message.role === "assistant";
  const [showContextMenu, setShowContextMenu] = React.useState(false);
  const [menuPosition, setMenuPosition] = React.useState({ x: 0, y: 0 });
  const [formattedTime, setFormattedTime] = React.useState<string>("");
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedContent, setEditedContent] = React.useState(message.content);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const bubbleRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setFormattedTime(formatMessageTime(new Date(message.timestamp)));
  }, [message.timestamp]);

  React.useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length,
      );
    }
  }, [isEditing]);

  const handleContextMenu = (e: React.MouseEvent) => {
    if (!isUser) return;
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    onCopy?.(message.content);
  };

  const handleStartEdit = () => {
    setEditedContent(message.content);
    setIsEditing(true);
    setShowContextMenu(false);
  };

  const handleSaveEdit = () => {
    const trimmedContent = editedContent.trim();
    if (trimmedContent && trimmedContent !== message.content) {
      onEdit?.(message.id, trimmedContent);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedContent(message.content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  return (
    <TooltipProvider>
      <BlurFade
        delay={isConsecutive ? 0 : 0.1}
        direction="up"
        className={cn(
          "flex w-full mb-3 group relative",
          isUser ? "justify-end" : "justify-start",
          isConsecutive && "mt-1",
        )}
      >
        <motion.article
          ref={bubbleRef}
          className={cn(
            "max-w-[75%] md:max-w-[60%] rounded-2xl px-4 py-3 shadow-md hover:shadow-lg transition-shadow duration-200 relative",
            isUser
              ? "bg-gradient-to-br from-[#005cff] to-[#004bd6] text-white rounded-tr-sm"
              : "bg-white/80 dark:bg-[#202C33]/80 backdrop-blur-md text-gray-900 dark:text-white rounded-tl-sm border border-gray-200/50 dark:border-gray-700/50",
            isConsecutive && "mt-1",
          )}
          aria-label={`Message from ${isUser ? "you" : "AI assistant"}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onContextMenu={handleContextMenu}
        >
          {/* Context Menu Button - Visible on Hover */}
          {isUser && (
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  className={cn(
                    "absolute top-2 right-2 p-1 rounded-full transition-all opacity-0 group-hover:opacity-100",
                    "text-white/70 hover:text-white hover:bg-white/20",
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = bubbleRef.current?.getBoundingClientRect();
                    if (rect) {
                      const menuHeight = 120; // Altura estimada do menu (~3 itens)
                      const menuWidth = 160;
                      const margin = 8; // Margem de segurança
                      const viewportHeight = window.innerHeight;
                      const viewportWidth = window.innerWidth;

                      // Calcular posição Y - verificar espaço abaixo e acima
                      let y: number;
                      const spaceBelow = viewportHeight - rect.bottom;
                      const spaceAbove = rect.top;

                      if (spaceBelow >= menuHeight + margin) {
                        // Há espaço suficiente abaixo
                        y = rect.top + 40;
                      } else if (spaceAbove >= menuHeight + margin) {
                        // Não há espaço abaixo, mas há acima - posicionar acima
                        y = rect.top - menuHeight - margin;
                      } else {
                        // Não há espaço suficiente em nenhum lugar - posicionar no meio da viewport
                        y = Math.max(margin, (viewportHeight - menuHeight) / 2);
                      }

                      // Calcular posição X - verificar espaço à direita e esquerda
                      let x: number;
                      const spaceRight = viewportWidth - rect.right;
                      const spaceLeft = rect.left;

                      // Mensagens do usuário ficam à direita; preferir menu à esquerda
                      if (spaceLeft >= menuWidth + margin) {
                        x = rect.left - menuWidth - margin;
                      } else if (spaceRight >= menuWidth + margin) {
                        x = rect.right - menuWidth;
                      } else {
                        x = Math.max(margin, (viewportWidth - menuWidth) / 2);
                      }

                      setMenuPosition({ x, y });
                      setShowContextMenu(true);
                    }
                  }}
                  aria-label="Message options"
                >
                  <MoreVertical className="h-4 w-4" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Opções da mensagem (clique secundário)</p>
              </TooltipContent>
            </Tooltip>
          )}

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                ref={textareaRef}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className={cn(
                  "w-full bg-transparent border-none outline-none resize-none text-[15px] leading-relaxed",
                  isUser
                    ? "text-white placeholder-white/60"
                    : "text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400",
                )}
                rows={Math.min(
                  Math.max(editedContent.split("\n").length, 1),
                  10,
                )}
                placeholder="Edite sua mensagem..."
              />
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleCancelEdit}
                  className={cn(
                    "h-7 w-7",
                    isUser
                      ? "text-white/70 hover:text-white hover:bg-white/20"
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300",
                  )}
                  aria-label="Cancelar edição"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleSaveEdit}
                  disabled={
                    !editedContent.trim() ||
                    editedContent.trim() === message.content
                  }
                  className={cn(
                    "h-7 w-7",
                    isUser
                      ? "text-white/70 hover:text-white hover:bg-white/20"
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300",
                  )}
                  aria-label="Salvar edição"
                >
                  <Save className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <MarkdownMessage content={message.content} isUser={isUser} />
              {message.editedAt && (
                <span
                  className={cn(
                    "text-[10px] mt-1 block",
                    isUser
                      ? "text-white/60"
                      : "text-gray-400 dark:text-gray-500",
                  )}
                >
                  (editado)
                </span>
              )}
            </>
          )}

          {isUser && (
            <div className="flex items-center justify-end gap-1.5 mt-2">
              {formattedTime && (
                <span
                  className="text-[11px] text-white/80 font-normal"
                  suppressHydrationWarning
                >
                  {formattedTime}
                </span>
              )}
              {message.status === "sending" && (
                <div className="w-3 h-3 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
              )}
              {message.status === "sent" && (
                <Check className="w-4 h-4 text-white/80" />
              )}
              {message.status === "delivered" && (
                <CheckCheck className="w-4 h-4 text-white/80" />
              )}
              {message.status === "read" && (
                <CheckCheck className="w-4 h-4 text-white" />
              )}
            </div>
          )}

          {isAI && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="absolute bottom-2 right-2 p-1.5 rounded-full border border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy();
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copiar</p>
                </TooltipContent>
              </Tooltip>
              <div className="flex items-center justify-start gap-1.5 mt-2">
                {formattedTime && (
                  <span
                    className="text-[11px] text-gray-500 dark:text-gray-400 font-normal"
                    suppressHydrationWarning
                  >
                    {formattedTime}
                  </span>
                )}
              </div>
            </>
          )}
        </motion.article>

        {/* Context Menu */}
        {isUser && showContextMenu && (
          <MessageContextMenu
            position={menuPosition}
            onClose={() => setShowContextMenu(false)}
            onCopy={handleCopy}
            onEdit={handleStartEdit}
            onDelete={() => onDelete?.(message.id)}
          />
        )}
      </BlurFade>
    </TooltipProvider>
  );
}
