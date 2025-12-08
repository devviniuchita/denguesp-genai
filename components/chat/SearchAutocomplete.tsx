"use client"

import { cn } from "@/lib/utils"
import { Chat } from "@/types/chat"
import { AnimatePresence, motion } from "framer-motion"
import { Clock, Search, TrendingUp } from "lucide-react"
import * as React from "react"

interface SearchAutocompleteProps {
  readonly query: string
  readonly chats: Chat[]
  readonly onSelectChat: (chat: Chat) => void
  readonly onSelectQuery?: (query: string) => void
  readonly className?: string
}

const MAX_RECENT_SEARCHES = 5
const MAX_SUGGESTIONS = 5

export function SearchAutocomplete({
  query,
  chats,
  onSelectChat,
  onSelectQuery,
  className,
}: SearchAutocompleteProps) {
  const [recentSearches, setRecentSearches] = React.useState<string[]>([])
  const [isFocused, setIsFocused] = React.useState(true) // Show by default when there's a query
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const itemsRef = React.useRef<(HTMLButtonElement | null)[]>([])

  // Show autocomplete when query changes or when component mounts with query
  React.useEffect(() => {
    if (query.trim() || recentSearches.length > 0) {
      setIsFocused(true)
      setSelectedIndex(-1)
    }
  }, [query, recentSearches.length])

  // Filter chats based on query
  const filteredChats = React.useMemo(() => {
    if (!query.trim()) return []
    const lowerQuery = query.toLowerCase()
    return chats
      .filter(
        (chat) =>
          chat.name.toLowerCase().includes(lowerQuery) ||
          chat.lastMessage?.toLowerCase().includes(lowerQuery)
      )
      .slice(0, MAX_SUGGESTIONS)
  }, [query, chats])

  // Get suggestions based on query
  const suggestions = React.useMemo(() => {
    if (!query.trim()) return []
    const lowerQuery = query.toLowerCase()
    const commonTerms = ["help", "support", "settings", "profile"]
    return commonTerms
      .filter((term) => term.startsWith(lowerQuery) && term !== lowerQuery)
      .slice(0, 3)
  }, [query])

  // Get all selectable items
  const allItems = React.useMemo(() => {
    const items: Array<{ type: "recent" | "suggestion" | "chat"; data: string | Chat; index: number }> = []
    let index = 0

    if (!query.trim() && recentSearches.length > 0) {
      for (const search of recentSearches) {
        items.push({ type: "recent", data: search, index: index++ })
      }
    }

    if (query.trim()) {
      for (const suggestion of suggestions) {
        items.push({ type: "suggestion", data: suggestion, index: index++ })
      }
      for (const chat of filteredChats) {
        items.push({ type: "chat", data: chat, index: index++ })
      }
    }

    return items
  }, [query, recentSearches, suggestions, filteredChats])

  // Calculate if there are results to show
  const hasResults = filteredChats.length > 0 || suggestions.length > 0 || (isFocused && recentSearches.length > 0)

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

  const handleSelectChat = React.useCallback((chat: Chat) => {
    saveRecentSearch(query)
    onSelectChat(chat)
    setIsFocused(false)
  }, [query, onSelectChat, saveRecentSearch])

  const handleSelectQuery = React.useCallback((selectedQuery: string) => {
    saveRecentSearch(selectedQuery)
    onSelectQuery?.(selectedQuery)
    setIsFocused(false)
  }, [onSelectQuery, saveRecentSearch])

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocused || !hasResults || allItems.length === 0) return

      const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
      if (document.activeElement !== searchInput && !containerRef.current?.contains(document.activeElement)) {
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
          setIsFocused(false)
          searchInput?.blur()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isFocused, hasResults, selectedIndex, allItems, handleSelectChat, handleSelectQuery])

  // Scroll selected item into view
  React.useEffect(() => {
    if (selectedIndex >= 0 && itemsRef.current[selectedIndex]) {
      itemsRef.current[selectedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      })
    }
  }, [selectedIndex])

  // Load recent searches from localStorage
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

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchInput = document.querySelector('input[type="search"]')
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        searchInput !== event.target
      ) {
        setIsFocused(false)
      }
    }

    const handleFocus = () => {
      setIsFocused(true)
    }

    const searchInput = document.querySelector('input[type="search"]')
    searchInput?.addEventListener("focus", handleFocus)

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      searchInput?.removeEventListener("focus", handleFocus)
    }
  }, [])

  if (!isFocused && !query.trim() && recentSearches.length === 0) {
    return null
  }

  return (
    <div ref={containerRef} className="relative">
      <AnimatePresence>
        {hasResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#202C33] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto premium-scrollbar",
              className
            )}
          >
          {/* Recent Searches */}
          {!query.trim() && recentSearches.length > 0 && (
            <div className="p-2">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                <Clock className="h-3.5 w-3.5" />
                Recent Searches
              </div>
              {recentSearches.map((search) => {
                const itemIndex = allItems.findIndex((item) => item.type === "recent" && item.data === search)
                const isSelected = itemIndex >= 0 && selectedIndex === itemIndex
                return (
                  <button
                    key={`recent-${search}`}
                    ref={(el) => {
                      if (itemIndex >= 0) itemsRef.current[itemIndex] = el
                    }}
                    onClick={() => handleSelectQuery(search)}
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg transition-colors",
                      isSelected
                        ? "bg-[#005cff]/10 dark:bg-[#005cff]/20"
                        : "hover:bg-gray-100 dark:hover:bg-[#111B21]"
                    )}
                  >
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="flex-1 text-left">{search}</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Suggestions */}
          {query.trim() && suggestions.length > 0 && (
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                <TrendingUp className="h-3.5 w-3.5" />
                Suggestions
              </div>
              {suggestions.map((suggestion) => {
                const itemIndex = allItems.findIndex((item) => item.type === "suggestion" && item.data === suggestion)
                const isSelected = itemIndex >= 0 && selectedIndex === itemIndex
                return (
                  <button
                    key={`suggestion-${suggestion}`}
                    ref={(el) => {
                      if (itemIndex >= 0) itemsRef.current[itemIndex] = el
                    }}
                    onClick={() => handleSelectQuery(suggestion)}
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg transition-colors",
                      isSelected
                        ? "bg-[#005cff]/10 dark:bg-[#005cff]/20"
                        : "hover:bg-gray-100 dark:hover:bg-[#111B21]"
                    )}
                  >
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="flex-1 text-left">
                      {suggestion}
                      <span className="text-gray-400 ml-1">
                        ({suggestion.slice(query.length)})
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Filtered Chats */}
          {query.trim() && filteredChats.length > 0 && (
            <div className="p-2">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                <Search className="h-3.5 w-3.5" />
                Chats
              </div>
              {filteredChats.map((chat, _index) => {
                const itemIndex = allItems.findIndex((item) => item.type === "chat" && (item.data as Chat).id === chat.id)
                const isSelected = itemIndex >= 0 && selectedIndex === itemIndex
                return (
                  <button
                    key={chat.id}
                    ref={(el) => {
                      if (itemIndex >= 0) itemsRef.current[itemIndex] = el
                    }}
                    onClick={() => handleSelectChat(chat)}
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg transition-colors",
                      isSelected
                        ? "bg-[#005cff]/10 dark:bg-[#005cff]/20"
                        : "hover:bg-gray-100 dark:hover:bg-[#111B21]"
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#005cff] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {chat.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-medium truncate">{chat.name}</div>
                      {chat.lastMessage && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
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
          {query.trim() && filteredChats.length === 0 && suggestions.length === 0 && (
            <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              No chats found matching &quot;{query}&quot;
            </div>
          )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
