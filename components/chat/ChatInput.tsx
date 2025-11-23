"use client"

import * as React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Send, Paperclip, Smile, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSendMessage: (content: string) => void
  disabled?: boolean
  placeholder?: string
  maxLength?: number
}

const MAX_MESSAGE_LENGTH = 4000
const DEBOUNCE_DELAY = 300

export function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = "Digite uma mensagem...",
  maxLength = MAX_MESSAGE_LENGTH,
}: ChatInputProps) {
  const { addToast } = useToast()
  const [input, setInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }, [input])

  const handleSend = useCallback(() => {
    const trimmedInput = input.trim()

    if (!trimmedInput) {
      setError("A mensagem não pode estar vazia")
      addToast({
        type: "error",
        description: "A mensagem não pode estar vazia",
      })
      return
    }

    if (trimmedInput.length > maxLength) {
      const errorMsg = `A mensagem é muito longa. Máximo de ${maxLength} caracteres permitidos.`
      setError(errorMsg)
      addToast({
        type: "error",
        description: errorMsg,
      })
      return
    }

    if (disabled) return

    // Clear any existing error
    setError(null)

    // Clear debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    onSendMessage(trimmedInput)
    setInput("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }, [input, maxLength, disabled, onSendMessage, addToast])

  // Debounced send to prevent rapid submissions
  const handleSendDebounced = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      handleSend()
    }, DEBOUNCE_DELAY)
  }, [handleSend])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendDebounced()
    }

    // Clear error when user starts typing
    if (error) {
      setError(null)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value

    // Clear error when user starts typing
    if (error) {
      setError(null)
    }

    // Prevent exceeding max length
    if (value.length <= maxLength) {
      setInput(value)
    } else {
      setError(`A mensagem é muito longa. Máximo de ${maxLength} caracteres permitidos.`)
    }
  }

  const charactersRemaining = maxLength - input.length
  const isNearLimit = charactersRemaining < 100

  return (
    <TooltipProvider>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="flex flex-col gap-2 p-4 bg-white/80 dark:bg-[#202C33]/80 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50"
      >
        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-600 dark:text-red-400 px-2"
            role="alert"
          >
            {error}
          </motion.div>
        )}

        <div className="flex items-end gap-2">
          {/* Attachment Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0 touch-target"
                aria-label="Attach file"
                disabled={disabled}
              >
                <Paperclip className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Anexar arquivo (Em breve)</p>
            </TooltipContent>
          </Tooltip>

          {/* Input Area */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              maxLength={maxLength}
              className={cn(
                "w-full resize-none rounded-xl border",
                error
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-300 dark:border-gray-600",
                "bg-gray-50 dark:bg-[#111B21] text-gray-900 dark:text-white",
                "px-4 py-2.5 text-[15px]",
                "focus:outline-none focus:ring-2",
                error
                  ? "focus:ring-red-500/50 focus:border-red-500"
                  : "focus:ring-[#005cff]/50 focus:border-[#005cff]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                "max-h-[120px] overflow-y-auto",
                "transition-colors"
              )}
              aria-label="Message input"
              aria-invalid={!!error}
              aria-describedby={error ? "input-error" : isNearLimit ? "char-count" : undefined}
            />
            {/* Character Count */}
            {isNearLimit && (
              <div
                id="char-count"
                className={cn(
                  "absolute bottom-2 right-2 text-xs",
                  charactersRemaining < 20
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-500 dark:text-gray-400"
                )}
              >
                {charactersRemaining}
              </div>
            )}
          </div>

          {/* Emoji Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0 touch-target"
                aria-label="Add emoji"
                disabled={disabled}
              >
                <Smile className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Adicionar emoji (Em breve)</p>
            </TooltipContent>
          </Tooltip>

          {/* Send/Voice Button */}
          {input.trim() ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Button
                    onClick={handleSendDebounced}
                    disabled={disabled || !input.trim() || !!error}
                    className="h-11 w-11 rounded-lg bg-gradient-to-br from-[#005cff] to-[#004bd6] hover:from-[#004bd6] hover:to-[#0036b3] text-white shadow-md transition-all flex-shrink-0 disabled:opacity-50 touch-target"
                    aria-label="Send message"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Enviar mensagem (Enter)</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0 touch-target"
                  aria-label="Record voice message"
                  disabled={disabled}
                >
                  <Mic className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Gravar mensagem de voz (Em breve)</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </motion.div>
    </TooltipProvider>
  )
}
