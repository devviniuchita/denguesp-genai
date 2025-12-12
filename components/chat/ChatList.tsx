"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatChatTime } from "@/lib/date-utils"
import { chatHasMatchingMessages } from "@/lib/storage/messages"
import { cn } from "@/lib/utils"
import { Chat } from "@/types/chat"
import { AnimatePresence, motion } from "framer-motion"
import { Check, Edit2, MessageSquarePlus, Plus, Search, Trash2, X } from "lucide-react"
import * as React from "react"
import { SearchAutocomplete } from "./SearchAutocomplete"

interface ChatListProps {
  readonly chats: Chat[]
  readonly currentChatId: string | null
  readonly onSelectChat: (chat: Chat) => void
  readonly onNewChat?: () => void
  readonly onDeleteChat?: (chatId: string) => void
  readonly onRenameChat?: (chatId: string, newName: string) => void
  readonly searchQuery?: string
  readonly onSearchChange?: (query: string) => void
  readonly isLoading?: boolean
}

export function ChatList({
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat,
  searchQuery = "",
  onSearchChange,
  isLoading = false,
}: ChatListProps) {
  // Filter chats by name, lastMessage, AND content of all messages
  const filteredChats = React.useMemo(() => {
    if (!searchQuery.trim()) return chats
    const query = searchQuery.toLowerCase()

    return chats.filter((chat) => {
      // Check name
      if (chat.name.toLowerCase().includes(query)) return true
      // Check last message
      if (chat.lastMessage?.toLowerCase().includes(query)) return true
      // Check all messages content (deep search like ChatGPT)
      if (chatHasMatchingMessages(chat.id, query)) return true
      return false
    })
  }, [chats, searchQuery])

  return (
    <div className="flex flex-col h-screen glass-panel border-r border-gray-200 dark:border-gray-700">
      {/* Header with Title and New Chat Button */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="p-4 border-b border-gray-200 dark:border-gray-700 glass-panel"
      >
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Chats
          </h1>
          {onNewChat && (
            <Button
              variant="outline"
              size="sm"
              onClick={onNewChat}
              className="gap-2 bg-gradient-to-r from-[#005cff] to-[#004bd6] hover:from-[#004bd6] hover:to-[#0036b3] text-white border-0 shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Novo Chat</span>
            </Button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 z-10 pointer-events-none" />
          <Input
            type="search"
            placeholder="Buscar em chats e mensagens..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-9 pr-9 py-2 bg-gray-50 dark:bg-[#202C33] border border-gray-300 dark:border-gray-600 rounded-lg focus-visible:ring-2 focus-visible:ring-[#005cff]/50 focus-visible:border-[#005cff] transition-colors"
            aria-label="Buscar chats e mensagens"
            autoComplete="off"
          />
          {/* Clear button */}
          {searchQuery && (
            <button
              onClick={() => onSearchChange?.("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10"
              aria-label="Limpar busca"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <SearchAutocomplete
            query={searchQuery}
            chats={chats}
            onSelectChat={(chat) => {
              onSelectChat(chat)
              onSearchChange?.("")
            }}
            onSelectQuery={(query) => {
              onSearchChange?.(query)
            }}
            className="mt-1"
          />
        </div>
      </motion.div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto premium-scrollbar">
        <ChatListContent
          chats={filteredChats}
          isLoading={isLoading}
          searchQuery={searchQuery}
          currentChatId={currentChatId}
          onNewChat={onNewChat}
          onSelectChat={onSelectChat}
          onDeleteChat={onDeleteChat}
          onRenameChat={onRenameChat}
        />
      </div>
    </div>
  )
}

interface ChatListContentProps {
  readonly chats: Chat[]
  readonly isLoading: boolean
  readonly searchQuery: string
  readonly currentChatId: string | null
  readonly onNewChat?: () => void
  readonly onSelectChat: (chat: Chat) => void
  readonly onDeleteChat?: (chatId: string) => void
  readonly onRenameChat?: (chatId: string, newName: string) => void
}

const SKELETON_IDS = [0, 1, 2, 3, 4, 5, 6, 7]

function ChatListContent({
  chats,
  isLoading,
  searchQuery,
  currentChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
}: ChatListContentProps) {
  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {SKELETON_IDS.map((id) => (
          <div key={`skeleton-${id}`} className="flex items-center gap-3 px-4 py-3">
            <div className="h-11 w-11 rounded-full bg-gray-100 dark:bg-gray-800 shimmer-effect" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-gray-100 dark:bg-gray-800 shimmer-effect rounded" />
              <div className="h-3 w-2/3 bg-gray-100 dark:bg-gray-800 shimmer-effect rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#005cff]/10 to-[#005cff]/5 dark:from-[#005cff]/20 dark:to-[#005cff]/10 flex items-center justify-center mb-4"
        >
          <MessageSquarePlus className="w-10 h-10 text-[#005cff]" />
        </motion.div>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
          {searchQuery ? "Nenhum chat ou mensagem encontrada" : "Ainda não há chats"}
        </p>
        {!searchQuery && onNewChat && (
          <Button
            variant="outline"
            size="sm"
            onClick={onNewChat}
            className="gap-2 border-[#005cff] text-[#005cff] hover:bg-[#005cff]/10"
          >
            <Plus className="h-4 w-4" />
            Iniciar novo chat
          </Button>
        )}
      </div>
    )
  }

  return (
    <AnimatePresence mode="popLayout">
      {chats.map((chat) => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          isSelected={chat.id === currentChatId}
          searchQuery={searchQuery}
          onClick={() => onSelectChat(chat)}
          onDelete={onDeleteChat ? () => onDeleteChat(chat.id) : undefined}
          onRename={onRenameChat ? (newName) => onRenameChat(chat.id, newName) : undefined}
        />
      ))}
    </AnimatePresence>
  )
}

interface ChatListItemProps {
  readonly chat: Chat
  readonly isSelected: boolean
  readonly searchQuery?: string
  readonly onClick: () => void
  readonly onDelete?: () => void
  readonly onRename?: (newName: string) => void
}

function ChatListItem({ chat, isSelected, searchQuery, onClick, onDelete, onRename }: ChatListItemProps) {
  const [formattedTime, setFormattedTime] = React.useState<string>("")
  const [showActions, setShowActions] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [editName, setEditName] = React.useState(chat.name)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (chat.lastMessageTime) {
      setFormattedTime(formatChatTime(chat.lastMessageTime))
    }
  }, [chat.lastMessageTime])

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSaveRename = () => {
    if (editName.trim() && editName !== chat.name) {
      onRename?.(editName.trim())
    }
    setIsEditing(false)
  }

  const handleCancelRename = () => {
    setEditName(chat.name)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveRename()
    } else if (e.key === "Escape") {
      handleCancelRename()
    }
  }

  // Check if this chat has matching messages (for visual indicator)
  const hasMatchingContent = searchQuery ? chatHasMatchingMessages(chat.id, searchQuery) : false

  // Render Functions to reduce complexity
  const renderEditingView = () => (
    <div className="flex items-center gap-1 flex-1">
      <Input
        ref={inputRef}
        value={editName}
        onChange={(e) => setEditName(e.target.value)}
        onKeyDown={handleKeyDown}
        className="h-7 text-sm py-0 px-2"
      />
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); handleSaveRename(); }}
        className="inline-flex items-center justify-center h-6 w-6 rounded-md text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer transition-colors"
      >
        <Check className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); handleCancelRename(); }}
        className="inline-flex items-center justify-center h-6 w-6 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )

  const renderDisplayView = () => (
    <>
      <h3 className={cn(
        "text-[15px] font-semibold truncate",
        isSelected ? "text-[#005cff] dark:text-[#4da3ff]" : "text-gray-900 dark:text-white"
      )}>
        {chat.name}
      </h3>
      {chat.lastMessageTime && formattedTime && (
        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2" suppressHydrationWarning>
          {formattedTime}
        </span>
      )}
    </>
  )

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className="relative"
    >
      {/* Container - use div when editing to avoid nested buttons */}
      <div
        role={isEditing ? undefined : "button"}
        tabIndex={isEditing ? undefined : 0}
        onClick={isEditing ? undefined : onClick}
        onKeyDown={isEditing ? undefined : (e) => {
          if (e.key === 'Enter' || e.key === ' ') onClick()
        }}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-gray-100 dark:border-gray-800",
          !isEditing && "hover:bg-gray-50 dark:hover:bg-[#202C33] cursor-pointer",
          isSelected && "bg-gradient-to-r from-[#005cff]/10 to-[#005cff]/5 dark:from-[#005cff]/20 dark:to-[#005cff]/10 border-l-4 border-l-[#005cff]"
        )}
        aria-label={isEditing ? undefined : `Abrir chat: ${chat.name}`}
        aria-pressed={isEditing ? undefined : isSelected}
      >
        <div className="relative flex-shrink-0">
          <Avatar className="h-11 w-11 ring-2 ring-gray-200 dark:ring-gray-700">
            <AvatarImage src={chat.avatar} alt={chat.name} />
            <AvatarFallback className="bg-[#005cff] text-white font-bold">
              {chat.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {chat.isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#111B21] rounded-full" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            {isEditing ? renderEditingView() : renderDisplayView()}
          </div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-[13px] text-gray-600 dark:text-gray-400 truncate">
              {chat.lastMessage || "Ainda não há mensagens"}
            </p>
            {hasMatchingContent && searchQuery && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium text-[#005cff] bg-[#005cff]/10 rounded">
                Mensagem
              </span>
            )}
            {chat.unreadCount && chat.unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-bold text-white bg-[#005cff] rounded-full min-w-[20px] text-center">
                {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {!isEditing && (onDelete || onRename) && (
        <ChatActionButtons
          showActions={showActions}
          onRename={onRename ? () => {
             setIsEditing(true)
          } : undefined}
          onDelete={onDelete}
          chatName={chat.name}
        />
      )}
    </motion.div>
  )
}

interface ChatActionButtonsProps {
  readonly showActions: boolean
  readonly onRename?: () => void
  readonly onDelete?: () => void
  readonly chatName: string
}

function ChatActionButtons({ showActions, onRename, onDelete, chatName }: ChatActionButtonsProps) {
  return (
    <AnimatePresence>
      {showActions && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15 }}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1"
        >
          {onRename && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                onRename()
              }}
              className="h-8 w-8 rounded-full bg-gray-500/10 hover:bg-gray-500/20 text-gray-500 hover:text-gray-600 transition-colors"
              aria-label={`Renomear chat ${chatName}`}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="h-8 w-8 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-600 transition-colors"
              aria-label={`Excluir chat ${chatName}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
