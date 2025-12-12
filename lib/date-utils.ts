/**
 * Utility functions for date and time formatting
 * Localized for Brazilian Portuguese (pt-BR)
 */

/**
 * Formats a date to show relative time (Hoje, Ontem, weekday, or date)
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
    return "Ontem"
  } else if (days < 7) {
    // Within a week - show weekday in Portuguese
    return date.toLocaleDateString("pt-BR", { weekday: "short" })
  } else {
    // Older - show month and day in Portuguese
    return date.toLocaleDateString("pt-BR", { month: "short", day: "numeric" })
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

/**
 * Formats a date to show full date and time in Portuguese
 * Used for detailed message info
 */
export function formatFullDateTime(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
