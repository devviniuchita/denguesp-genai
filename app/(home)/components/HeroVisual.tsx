"use client";

import { LazyMotionProvider } from "@/components/animations/LazyMotionProvider";
import { useMotionReady } from "@/hooks/use-motion-ready";
import { m, type MotionProps } from "framer-motion";
import NextImage from "next/image";

const initialIfReady = (
  shouldAnimate: boolean,
  value: MotionProps["initial"]
) => (shouldAnimate ? value : false);

const animateIfReady = (
  shouldAnimate: boolean,
  value: MotionProps["animate"]
) => (shouldAnimate ? value : {});

const transitionIfReady = (
  shouldAnimate: boolean,
  value: MotionProps["transition"]
) => (shouldAnimate ? value : undefined);

export function HeroVisual() {
  // Optimize LCP: defer animations until page is interactive
  // useMotionReady(200) already defers animations, but we can add requestIdleCallback
  // for even better performance on slower devices
  const shouldAnimate = useMotionReady(100); // Reduced from 200ms for faster visual

  return (
    <LazyMotionProvider>
      <m.div
        initial={initialIfReady(shouldAnimate, {
          opacity: 0,
          scale: 0.95,
        })}
        animate={animateIfReady(shouldAnimate, {
          opacity: 1,
          scale: 1,
        })}
        transition={transitionIfReady(shouldAnimate, {
          duration: 0.7,
          ease: "easeOut",
        })}
        className="relative w-full max-w-[500px] aspect-square lg:aspect-[4/5] mx-auto"
    >
      {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

      {/* Chat Mockup */}
        <div className="relative h-full w-full bg-background border rounded-2xl shadow-2xl overflow-hidden flex flex-col glass-panel">
        {/* Header */}
          <div className="p-4 border-b flex items-center gap-3 bg-muted/50">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <div className="ml-4 flex items-center gap-2">
              <div className="relative h-4 w-4 rounded-full overflow-hidden dark:ring-1 dark:ring-primary/50">
                <NextImage
                  src="/assets/branding/denguegen-icon.png"
                  alt="Logo"
                  width={16}
                  height={16}
                  className="object-contain"
                />
              </div>
              <div className="text-xs font-medium text-muted-foreground">
                DengueSP-GenAI
              </div>
            </div>
        </div>

        {/* Chat Area */}
          <div className="flex-1 p-6 space-y-6 overflow-hidden relative chat-background">
          {/* Message 1 (User) */}
            <m.div
              initial={initialIfReady(shouldAnimate, { opacity: 0, y: 10 })}
              animate={animateIfReady(shouldAnimate, { opacity: 1, y: 0 })}
              transition={transitionIfReady(shouldAnimate, { delay: 0.5 })}
              className="flex justify-end"
          >
              <div className="bg-primary text-primary-foreground px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%] text-sm shadow-sm">
              Quais são os principais sintomas da dengue?
            </div>
            </m.div>

          {/* Message 2 (AI) */}
            <m.div
              initial={initialIfReady(shouldAnimate, { opacity: 0, y: 10 })}
              animate={animateIfReady(shouldAnimate, { opacity: 1, y: 0 })}
              transition={transitionIfReady(shouldAnimate, { delay: 1.2 })}
              className="flex justify-start"
          >
              <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] text-sm shadow-sm space-y-2">
              <p>Os sintomas mais comuns incluem:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Febre alta (acima de 38°C)</li>
                <li>Dor no corpo e articulações</li>
                <li>Dor atrás dos olhos</li>
                <li>Manchas vermelhas no corpo</li>
              </ul>
            </div>
            </m.div>

          {/* Typing Indicator */}
            <m.div
              initial={initialIfReady(shouldAnimate, { opacity: 0 })}
              animate={animateIfReady(shouldAnimate, { opacity: 1 })}
              transition={transitionIfReady(shouldAnimate, { delay: 2.5 })}
              className="flex justify-start"
          >
              <div className="bg-muted px-4 py-2 rounded-2xl rounded-tl-sm text-sm flex gap-1 items-center">
              <span
                  className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
              />
              <span
                  className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
              />
              <span
                  className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
              />
            </div>
            </m.div>
        </div>

        {/* Input Area */}
          <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
            <div className="h-10 bg-muted rounded-full w-full animate-pulse opacity-50" />
        </div>
      </div>

      {/* Floating Card */}
        <m.div
          initial={initialIfReady(shouldAnimate, { opacity: 0, x: 20 })}
          animate={animateIfReady(shouldAnimate, { opacity: 1, x: 0 })}
          transition={transitionIfReady(shouldAnimate, { delay: 1.5 })}
          className="absolute -bottom-6 -right-6 bg-card p-4 rounded-xl shadow-xl border max-w-[200px] float-animation"
      >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
            >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            </div>
            <div className="text-xs font-semibold">100% Seguro</div>
          </div>
          <p className="text-[10px] text-muted-foreground">
          Informações baseadas em protocolos oficiais de saúde.
        </p>
        </m.div>
      </m.div>
    </LazyMotionProvider>
  );
}
