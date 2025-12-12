"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/contexts/AuthContext"
import { Chat } from "@/types/chat"
import { motion } from "framer-motion"
import { ArrowLeft, Home, LogOut, MoreVertical, PanelLeft, Phone, Search, Settings, User, Video } from "lucide-react"
import { useRouter } from "next/navigation"
import { ConnectionIndicator, ConnectionStatus } from "./ConnectionIndicator"

interface ChatHeaderProps {
  readonly chat: Chat
  readonly onBack?: () => void
  readonly connectionStatus?: ConnectionStatus
  readonly onRetryConnection?: () => void
  readonly onToggleSidebar?: () => void
}

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.1,
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  }),
}

export function ChatHeader({
  chat,
  onBack,
  connectionStatus = "connected",
  onRetryConnection,
  onToggleSidebar,
}: ChatHeaderProps) {
  const { logout } = useAuth()
  const router = useRouter()

  const handleAlterarPerfil = async () => {
    await logout()
    router.push("/auth/login")
  }

  const handleConfiguracoes = () => {
    // Por enquanto sem função conforme solicitado
    console.log("Configurações - funcionalidade em desenvolvimento")
  }

  const handleSair = async () => {
    await logout()
    router.push("/")
  }

  const handleVoltarHome = () => {
    router.push("/")
  }
  return (
    <TooltipProvider>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="h-16 bg-white/80 dark:bg-[#202C33]/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between px-4 shadow-sm"
        role="banner"
      >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Toggle Sidebar Button - Desktop */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex h-8 w-8 rounded-md text-gray-500 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex-shrink-0 opacity-70 hover:opacity-100"
              onClick={onToggleSidebar}
              aria-label="Alternar barra lateral"
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Expandir/Recolher chats</p>
          </TooltipContent>
        </Tooltip>

        {/* Home Button - Only visible on desktop */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex h-8 w-8 rounded-md text-gray-500 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex-shrink-0 opacity-70 hover:opacity-100"
              onClick={handleVoltarHome}
              aria-label="Voltar para página inicial"
            >
              <Home className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voltar para página inicial</p>
          </TooltipContent>
        </Tooltip>

        {/* Back Button - Only visible on mobile */}
        {onBack && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-11 w-11 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0 touch-target"
                onClick={onBack}
                aria-label="Back to chats"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Voltar para chats</p>
            </TooltipContent>
          </Tooltip>
        )}

        <Avatar className="h-10 w-10 ring-2 ring-[#005cff]/30">
               <AvatarImage src={chat.avatar} alt={chat.name} />
               <AvatarFallback className="bg-[#005cff] text-white font-bold text-lg">
                 {chat.name.charAt(0).toUpperCase()}
               </AvatarFallback>
             </Avatar>

        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-gray-900 dark:text-white truncate">
            {chat.name}
          </h2>
          <div className="flex items-center gap-2">
            {chat.isOnline && (
              <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Online</span>
              </span>
            )}
            {chat.isTyping && (
              <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                digitando...
              </span>
            )}
          </div>
          {/* Connection Status */}
          {connectionStatus !== "connected" && (
            <div className="mt-1">
              <ConnectionIndicator
                status={connectionStatus}
                onRetry={onRetryConnection}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        {[
          { icon: Video, label: "Chamada de vídeo", description: "Iniciar chamada de vídeo (Em breve)" },
          { icon: Phone, label: "Chamada de voz", description: "Iniciar chamada de voz (Em breve)" },
          { icon: Search, label: "Buscar no chat", description: "Buscar mensagens (Em breve)" },
        ].map(({ icon: Icon, label, description }, index) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <motion.div
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                custom={index}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-[#005cff]/10 hover:text-[#005cff] transition-colors touch-target"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              custom={3}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-[#005cff]/10 hover:text-[#005cff] transition-colors touch-target"
                    aria-label="Mais opções"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Menu</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleAlterarPerfil} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Alterar Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleConfiguracoes} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSair}
                    className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 focus:dark:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Mais opções</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </motion.header>
    </TooltipProvider>
  )
}
