'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function PerformanceMonitor() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const reportWebVitals = (metric: any) => {
      // Log Core Web Vitals
      if (process.env.NODE_ENV === 'development') {
        console.log(metric);
      }

      // You can send these metrics to your analytics service
      if (metric.name === 'FCP') {
        // First Contentful Paint
      }
      if (metric.name === 'LCP') {
        // Largest Contentful Paint
      }
      if (metric.name === 'CLS') {
        // Cumulative Layout Shift
      }
      if (metric.name === 'FID') {
        // First Input Delay
      }
      if (metric.name === 'TTFB') {
        // Time to First Byte
      }
      if (metric.name === 'Next.js-hydration') {
        // Time to hydrate
      }
      if (metric.name === 'Next.js-route-change-to-render') {
        // Time to render after route change
      }
      if (metric.name === 'Next.js-render') {
        // Time to render page
      }
    };

    // Start performance measurement
    const canUsePerformanceAPI = 
      typeof window !== 'undefined' && 
      typeof window.performance !== 'undefined' &&
      typeof window.performance.mark === 'function' &&
      typeof window.performance.measure === 'function';

    if (canUsePerformanceAPI) {
      try {
        performance.mark('monitor-start');
      } catch (error) {
        console.error('Performance marking error:', error);
      }
    }

    return () => {
      if (canUsePerformanceAPI) {
        try {
          performance.mark('monitor-end');
          performance.measure('monitor-duration', 'monitor-start', 'monitor-end');
          
          // Get the measure and log it
          const measures = performance.getEntriesByName('monitor-duration');
          if (measures.length > 0) {
            const duration = measures[0].duration;
            if (process.env.NODE_ENV === 'development') {
              console.log(`Page render duration: ${duration}ms`);
            }
          }
        } catch (error) {
          console.error('Performance measurement error:', error);
        }
      }
    };
  }, [pathname, searchParams]);

  return null;
} 