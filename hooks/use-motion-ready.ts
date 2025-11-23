"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function useMotionReady(delay = 120) {
  const prefersReducedMotion = useReducedMotion();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = window.setTimeout(() => setIsReady(true), delay);
    return () => window.clearTimeout(timeout);
  }, [prefersReducedMotion, delay]);

  return !prefersReducedMotion && isReady;
}
