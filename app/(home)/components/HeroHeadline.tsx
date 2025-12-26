"use client";

import { LazyMotionProvider } from "@/components/animations/LazyMotionProvider";
import { Button } from "@/components/ui/button";
import { useMotionReady } from "@/hooks/use-motion-ready";
import { m, type MotionProps } from "framer-motion";
import Link from "next/link";
import { InitiateChatButton } from "./InitiateChatButton";

const initialIfReady = (
  shouldAnimate: boolean,
  value: MotionProps["initial"],
) => (shouldAnimate ? value : false);

const animateIfReady = (
  shouldAnimate: boolean,
  value: MotionProps["animate"],
) => (shouldAnimate ? value : {});

const transitionIfReady = (
  shouldAnimate: boolean,
  value: MotionProps["transition"],
) => (shouldAnimate ? value : undefined);

export function HeroHeadline() {
  const shouldAnimate = useMotionReady(150);

  return (
    <LazyMotionProvider>
      <div className="flex flex-col items-start gap-6 max-w-2xl">
        <m.h1
          initial={initialIfReady(shouldAnimate, { opacity: 0, y: 24 })}
          animate={animateIfReady(shouldAnimate, { opacity: 1, y: 0 })}
          transition={transitionIfReady(shouldAnimate, {
            duration: 0.5,
            delay: 0.1,
          })}
          className="text-4xl md:text-6xl font-extrabold tracking-tight lg:text-7xl"
        >
          Assistente especializado em{" "}
          <span className="text-white bg-gradient-to-r from-[#005cff] to-[#0036b3] animated-gradient px-3 py-1 rounded-md">
            dengue
          </span>{" "}
          para São Paulo
        </m.h1>

        <m.p
          initial={initialIfReady(shouldAnimate, { opacity: 0, y: 24 })}
          animate={animateIfReady(shouldAnimate, { opacity: 1, y: 0 })}
          transition={transitionIfReady(shouldAnimate, {
            duration: 0.5,
            delay: 0.2,
          })}
          className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg"
        >
          Tire suas dúvidas sobre prevenção, sintomas e cuidados com a dengue.
          Informação rápida, confiável e acessível para todos.
        </m.p>

        <m.div
          initial={initialIfReady(shouldAnimate, { opacity: 0, y: 24 })}
          animate={animateIfReady(shouldAnimate, { opacity: 1, y: 0 })}
          transition={transitionIfReady(shouldAnimate, {
            duration: 0.5,
            delay: 0.3,
          })}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <InitiateChatButton />
          <Link href="/como-funciona" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-base h-12 px-8"
            >
              Saiba mais
            </Button>
          </Link>
        </m.div>

        <m.div
          initial={initialIfReady(shouldAnimate, { opacity: 0 })}
          animate={animateIfReady(shouldAnimate, { opacity: 1 })}
          transition={transitionIfReady(shouldAnimate, {
            duration: 0.5,
            delay: 0.4,
          })}
          className="flex items-center gap-4 text-sm text-muted-foreground mt-4"
        >
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => {
                const colors = {
                  1: "bg-red-500",
                  2: "bg-yellow-500",
                  3: "bg-green-500"
                };
                return (
                  <m.div
                    key={i}
                    initial={initialIfReady(shouldAnimate, {
                      opacity: 0,
                      scale: 0.5,
                      y: 10
                    })}
                    animate={animateIfReady(shouldAnimate, {
                      opacity: 1,
                      scale: 1,
                      y: [0, -8, 0],
                      rotate: [0, 5, -5, 0]
                    })}
                    transition={transitionIfReady(shouldAnimate, {
                      duration: 0.6,
                      delay: 0.8 + (i * 0.2),
                      y: {
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: i * 0.3
                      },
                      rotate: {
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: i * 0.2
                      }
                    })}
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${colors[i as keyof typeof colors]}`}
                    style={{
                      animationDelay: `${i * 0.3}s`
                    }}
                  >
                    {String.fromCodePoint(64 + i)}
                  </m.div>
                );
              })}
            </div>
          <p>Junte-se a milhares de cidadãos informados</p>
        </m.div>
      </div>
    </LazyMotionProvider>
  );
}
