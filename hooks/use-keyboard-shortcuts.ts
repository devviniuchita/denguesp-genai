import { useEffect, useCallback } from "react"

interface KeyboardShortcuts {
  [key: string]: {
    handler: () => void
    description: string
    preventDefault?: boolean
  }
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = `${event.ctrlKey || event.metaKey ? "ctrl+" : ""}${event.shiftKey ? "shift+" : ""}${event.key.toLowerCase()}`

      const shortcut = shortcuts[key] || shortcuts[event.key.toLowerCase()]

      if (shortcut) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault()
        }
        shortcut.handler()
      }
    },
    [shortcuts]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])
}

// Common keyboard shortcuts for chat applications
export const CHAT_SHORTCUTS = {
  "ctrl+k": {
    handler: () => {
      // Focus search input
      const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
      searchInput?.focus()
    },
    description: "Focus search",
  },
  "ctrl+n": {
    handler: () => {
      // Create new chat (to be implemented)
      console.log("New chat shortcut pressed")
    },
    description: "New chat",
  },
  escape: {
    handler: () => {
      // Close modals/menus
      const modals = document.querySelectorAll('[role="dialog"], [role="menu"]')
      modals.forEach((modal) => {
        if (modal instanceof HTMLElement) {
          modal.style.display = "none"
        }
      })
    },
    description: "Close modal/menu",
  },
  "ctrl+/": {
    handler: () => {
      // Show help modal (to be implemented)
      console.log("Help shortcut pressed")
    },
    description: "Show help",
  },
}
