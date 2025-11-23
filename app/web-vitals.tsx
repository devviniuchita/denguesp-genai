'use client'

import { useReportWebVitals } from 'next/web-vitals'

/**
 * Web Vitals Reporter
 *
 * This component tracks and reports Core Web Vitals metrics:
 * - Largest Contentful Paint (LCP)
 * - First Input Delay / Total Blocking Time (FID/TBT)
 * - Cumulative Layout Shift (CLS)
 * - First Contentful Paint (FCP)
 * - Time to First Byte (TTFB)
 * - Interaction to Next Paint (INP)
 *
 * In development: logs to console
 * In production: can be sent to analytics service
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log to console in development for debugging
    if (process.env.NODE_ENV === 'development') {
      // Format metric for readable console output
      const metricData = {
        name: metric.name,
        value: metric.value.toFixed(2),
        unit: metric.name === 'CLS' ? 'unitless' : metric.name === 'LCP' || metric.name === 'FCP' || metric.name === 'TTFB' ? 'ms' : 'ms',
        rating: metric.rating || 'N/A',
        delta: metric.delta ? metric.delta.toFixed(2) : 'N/A',
        id: metric.id,
      }

      console.log('📊 Web Vitals:', metricData)
    }

    // TODO: Send to analytics service (e.g., Google Analytics, Datadog, etc.)
    // Example:
    // if (typeof window !== 'undefined' && window.gtag) {
    //   window.gtag('event', metric.name, {
    //     value: Math.round(metric.value),
    //     event_category: 'web_vitals',
    //     event_label: metric.id,
    //     non_interaction: true,
    //   })
    // }
  })

  return null
}
