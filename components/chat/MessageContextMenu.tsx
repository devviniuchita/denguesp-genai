"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { Copy, Edit, Trash2 } from "lucide-react"
import * as React from "react"

interface MessageContextMenuProps {
  messageId: string
  onCopy?: () => void
  onEdit?: () => void
  onDelete?: () => void
  position: { x: number; y: number }
  onClose: () => void
}

export function MessageContextMenu({
  onCopy,
  onEdit,
  onDelete,
  position,
  onClose,
}: MessageContextMenuProps) {
  const menuRef = React.useRef<HTMLDivElement>(null)
  const [adjustedPosition, setAdjustedPosition] = React.useState(position)

  // Ajustar posição baseado nos limites da viewport
  React.useEffect(() => {
    if (!menuRef.current) return

    // Usar requestAnimationFrame para garantir que o menu está totalmente renderizado
    const adjustPosition = () => {
      if (!menuRef.current) return

      const menuRect = menuRef.current.getBoundingClientRect()
      const margin = 8 // Margem de segurança
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let adjustedX = position.x
      let adjustedY = position.y

      // Verificar limites horizontais
      const menuRightEdge = position.x + menuRect.width
      if (menuRightEdge > viewportWidth - margin) {
        // Menu sai pela direita - ajustar para dentro
        adjustedX = Math.max(margin, viewportWidth - menuRect.width - margin)
      }
      if (adjustedX < margin) {
        // Menu sai pela esquerda - ajustar para dentro
        adjustedX = margin
      }

      // Verificar limites verticais
      const menuBottomEdge = position.y + menuRect.height
      if (menuBottomEdge > viewportHeight - margin) {
        // Menu sai por baixo - ajustar para dentro
        adjustedY = Math.max(margin, viewportHeight - menuRect.height - margin)
      }
      if (adjustedY < margin) {
        // Menu sai por cima - ajustar para dentro
        adjustedY = margin
      }

      // Atualizar posição ajustada se necessário
      if (adjustedX !== position.x || adjustedY !== position.y) {
        setAdjustedPosition({ x: adjustedX, y: adjustedY })
      } else {
        setAdjustedPosition(position)
      }
    }

    // Executar ajuste após renderização completa
    requestAnimationFrame(() => {
      requestAnimationFrame(adjustPosition)
    })
  }, [position])

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  // Close menu on Escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [onClose])

  const menuItems = [
    {
      icon: Copy,
      label: "Copiar",
      onClick: () => {
        onCopy?.()
        onClose()
      },
      tooltip: "Copiar mensagem (Ctrl+C)",
    },
    {
      icon: Edit,
      label: "Editar",
      onClick: () => {
        onEdit?.()
        onClose()
      },
      tooltip: "Editar mensagem",
      disabled: false,
    },
    {
      icon: Trash2,
      label: "Excluir",
      onClick: () => {
        onDelete?.()
        onClose()
      },
      tooltip: "Excluir mensagem",
      disabled: false,
      variant: "destructive" as const,
    },
  ]

  return (
    <AnimatePresence>
      <TooltipProvider>
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed z-50 bg-white dark:bg-[#202C33] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[160px]"
          style={{
            left: `${adjustedPosition.x}px`,
            top: `${adjustedPosition.y}px`,
          }}
          role="menu"
          aria-label="Message options"
        >
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <button
                    onClick={item.onClick}
                    disabled={item.disabled}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors",
                      "hover:bg-gray-100 dark:hover:bg-gray-700",
                      item.disabled && "opacity-50 cursor-not-allowed",
                      item.variant === "destructive" &&
                        "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    )}
                    role="menuitem"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </motion.div>
      </TooltipProvider>
    </AnimatePresence>
  )
}
