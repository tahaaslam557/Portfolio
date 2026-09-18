"use client";

import { useCallback, useSyncExternalStore } from "react";

/** SSR-safe media query hook. Returns `false` on the server and during hydration. */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** True on devices with a fine pointer (mouse/trackpad) and hover support. */
export function useFinePointer() {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

/**
 * Hydration-safe reduced-motion flag: `false` on the server and during
 * hydration, then the real preference. (Motion's own hook reads the real
 * value on the first client render, which mismatches server HTML.)
 */
export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
