"use client";

import { useEffect, useRef } from "react";
import { PERFORMANCE_CONFIG } from "../../lib/performance";

// Type definitions for Performance API
interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
  sources: Array<{
    node: Node;
    previousRect: DOMRectReadOnly;
    currentRect: DOMRectReadOnly;
  }>;
}

interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
  cancelable?: boolean;
}

interface PerformanceMetrics {
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
  ttfb: number;
}

export function PerformanceMonitor() {
  const observersRef = useRef<PerformanceObserver[]>([]);
  const clsValueRef = useRef(0);
  const reportedRef = useRef(false);

  useEffect(() => {
    // Early returns for optimization
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined" || !("PerformanceObserver" in window))
      return;

    // Debounced reporting function
    const debouncedReport = (() => {
      let timeoutId: NodeJS.Timeout;
      return (metrics: Partial<PerformanceMetrics>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (!reportedRef.current) {
            console.log("Performance Metrics:", metrics);
            reportedRef.current = true;
          }
        }, 1000);
      };
    })();

    // Single PerformanceObserver for multiple entry types
    const createPerformanceObserver = (
      entryTypes: string[],
      callback: (entries: PerformanceEntry[]) => void
    ) => {
      try {
        const observer = new PerformanceObserver((entryList) => {
          callback(entryList.getEntries());
        });

        observer.observe({ entryTypes });
        observersRef.current.push(observer);
        return observer;
      } catch (error) {
        console.warn("PerformanceObserver failed:", error);
        return null;
      }
    };

    // Combined observer for Core Web Vitals
    const coreVitalsObserver = createPerformanceObserver(
      ["largest-contentful-paint", "first-input", "layout-shift", "paint"],
      (entries) => {
        entries.forEach((entry) => {
          switch (entry.entryType) {
            case "largest-contentful-paint":
              const lcp = entry.startTime;
              if (lcp > PERFORMANCE_CONFIG.thresholds.LCP) {
                console.warn(
                  `LCP: ${lcp}ms (threshold: ${PERFORMANCE_CONFIG.thresholds.LCP}ms)`
                );
              }
              break;

            case "first-input":
              const fidEntry = entry as PerformanceEventTiming;
              const fid = fidEntry.processingStart - fidEntry.startTime;
              if (fid > PERFORMANCE_CONFIG.thresholds.FID) {
                console.warn(
                  `FID: ${fid}ms (threshold: ${PERFORMANCE_CONFIG.thresholds.FID}ms)`
                );
              }
              break;

            case "layout-shift":
              const layoutShiftEntry = entry as LayoutShiftEntry;
              if (!layoutShiftEntry.hadRecentInput) {
                clsValueRef.current += layoutShiftEntry.value;
                if (clsValueRef.current > PERFORMANCE_CONFIG.thresholds.CLS) {
                  console.warn(
                    `CLS: ${clsValueRef.current} (threshold: ${PERFORMANCE_CONFIG.thresholds.CLS})`
                  );
                }
              }
              break;

            case "paint":
              if (entry.name === "first-contentful-paint") {
                const fcp = entry.startTime;
                if (fcp > PERFORMANCE_CONFIG.thresholds.FCP) {
                  console.warn(
                    `FCP: ${fcp}ms (threshold: ${PERFORMANCE_CONFIG.thresholds.FCP}ms)`
                  );
                }
              }
              break;
          }
        });
      }
    );

    // Optimized resource monitoring with sampling
    const resourceObserver = createPerformanceObserver(
      ["resource"],
      (entries) => {
        // Sample every 3rd resource to reduce overhead
        entries.forEach((entry, index) => {
          if (index % 3 === 0 && entry.duration > 2000) {
            console.warn(
              `Slow resource (sampled): ${entry.name} took ${entry.duration}ms`
            );
          }
        });
      }
    );

    // Optimized bundle size check with caching
    const checkedBundles = new Set<string>();
    const monitorBundleSize = () => {
      const scripts = document.querySelectorAll("script[src]");
      scripts.forEach((script) => {
        const src = script.getAttribute("src");
        if (src && src.includes("_next/static") && !checkedBundles.has(src)) {
          checkedBundles.add(src);

          // Use beacon API for better performance
          if (navigator.sendBeacon) {
            const data = new FormData();
            data.append("url", src);
            data.append("type", "bundle_check");
            navigator.sendBeacon("/api/analytics", data);
          }
        }
      });
    };

    // Delayed monitoring to avoid blocking main thread
    const delayedMonitor = setTimeout(monitorBundleSize, 3000);

    // Optimized navigation timing with single measurement
    const measureNavigationTiming = () => {
      const navEntries = performance.getEntriesByType("navigation");
      if (navEntries.length === 0) return;

      const nav = navEntries[0] as PerformanceNavigationTiming;
      const metrics = {
        ttfb: nav.responseStart - nav.requestStart,
        domContentLoaded: nav.domContentLoadedEventEnd - nav.requestStart,
        loadComplete: nav.loadEventEnd - nav.requestStart,
        resourceCount: performance.getEntriesByType("resource").length,
      };

      debouncedReport(metrics);
    };

    // Use requestIdleCallback for non-urgent tasks
    const scheduleIdleTask = (callback: () => void) => {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(callback, { timeout: 5000 });
      } else {
        setTimeout(callback, 2000);
      }
    };

    // Memory monitoring (only if available and in idle time)
    const monitorMemory = () => {
      const performanceMemory = (performance as any).memory;
      if (performanceMemory) {
        const usedMB = Math.round(performanceMemory.usedJSHeapSize / 1048576);
        const totalMB = Math.round(performanceMemory.totalJSHeapSize / 1048576);

        if (usedMB > 100) {
          console.warn(`High memory usage: ${usedMB}MB / ${totalMB}MB`);
        }
      }
    };

    // Event listeners with passive options
    const handleLoad = () => {
      setTimeout(measureNavigationTiming, 500);
      scheduleIdleTask(monitorMemory);
    };

    window.addEventListener("load", handleLoad, { passive: true });

    // Cleanup function
    return () => {
      clearTimeout(delayedMonitor);
      window.removeEventListener("load", handleLoad);
      observersRef.current.forEach((observer) => {
        try {
          observer.disconnect();
        } catch (error) {
          // Silent cleanup
        }
      });
      observersRef.current = [];
    };
  }, []);

  return null;
}

// Lightweight version for production
export function LightweightPerformanceMonitor() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined") return;

    let observer: PerformanceObserver | null = null;

    try {
      observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          const lcp = lastEntry.startTime;
          if (lcp > PERFORMANCE_CONFIG.thresholds.LCP) {
            // Send to analytics instead of console in production
            if (navigator.sendBeacon) {
              const data = new FormData();
              data.append("lcp", lcp.toString());
              data.append(
                "threshold",
                PERFORMANCE_CONFIG.thresholds.LCP.toString()
              );
              navigator.sendBeacon("/api/performance", data);
            }
          }
        }
      });

      observer.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch (error) {
      // Silent fail for unsupported browsers
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return null;
}

// Utility function to get current CLS value
export const getCurrentCLS = (): number => {
  if (typeof window === "undefined") return 0;

  let cls = 0;
  try {
    const layoutShiftEntries = performance.getEntriesByType("layout-shift");
    layoutShiftEntries.forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        cls += entry.value;
      }
    });
  } catch (error) {
    // Silent fail
  }
  return cls;
};

// Utility function to get LCP value
export const getCurrentLCP = (): number => {
  if (typeof window === "undefined") return 0;

  try {
    const lcpEntries = performance.getEntriesByType("largest-contentful-paint");
    return lcpEntries.length > 0
      ? lcpEntries[lcpEntries.length - 1].startTime
      : 0;
  } catch (error) {
    return 0;
  }
};
