"use client"

import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AnimatePresence, motion } from "framer-motion"
import { Copy, Edit, Keyboard, MessageSquare, Search, Trash2, X } from "lucide-react"
import * as React from "react"

interface HelpModalProps {
  open: boolean
  onClose: () => void
}

interface Shortcut {
  keys: string[]
  description: string
  icon?: React.ComponentType<{ className?: string }>
}

const shortcuts: Shortcut[] = [
  {
    keys: ["Ctrl", "K"],
    description: "Focar na busca",
    icon: Search,
  },
  {
    keys: ["Ctrl", "N"],
    description: "Novo chat",
    icon: MessageSquare,
  },
  {
    keys: ["Esc"],
    description: "Fechar modal/menu",
  },
  {
    keys: ["Ctrl", "/"],
    description: "Mostrar ajuda",
    icon: Keyboard,
  },
  {
    keys: ["Enter"],
    description: "Enviar mensagem",
  },
  {
    keys: ["Shift", "Enter"],
    description: "Nova linha",
  },
]

const messageActions: Shortcut[] = [
  {
    keys: ["Right-click"],
    description: "Abrir menu da mensagem",
  },
  {
    keys: ["Copy"],
    description: "Copiar mensagem",
    icon: Copy,
  },
  {
    keys: ["Edit"],
    description: "Editar mensagem (Em breve)",
    icon: Edit,
  },
  {
    keys: ["Delete"],
    description: "Excluir mensagem (Em breve)",
    icon: Trash2,
  },
]

export function HelpModal({ open, onClose }: HelpModalProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [open, onClose])

  if (!open) return null

  return (
    <AnimatePresence>
      <TooltipProvider>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white dark:bg-[#202C33] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#005cff]/10 flex items-center justify-center">
                  <Keyboard className="h-5 w-5 text-[#005cff]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Atalhos de Teclado e Ajuda
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Aprenda a usar o chat com eficiência
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-9 w-9 rounded-lg"
                aria-label="Close help"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 premium-scrollbar">
              {/* Keyboard Shortcuts */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Atalhos de Teclado
                </h3>
                <div className="grid gap-3">
                  {shortcuts.map((shortcut, index) => {
                    const Icon = shortcut.icon
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-[#111B21] border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center gap-3">
                          {Icon && (
                            <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          )}
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {shortcut.description}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, keyIndex) => (
                            <React.Fragment key={keyIndex}>
                              <kbd className="px-2 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#202C33] border border-gray-300 dark:border-gray-600 rounded shadow-sm">
                                {key}
                              </kbd>
                              {keyIndex < shortcut.keys.length - 1 && (
                                <span className="text-gray-400 mx-1">+</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </section>

              {/* Message Actions */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Ações de Mensagem
                </h3>
                <div className="grid gap-3">
                  {messageActions.map((action, index) => {
                    const Icon = action.icon
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (shortcuts.length + index) * 0.05 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#111B21] border border-gray-200 dark:border-gray-700"
                      >
                        {Icon && (
                          <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        )}
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {action.keys.join(" ")}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {action.description}
                          </p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </section>

              {/* Tips */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Dicas e Truques
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-[#005cff] mt-1">•</span>
                    <span>Passe o mouse sobre as mensagens para ver o botão do menu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#005cff] mt-1">•</span>
                    <span>Clique com o botão direito nas mensagens para abrir o menu de contexto</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#005cff] mt-1">•</span>
                    <span>Use Ctrl+K para buscar chats rapidamente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#6B7B2E] mt-1">•</span>
                    <span>Pressione ESC para fechar qualquer menu ou modal aberto</span>
                  </li>
                </ul>
              </section>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#111B21]">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Pressione <kbd className="px-1.5 py-0.5 text-xs bg-white dark:bg-[#202C33] border border-gray-300 dark:border-gray-600 rounded">Esc</kbd> para fechar
                </p>
                <Button
                  onClick={onClose}
                  className="bg-[#005cff] hover:bg-[#004bd6] text-white"
                >
                  Entendi!
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </TooltipProvider>
    </AnimatePresence>
  )
}
