"use client";

import { useEffect } from "react";
import { PERFORMANCE_CONFIG } from "../../lib/performance";

export function PerformanceMonitor() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) return;

    let lcpObserver: PerformanceObserver | null = null;
    let fidObserver: PerformanceObserver | null = null;
    let clsObserver: PerformanceObserver | null = null;
    let fcpObserver: PerformanceObserver | null = null;
    let resourceObserver: PerformanceObserver | null = null;

    // Core Web Vitals
    lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      const lcp = lastEntry.startTime;
      if (lcp > PERFORMANCE_CONFIG.thresholds.LCP) {
        console.warn(`LCP is ${lcp}ms (threshold: ${PERFORMANCE_CONFIG.thresholds.LCP}ms)`);
      }
    });
    lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

    fidObserver = new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach((entry: any) => {
        const fid = entry.processingStart - entry.startTime;
        if (fid > PERFORMANCE_CONFIG.thresholds.FID) {
          console.warn(`FID is ${fid}ms (threshold: ${PERFORMANCE_CONFIG.thresholds.FID}ms)`);
        }
      });
    });
    fidObserver.observe({ entryTypes: ["first-input"] });

    let clsValue = 0;
    clsObserver = new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) clsValue += entry.value;
      });
      if (clsValue > PERFORMANCE_CONFIG.thresholds.CLS) {
        console.warn(`CLS is ${clsValue} (threshold: ${PERFORMANCE_CONFIG.thresholds.CLS})`);
      }
    });
    clsObserver.observe({ entryTypes: ["layout-shift"] });

    fcpObserver = new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach((entry: any) => {
        const fcp = entry.startTime;
        if (fcp > PERFORMANCE_CONFIG.thresholds.FCP) {
          console.warn(`FCP is ${fcp}ms (threshold: ${PERFORMANCE_CONFIG.thresholds.FCP}ms)`);
        }
      });
    });
    fcpObserver.observe({ entryTypes: ["paint"] });

    // Resource timing
    resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 1000) {
          console.warn(`Slow resource: ${entry.name} took ${entry.duration}ms`);
        }
      });
    });
    resourceObserver.observe({ entryTypes: ["resource"] });

    // Bundle size check
    const monitorBundleSize = () => {
      const scripts = document.querySelectorAll('script[src]');
      scripts.forEach((script) => {
        const src = script.getAttribute('src');
        if (src && src.includes('_next/static')) {
          fetch(src, { method: 'HEAD' })
            .then((res) => {
              const size = res.headers.get('content-length');
              if (size && parseInt(size) > PERFORMANCE_CONFIG.budgets.js) {
                console.warn(`Large JS bundle: ${src} is ${size} bytes`);
              }
            })
            .catch(() => {});
        }
      });
    };
    setTimeout(monitorBundleSize, 2000);

    // Navigation & performance report
    const reportPerformance = () => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const data = {
        ttfb: nav.responseStart - nav.startTime,
        domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
        loadComplete: nav.loadEventEnd - nav.startTime,
        resourceCount: performance.getEntriesByType('resource').length,
        memory: (performance as any).memory
          ? {
              used: (performance as any).memory.usedJSHeapSize,
              total: (performance as any).memory.totalJSHeapSize,
              limit: (performance as any).memory.jsHeapSizeLimit,
            }
          : null,
      };
      console.log('Performance Report:', data);
    };
    window.addEventListener('load', () => setTimeout(reportPerformance, 1000));

    // Cleanup observers on unmount
    return () => {
      lcpObserver?.disconnect();
      fidObserver?.disconnect();
      clsObserver?.disconnect();
      fcpObserver?.disconnect();
      resourceObserver?.disconnect();
    };
  }, []);

  return null;
}
