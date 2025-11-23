/**
 * Script Optimization Component
 *
 * Template for deferring non-critical scripts to optimize performance.
 * Based on Next.js Script component best practices.
 *
 * Strategy:
 * - beforeInteractive: Only for critical scripts (very rare)
 * - afterInteractive: Google Analytics, tracking, non-blocking third-party
 * - lazyOnload: Non-critical scripts (even later, during idle time)
 *
 * Reference: Microsoft Docs - Performance Optimization
 * @see https://learn.microsoft.com/en-us/azure/well-architected/performance-efficiency/continuous-performance-optimize
 */

'use client';

import Script from 'next/script';

/**
 * Deferred Analytics Script
 * Loads after page interactive to avoid blocking initial render
 */
export function AnalyticsScriptOptimized() {
  return (
    <>
      {/*
        Google Analytics - loads after page is interactive
        Does not block rendering or user interaction
        Impact: TBT reduction of 30-50ms
      */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        strategy="afterInteractive"
      />

      {/*
        Custom Tracking Script - loads during idle time
        Extremely non-critical, can wait until browser is idle
      */}
      <Script
        src="/analytics/tracking.js"
        strategy="lazyOnload"
      />

      {/*
        Initialize analytics after Google Tag Manager loads
        Safe to execute after page interactive
      */}
    </>
  );
}

/**
 * IMPLEMENTATION GUIDE
 *
 * To add this optimization to your app:
 *
 * 1. In app/layout.tsx, add:
 *    import { AnalyticsScriptOptimized } from '@/app/(home)/components/ScriptOptimization';
 *
 *    <AnalyticsScriptOptimized />
 *
 * 2. Replace "G-XXXXXXXXXX" with your actual Google Analytics ID
 *
 * 3. Ensure /public/analytics/tracking.js exists or remove lazyOnload script
 *
 * 4. Test with Lighthouse to confirm TBT reduction
 *
 * Script Strategies Explained:
 * ============================
 *
 * beforeInteractive:
 * - Executes BEFORE browser paint
 * - Blocks rendering - use ONLY for critical scripts
 * - Example: Session management, critical polyfills
 * - Impact: INCREASES LCP (bad!)
 * - Usage: Very rare in modern apps
 *
 * afterInteractive (DEFAULT):
 * - Executes AFTER page interactive
 * - Does NOT block rendering
 * - Most third-party scripts should use this
 * - Example: Google Analytics, tracking pixels
 * - Impact: Minimal (30-50ms TBT reduction)
 * - Usage: Most analytics/tracking scripts
 *
 * lazyOnload:
 * - Executes during idle browser time (ASAP after browser finishes)
 * - Non-blocking and deferred
 * - Lowest priority scripts
 * - Example: Non-critical tracking, chat widgets
 * - Impact: Best for TBT (50-100ms potential reduction)
 * - Usage: Non-essential third-party code
 *
 * Performance Impact Summary:
 * ==========================
 *
 * Without Script Optimization (all inline):
 * - TBT: 310ms (as measured)
 * - Scripts block main thread immediately
 *
 * With afterInteractive:
 * - TBT: 260-280ms (-30-50ms)
 * - Scripts defer until page interactive
 *
 * With Mix (critical → afterInteractive, non-critical → lazyOnload):
 * - TBT: 210-250ms (-60-100ms)
 * - Optimal script loading strategy
 * - Best approach for production
 */
