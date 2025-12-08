"use client"

import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react"
import * as React from "react"

interface ToastProviderProps {
  readonly children: React.ReactNode
}

interface ToastContainerProps {
  readonly toasts: Toast[]
  readonly removeToast: (id: string) => void
}

interface ToastItemProps {
  readonly toast: Toast
  readonly onRemove: (id: string) => void
}

export type ToastType = "success" | "error" | "info" | "warning"

export interface Toast {
  id: string
  title?: string
  description: string
  type?: ToastType
  duration?: number
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)

// Helper function to filter out toast by id
function filterOutToast(toasts: Toast[], id: string): Toast[] {
  return toasts.filter((t) => t.id !== id)
}

// Helper function to schedule toast removal
function createToastRemovalScheduler(
  setToasts: React.Dispatch<React.SetStateAction<Toast[]>>
) {
  return (toastId: string, duration: number) => {
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => filterOutToast(prev, toastId))
      }, duration)
    }
  }
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => filterOutToast(prev, id))
  }, [])

  const scheduleRemoval = React.useMemo(
    () => createToastRemovalScheduler(setToasts),
    []
  )

  const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const duration = toast.duration ?? 3000
    const newToast: Toast = { ...toast, id, duration }
    setToasts((prev) => [...prev, newToast])
    scheduleRemoval(id, duration)
  }, [scheduleRemoval])

  const contextValue = React.useMemo(
    () => ({ toasts, addToast, removeToast }),
    [toasts, addToast, removeToast]
  )

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}

function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 pointer-events-none max-w-md w-full" aria-live="polite" aria-atomic="true">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const type = toast.type ?? "info"

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  }

  const colors = {
    success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100",
    error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100",
    warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100",
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100",
  }

  const Icon = icons[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={cn(
        "pointer-events-auto flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm",
        colors[type]
      )}
      role="alert"
    >
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="font-semibold text-sm mb-1">{toast.title}</p>
        )}
        <p className="text-sm">{toast.description}</p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        aria-label="Close toast"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}
