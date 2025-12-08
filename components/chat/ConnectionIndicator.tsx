"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { AlertCircle, Wifi, WifiOff } from "lucide-react"

export type ConnectionStatus = "connected" | "disconnected" | "reconnecting" | "error"

interface ConnectionIndicatorProps {
  status: ConnectionStatus
  onRetry?: () => void
  className?: string
}

export function ConnectionIndicator({
  status,
  onRetry,
  className,
}: ConnectionIndicatorProps) {
  const statusConfig = {
    connected: {
      icon: Wifi,
      label: "Conectado",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      pulse: false,
    },
    disconnected: {
      icon: WifiOff,
      label: "Desconectado",
      color: "text-gray-600 dark:text-gray-400",
      bgColor: "bg-gray-100 dark:bg-gray-800",
      pulse: false,
    },
    reconnecting: {
      icon: Wifi,
      label: "Reconectando...",
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
      pulse: true,
    },
    error: {
      icon: AlertCircle,
      label: "Erro de Conexão",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/20",
      pulse: false,
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
              config.bgColor,
              config.color,
              className
            )}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <motion.div
              animate={config.pulse ? { scale: [1, 1.2, 1] } : {}}
              transition={{
                duration: 1.5,
                repeat: config.pulse ? Infinity : 0,
                ease: "easeInOut",
              }}
            >
              <Icon className="h-3.5 w-3.5" />
            </motion.div>
            <span className="hidden sm:inline">{config.label}</span>
            {status === "error" && onRetry && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRetry()
                }}
                className="ml-2 underline hover:no-underline"
                aria-label="Tentar reconectar"
              >
                Tentar Novamente
              </button>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {status === "connected" && "WebSocket conectado"}
            {status === "disconnected" && "WebSocket desconectado. As mensagens podem não sincronizar."}
            {status === "reconnecting" && "Tentando reconectar..."}
            {status === "error" && "Erro de conexão. Clique para tentar novamente."}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
