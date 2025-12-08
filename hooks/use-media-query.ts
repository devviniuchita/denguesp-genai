"use client"

import { useSyncExternalStore } from "react"

/**
 * Hook para detectar media queries de forma segura para hidratação.
 * Usa useSyncExternalStore para evitar mismatches SSR/cliente.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      const media = globalThis.matchMedia(query)
      media.addEventListener("change", callback)
      return () => media.removeEventListener("change", callback)
    },
    () => globalThis.matchMedia(query).matches,
    () => false // SSR sempre retorna false
  )
}

export function useIsMobile() {
  return useMediaQuery("(max-width: 768px)")
}

export function useIsTablet() {
  return useMediaQuery("(min-width: 769px) and (max-width: 1024px)")
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 1025px)")
}
