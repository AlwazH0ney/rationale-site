"use client";

import dynamic from "next/dynamic";
import { ClusterFallback } from "./ClusterFallback";
import { LungFallback } from "./LungFallback";

/** WebGL components load client-side only; the SVG fallback shows until they are ready. */
export const ClayLung = dynamic(() => import("./ClayLung"), {
  ssr: false,
  loading: () => <LungFallback />,
});

export const ClayCluster = dynamic(() => import("./ClayCluster"), {
  ssr: false,
  loading: () => <ClusterFallback />,
});
