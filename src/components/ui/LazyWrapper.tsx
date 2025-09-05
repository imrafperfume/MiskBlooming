"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { LAZY_LOADING_CONFIG } from "../../lib/performance";

interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export function LazyWrapper({
  children,
  fallback = <div className="h-64 bg-cream-200 animate-pulse rounded-lg" />,
  threshold = LAZY_LOADING_CONFIG.threshold,
  rootMargin = LAZY_LOADING_CONFIG.rootMargin,
  className = "",
}: LazyWrapperProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, hasLoaded]);

  return (
    <div ref={elementRef} className={className}>
      {isVisible ? children : fallback}
    </div>
  );
}
