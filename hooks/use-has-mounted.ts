"use client";

import { useSyncExternalStore } from "react";

/**
 * Hook seguro para hidratação que detecta se o componente está montado no cliente.
 * Usa useSyncExternalStore para evitar o warning react-hooks/set-state-in-effect.
 *
 * @returns true quando o componente está montado no cliente, false durante SSR
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const hasMounted = useHasMounted();
 *
 *   if (!hasMounted) {
 *     return <Skeleton />;
 *   }
 *
 *   return <div>Client-only content</div>;
 * }
 * ```
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );
}

// Noop subscribe - mounted state nunca muda após a montagem inicial
function subscribe(): () => void {
  return () => {};
}

// No cliente, sempre retorna true após a hidratação
function getClientSnapshot(): boolean {
  return true;
}

// No servidor (SSR), sempre retorna false
function getServerSnapshot(): boolean {
  return false;
}
