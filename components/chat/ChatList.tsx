"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Chat } from "@/types/chat"
import { cn } from "@/lib/utils"
import { formatChatTime } from "@/lib/date-utils"
import { SearchAutocomplete } from "./SearchAutocomplete"

interface ChatListProps {
  chats: Chat[]
  currentChatId: string | null
  onSelectChat: (chat: Chat) => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
  isLoading?: boolean
}

export function ChatList({
  chats,
  currentChatId,
  onSelectChat,
  searchQuery = "",
  onSearchChange,
  isLoading = false,
}: ChatListProps) {
  const filteredChats = React.useMemo(() => {
    if (!searchQuery.trim()) return chats
    const query = searchQuery.toLowerCase()
    return chats.filter(
      (chat) =>
        chat.name.toLowerCase().includes(query) ||
        chat.lastMessage?.toLowerCase().includes(query)
    )
  }, [chats, searchQuery])

  return (
    <div className="flex flex-col h-screen glass-panel border-r border-gray-200 dark:border-gray-700">
      {/* Search Bar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="p-4 border-b border-gray-200 dark:border-gray-700 glass-panel"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 z-10" />
          <Input
            type="search"
            placeholder="Buscar chats... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-9 pr-3 py-2 bg-gray-50 dark:bg-[#202C33] border border-gray-300 dark:border-gray-600 rounded-lg focus-visible:ring-2 focus-visible:ring-[#6B7B2E]/50 focus-visible:border-[#6B7B2E] transition-colors"
            aria-label="Search chats"
            autoComplete="off"
          />
          <SearchAutocomplete
            query={searchQuery}
            chats={chats}
            onSelectChat={onSelectChat}
            onSelectQuery={(query) => {
              onSearchChange?.(query)
              // Focus back on input
              const input = document.querySelector('input[type="search"]') as HTMLInputElement
              input?.focus()
            }}
            className="mt-1"
          />
        </div>
      </motion.div>

      {/* Chat List */}
      <ScrollArea className="flex-1 premium-scrollbar">
        <div>
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <div className="h-11 w-11 rounded-full bg-gray-100 dark:bg-gray-800 shimmer-effect" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 bg-gray-100 dark:bg-gray-800 shimmer-effect rounded" />
                    <div className="h-3 w-2/3 bg-gray-100 dark:bg-gray-800 shimmer-effect rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                {searchQuery ? "Nenhum chat encontrado" : "Ainda não há chats"}
              </p>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                isSelected={chat.id === currentChatId}
                onClick={() => onSelectChat(chat)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

interface ChatListItemProps {
  chat: Chat
  isSelected: boolean
  onClick: () => void
}

function ChatListItem({ chat, isSelected, onClick }: ChatListItemProps) {
  const [formattedTime, setFormattedTime] = React.useState<string>("")

  React.useEffect(() => {
    if (chat.lastMessageTime) {
      setFormattedTime(formatChatTime(chat.lastMessageTime))
    }
  }, [chat.lastMessageTime])

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-gray-100 dark:border-gray-800",
        "hover:bg-gray-50 dark:hover:bg-[#202C33]",
        isSelected && "bg-gradient-to-r from-[#005cff]/10 to-[#005cff]/5 dark:from-[#005cff]/20 dark:to-[#005cff]/10 border-l-4 border-l-[#005cff]"
      )}
      aria-label={`Open chat with ${chat.name}`}
      aria-pressed={isSelected}
    >
      <div className="relative flex-shrink-0">
               <Avatar className="h-11 w-11 ring-2 ring-gray-200 dark:ring-gray-700">
                 <AvatarImage src={chat.avatar} alt={chat.name} />
                 <AvatarFallback className="bg-[#6B7B2E] text-white font-bold">
                   {chat.name.charAt(0).toUpperCase()}
                 </AvatarFallback>
               </Avatar>
        {chat.isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#111B21] rounded-full" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
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
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[13px] text-gray-600 dark:text-gray-400 truncate">
            {chat.lastMessage || "Ainda não há mensagens"}
          </p>
             {chat.unreadCount && chat.unreadCount > 0 && (
               <span className="ml-2 px-2 py-0.5 text-xs font-bold text-white bg-[#005cff] rounded-full min-w-[20px] text-center">
                 {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
               </span>
             )}
        </div>
      </div>
    </motion.button>
  )
}
