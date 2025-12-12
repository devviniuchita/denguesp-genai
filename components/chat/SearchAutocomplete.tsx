"use client"

import { cn } from "@/lib/utils"
import { Chat } from "@/types/chat"
import { AnimatePresence, motion } from "framer-motion"
import { Clock, MessageSquare, Search, X } from "lucide-react"
import * as React from "react"

interface SearchAutocompleteProps {
  readonly query: string
  readonly chats: Chat[]
  readonly onSelectChat: (chat: Chat) => void
  readonly onSelectQuery?: (query: string) => void
  readonly className?: string
}

const MAX_RECENT_SEARCHES = 5
const MAX_RESULTS = 8

export function SearchAutocomplete({
  query,
  chats,
  onSelectChat,
  onSelectQuery,
  className,
}: SearchAutocompleteProps) {
  const [recentSearches, setRecentSearches] = React.useState<string[]>([])
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const itemsRef = React.useRef<(HTMLButtonElement | null)[]>([])

  // Load recent searches from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem("chat-recent-searches")
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored))
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  // Filter chats based on query - only name and lastMessage (deep search is in ChatList)
  const filteredChats = React.useMemo(() => {
    if (!query.trim()) return []
    const lowerQuery = query.toLowerCase()
    return chats
      .filter(
        (chat) =>
          chat.name.toLowerCase().includes(lowerQuery) ||
          chat.lastMessage?.toLowerCase().includes(lowerQuery)
      )
      .slice(0, MAX_RESULTS)
  }, [query, chats])

  // Get all selectable items
  const allItems = React.useMemo(() => {
    const items: Array<{ type: "recent" | "chat"; data: string | Chat; index: number }> = []
    let index = 0

    // Show recent searches only when no query and dropdown is open
    if (!query.trim() && isOpen && recentSearches.length > 0) {
      for (const search of recentSearches) {
        items.push({ type: "recent", data: search, index: index++ })
      }
    }

    // Show filtered chats when there's a query
    if (query.trim()) {
      for (const chat of filteredChats) {
        items.push({ type: "chat", data: chat, index: index++ })
      }
    }

    return items
  }, [query, recentSearches, filteredChats, isOpen])

  // Show dropdown when there are items to show
  const showDropdown = isOpen && allItems.length > 0

  // Save recent searches to localStorage
  const saveRecentSearch = React.useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return

    setRecentSearches((prev) => {
      const updated = [searchQuery, ...prev.filter((s) => s !== searchQuery)].slice(
        0,
        MAX_RECENT_SEARCHES
      )
      localStorage.setItem("chat-recent-searches", JSON.stringify(updated))
      return updated
    })
  }, [])

  // Clear recent searches
  const clearRecentSearches = React.useCallback(() => {
    setRecentSearches([])
    localStorage.removeItem("chat-recent-searches")
  }, [])

  const handleSelectChat = React.useCallback((chat: Chat) => {
    if (query.trim()) {
      saveRecentSearch(query)
    }
    onSelectChat(chat)
    setIsOpen(false)
    setSelectedIndex(-1)
  }, [query, onSelectChat, saveRecentSearch])

  const handleSelectQuery = React.useCallback((selectedQuery: string) => {
    onSelectQuery?.(selectedQuery)
    setIsOpen(false)
    setSelectedIndex(-1)
  }, [onSelectQuery])

  const handleClose = React.useCallback(() => {
    setIsOpen(false)
    setSelectedIndex(-1)
  }, [])

  // Open dropdown on focus
  const handleFocusIn = React.useCallback(() => {
    setIsOpen(true)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (!showDropdown) {
      if (e.key === "ArrowDown" && allItems.length > 0) {
        setIsOpen(true)
        return
      }
      return
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < allItems.length - 1 ? prev + 1 : 0))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allItems.length - 1))
        break
      case "Enter":
        if (selectedIndex >= 0 && selectedIndex < allItems.length) {
          e.preventDefault()
          const item = allItems[selectedIndex]
          if (item.type === "chat") {
            handleSelectChat(item.data as Chat)
          } else {
            handleSelectQuery(item.data as string)
          }
        }
        break
      case "Escape":
        e.preventDefault()
        handleClose()
        break
    }
  }, [showDropdown, allItems, selectedIndex, handleSelectChat, handleSelectQuery, handleClose])

  // Scroll selected item into view
  React.useEffect(() => {
    if (selectedIndex >= 0 && itemsRef.current[selectedIndex]) {
      itemsRef.current[selectedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      })
    }
  }, [selectedIndex])

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, handleClose])

  // Reset selected index when query changes
  React.useEffect(() => {
    setSelectedIndex(-1)
  }, [query])

  return (
    <div
      ref={containerRef}
      className="relative"
      onFocus={handleFocusIn}
      onKeyDown={handleKeyDown}
    >
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#202C33] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-80 overflow-hidden",
              className
            )}
          >
            {/* Header with close button */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-700/50">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {query.trim() ? `Resultados para "${query}"` : "Buscas Recentes"}
              </span>
              <button
                onClick={handleClose}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Fechar"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Results */}
            <div className="overflow-y-auto max-h-64 premium-scrollbar">
              {/* Recent Searches */}
              {!query.trim() && recentSearches.length > 0 && (
                <div className="p-2">
                  {recentSearches.map((search, idx) => {
                    const isSelected = selectedIndex === idx
                    return (
                      <button
                        key={`recent-${search}`}
                        ref={(el) => { itemsRef.current[idx] = el }}
                        onClick={() => handleSelectQuery(search)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 rounded-lg transition-all",
                          isSelected
                            ? "bg-[#005cff]/10 dark:bg-[#005cff]/20 text-[#005cff]"
                            : "hover:bg-gray-50 dark:hover:bg-[#111B21]"
                        )}
                      >
                        <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="flex-1 text-left truncate">{search}</span>
                      </button>
                    )
                  })}
                  {/* Clear recent searches button */}
                  <button
                    onClick={clearRecentSearches}
                    className="w-full mt-1 px-3 py-2 text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors text-center"
                  >
                    Limpar histórico de buscas
                  </button>
                </div>
              )}

              {/* Filtered Chats */}
              {query.trim() && filteredChats.length > 0 && (
                <div className="p-2">
                  {filteredChats.map((chat, idx) => {
                    const isSelected = selectedIndex === idx
                    return (
                      <button
                        key={chat.id}
                        ref={(el) => { itemsRef.current[idx] = el }}
                        onClick={() => handleSelectChat(chat)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 rounded-lg transition-all",
                          isSelected
                            ? "bg-[#005cff]/10 dark:bg-[#005cff]/20"
                            : "hover:bg-gray-50 dark:hover:bg-[#111B21]"
                        )}
                      >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#005cff] to-[#004bd6] flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                          {chat.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="font-medium truncate">{chat.name}</div>
                          {chat.lastMessage && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {chat.lastMessage}
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* No Results */}
              {query.trim() && filteredChats.length === 0 && (
                <div className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nenhum resultado para &quot;{query}&quot;
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Tente buscar por outro termo
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
