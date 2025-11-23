"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface BlurFadeProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  direction?: "up" | "down" | "left" | "right"
  className?: string
}

const directionMap = {
  up: { y: 20, x: 0 },
  down: { y: -20, x: 0 },
  left: { x: 20, y: 0 },
  right: { x: -20, y: 0 },
}

export function BlurFade({
  children,
  delay = 0,
  duration = 0.5,
  direction = "up",
  className,
}: BlurFadeProps) {
  const [isMounted, setIsMounted] = React.useState(false)
  const offset = directionMap[direction]

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  // On server, render without animation to avoid hydration mismatch
  if (!isMounted) {
    return <div className={cn(className)}>{children}</div>
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        filter: "blur(10px)",
        ...offset,
      }}
      animate={{
        opacity: 1,
        filter: "blur(0px)",
        x: 0,
        y: 0,
      }}
      transition={{
        duration,
        delay,
        ease: [0.21, 1.11, 0.81, 0.99],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
