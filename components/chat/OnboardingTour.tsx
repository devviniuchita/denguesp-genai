"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react"
import * as React from "react"

interface TourStep {
  id: string
  title: string
  description: string
  target?: string // CSS selector
  position?: "top" | "bottom" | "left" | "right"
}

const tourSteps: TourStep[] = [
  {
    id: "search",
    title: "Buscar Chats",
    description: "Use a barra de busca para encontrar conversas rapidamente. Pressione Ctrl+K para focar aqui.",
    target: 'input[type="search"]',
    position: "bottom",
  },
  {
    id: "chat-list",
    title: "Lista de Chats",
    description: "Navegue por todas as suas conversas aqui. Clique em qualquer chat para abri-lo.",
    target: '[data-radix-scroll-area-viewport]',
    position: "right",
  },
  {
    id: "message-input",
    title: "Enviar Mensagens",
    description: "Digite sua mensagem aqui. Pressione Enter para enviar, Shift+Enter para uma nova linha.",
    target: 'textarea[aria-label="Message input"]',
    position: "top",
  },
  {
    id: "message-actions",
    title: "Opções de Mensagem",
    description: "Passe o mouse sobre as mensagens ou clique com o botão direito para acessar opções como copiar, editar ou excluir.",
    position: "top",
  },
]

interface OnboardingTourProps {
  readonly onComplete: () => void
}

export function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [isVisible, setIsVisible] = React.useState(true)
  const step = tourSteps[currentStep]

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleComplete = () => {
    setIsVisible(false)
    setTimeout(() => {
      onComplete()
    }, 300)
  }

  const getTargetElement = React.useCallback(() => {
    if (!step.target) return null
    return document.querySelector(step.target) as HTMLElement
  }, [step.target])

  React.useEffect(() => {
    if (!isVisible) return

    const element = getTargetElement()
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })

      // Highlight element
      const originalOutline = element.style.outline
      element.style.outline = "2px solid #005cff"
      element.style.outlineOffset = "4px"

      return () => {
        element.style.outline = originalOutline
        element.style.outlineOffset = ""
      }
    }
  }, [currentStep, isVisible, getTargetElement])

  if (!isVisible) return null

  const element = getTargetElement()
  const rect = element?.getBoundingClientRect()
  const position = step.position || "top"

  const getPositionStyles = () => {
    if (!rect) return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }

    const offset = 20
    switch (position) {
      case "top":
        return {
          top: `${rect.top - offset}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: "translate(-50%, -100%)",
        }
      case "bottom":
        return {
          top: `${rect.bottom + offset}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: "translateX(-50%)",
        }
      case "left":
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.left - offset}px`,
          transform: "translate(-100%, -50%)",
        }
      case "right":
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.right + offset}px`,
          transform: "translateY(-50%)",
        }
      default:
        return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
    }
  }

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
        onClick={handleSkip}
      />

      {/* Tooltip */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed z-[101] w-80"
        style={getPositionStyles()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white dark:bg-[#202C33] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
          {/* Progress */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#005cff]">
              Passo {currentStep + 1} de {tourSteps.length}
            </span>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Skip tour"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
            <motion.div
              className="h-full bg-[#005cff] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Content */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {step.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {step.description}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="text-xs"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Anterior
            </Button>
            <div className="flex gap-2">
              {currentStep < tourSteps.length - 1 ? (
              <Button
                onClick={handleNext}
                size="sm"
                className="bg-[#005cff] hover:bg-[#004bd6] text-white text-xs"
                >
                  Próximo
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  size="sm"
                  className="bg-[#005cff] hover:bg-[#004bd6] text-white text-xs"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Começar
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Arrow */}
        {rect && (
          <div
            className={cn(
              "absolute w-0 h-0 border-8",
              position === "top" && "bottom-0 left-1/2 -translate-x-1/2 border-t-white dark:border-t-[#202C33] border-b-transparent border-l-transparent border-r-transparent",
              position === "bottom" && "top-0 left-1/2 -translate-x-1/2 border-b-white dark:border-b-[#202C33] border-t-transparent border-l-transparent border-r-transparent",
              position === "left" && "right-0 top-1/2 -translate-y-1/2 border-l-white dark:border-l-[#202C33] border-r-transparent border-t-transparent border-b-transparent",
              position === "right" && "left-0 top-1/2 -translate-y-1/2 border-r-white dark:border-r-[#202C33] border-l-transparent border-t-transparent border-b-transparent"
            )}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
