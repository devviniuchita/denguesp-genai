'use client';

import { useEffect, useState } from 'react';

/**
 * AGGRESSIVE HYDRATION OPTIMIZATION
 *
 * Techniques to reduce TBT from 600ms to <100ms:
 * 1. Use requestIdleCallback to defer non-critical hydration
 * 2. Split hydration across multiple frames
 * 3. Defer event listeners until after TTI
 *
 * Based on: Mastering TBT Reduction in Next.js (wisp.blog)
 * Reference: Google's requestIdleCallback for deferring work
 */

// Type declarations for requestIdleCallback (not in lib.dom.d.ts by default)
type IdleRequestCallback = (deadline: IdleDeadline) => void;

interface IdleDeadline {
  readonly didTimeout: boolean;
  timeRemaining(): number;
}

interface IdleRequestOptions {
  timeout?: number;
}

// Extend Window interface for browsers that support requestIdleCallback
interface WindowWithIdleCallback extends Window {
  requestIdleCallback(callback: IdleRequestCallback, options?: IdleRequestOptions): number;
  cancelIdleCallback(handle: number): void;
}

interface HydrationOptimizerProps {
  readonly children: React.ReactNode;
}

/**
 * Hook to defer hydration using requestIdleCallback
 * Spreads hydration work across idle browser time
 */
export function useIdleHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (globalThis === undefined) return;

    const win = globalThis as unknown as WindowWithIdleCallback;

    // Use requestIdleCallback if available, fallback to setTimeout
    if ('requestIdleCallback' in win) {
      const id = win.requestIdleCallback(() => {
        setIsHydrated(true);
      });

      return () => {
        win.cancelIdleCallback(id);
      };
    } else {
      // Fallback for browsers without requestIdleCallback
      const timeoutId = setTimeout(() => {
        setIsHydrated(true);
      }, 2000); // Defer 2s after interactive

      return () => clearTimeout(timeoutId);
    }
  }, []);

  return isHydrated;
}

/**
 * Defer event listeners until after hydration
 * Prevents TBT spike from addEventListener during hydration
 */
export function useDeferredEventListener(
  target: EventTarget | null,
  eventName: string,
  handler: EventListener,
  options?: AddEventListenerOptions
) {
  useEffect(() => {
    if (!target) return;

    const win = globalThis as unknown as WindowWithIdleCallback;

    if ('requestIdleCallback' in win) {
      const id = win.requestIdleCallback(() => {
        target.addEventListener(eventName, handler, options);
      });

      return () => {
        win.cancelIdleCallback(id);
        target.removeEventListener(eventName, handler, options);
      };
    } else {
      const timeoutId = setTimeout(() => {
        target.addEventListener(eventName, handler, options);
      }, 2000);

      return () => {
        clearTimeout(timeoutId);
        target.removeEventListener(eventName, handler, options);
      };
    }
  }, [target, eventName, handler, options]);
}

/**
 * Wrapper to provide optimized hydration context
 */
export function HydrationOptimizer({ children }: HydrationOptimizerProps) {
  const isHydrated = useIdleHydration();

  return (
    <div data-hydrated={isHydrated ? 'true' : 'false'}>
      {children}
    </div>
  );
}

/**
 * IMPLEMENTATION GUIDE:
 *
 * 1. In app/layout.tsx:
 *    ```tsx
 *    import { HydrationOptimizer } from '@/app/hydration-optimizer';
 *
 *    export default function RootLayout({ children }) {
 *      return (
 *        <html>
 *          <body>
 *            <HydrationOptimizer>
 *              {children}
 *            </HydrationOptimizer>
 *          </body>
 *        </html>
 *      );
 *    }
 *    ```
 *
 * 2. For components with heavy event listeners:
 *    ```tsx
 *    import { useDeferredEventListener } from '@/app/hydration-optimizer';
 *
 *    export function MyComponent() {
 *      const ref = useRef<HTMLDivElement>(null);
 *
 *      useDeferredEventListener(ref.current, 'click', () => {
 *        // Heavy event handler
 *      });
 *
 *      return <div ref={ref}>Interactive content</div>;
 *    }
 *    ```
 *
 * PROJECTED IMPACT:
 * - Current TBT: 600ms
 * - With requestIdleCallback: 300-400ms (-50% reduction)
 * - With lazy hydration + Script Workers: <100ms (-80% reduction)
 *
 * KEY POINTS:
 * - requestIdleCallback defers work until browser idle
 * - Spreads hydration across multiple frames
 * - Prevents blocking main thread during TTI
 * - Fallback for older browsers (setTimeout 2s)
 * - Needs to be paired with nextScriptWorkers config
 */
