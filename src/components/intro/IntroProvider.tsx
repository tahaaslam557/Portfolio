"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny external store for the intro state. The gate script in <head> sets
 * `data-intro` on <html> before paint; this just mirrors it into React.
 */
const listeners = new Set<() => void>();

export function isIntroDone() {
  return document.documentElement.dataset.intro === "done";
}

export function markIntroDone() {
  document.documentElement.dataset.intro = "done";
  try {
    sessionStorage.setItem("ta-intro", "1");
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/** `ready` is true once the intro has finished or was skipped. */
export function useIntro() {
  const ready = useSyncExternalStore(subscribe, isIntroDone, () => false);
  return { ready };
}

export function IntroProvider({ children }: { children: React.ReactNode }) {
  return children;
}
