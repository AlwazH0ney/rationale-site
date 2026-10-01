"use client";

import { useEffect, useRef, useState } from "react";

/** Pause WebGL rendering while the canvas is off-screen. */
export function useInView<T extends HTMLElement>(): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "100px" });
    io.observe(node);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}
