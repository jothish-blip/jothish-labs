import { useEffect, useLayoutEffect } from "react";

// Use useLayoutEffect on the client to avoid flicker, and useEffect on the server
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Safely locks body scroll without causing layout shifts or scroll jumps.
 * Uses a robust position: fixed strategy to prevent Safari/mobile scroll-smooth issues.
 */
export function useScrollLock(lock: boolean) {
  useIsomorphicLayoutEffect(() => {
    if (!lock) return;

    // Save original styles and scroll position
    const scrollY = window.scrollY;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    
    // Calculate scrollbar width to prevent layout shift on desktop
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Apply lock using position fixed
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    
    if (scrollbarWidth > 0) {
      // Add padding to replace the scrollbar space
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Cleanup on unmount or when lock becomes false
    return () => {
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;

      // Restore scroll position instantly
      window.scrollTo(0, scrollY);
    };
  }, [lock]);
}
