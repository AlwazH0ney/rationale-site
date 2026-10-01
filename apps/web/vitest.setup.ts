import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// jsdom lacks these browser APIs; components and Recharts touch them.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver;

window.scrollTo = (() => {}) as typeof window.scrollTo;

if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

// next/dynamic + WebGL are out of scope for unit tests: render the static fallback.
vi.mock("@/components/three/dynamic", async () => {
  const { LungFallback } = await import("@/components/three/LungFallback");
  const { ClusterFallback } = await import("@/components/three/ClusterFallback");
  return { ClayLung: LungFallback, ClayCluster: ClusterFallback };
});
