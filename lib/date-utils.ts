/**
 * Utility functions for date and time formatting
 */

/**
 * Formats a date to show relative time (Today, Yesterday, weekday, or date)
 * Used in chat list to show when last message was sent
 */
export function formatChatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    // Today - show time
    const hours = date.getHours()
    const minutes = date.getMinutes()
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
  } else if (days === 1) {
    return "Yesterday"
  } else if (days < 7) {
    // Within a week - show weekday
    return date.toLocaleDateString("en-US", { weekday: "short" })
  } else {
    // Older - show month and day
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }
}

/**
 * Formats a date to show time only (HH:MM)
 * Used in message bubbles to show when message was sent
 */
export function formatMessageTime(date: Date): string {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
}
