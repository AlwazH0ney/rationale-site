"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { animate, motionValue, type MotionValue } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Group } from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ClayLights } from "./ClayLights";
import { ClusterFallback } from "./ClusterFallback";
import { CLAY, hasWebGL } from "./clay";
import { useInView } from "./useInView";

const COUNT = 24;
type Vec3 = [number, number, number];

/** Deterministic PRNG so the "random" arrangement is the same on every load. */
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomCluster(): Vec3[] {
  const rnd = mulberry32(7);
  return Array.from({ length: COUNT }, () => {
    const r = 1.3 * Math.cbrt(rnd());
    const theta = rnd() * Math.PI * 2;
    const phi = Math.acos(2 * rnd() - 1);
    return [r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi) * 0.8, r * Math.sin(phi) * Math.sin(theta)];
  });
}

/** Three tilted rings: 4 + 8 + 12 spheres. */
export function orbitalShells(): Vec3[] {
  const shells = [
    { n: 4, r: 0.55, tilt: 0.3 },
    { n: 8, r: 1.15, tilt: -0.5 },
    { n: 12, r: 1.75, tilt: 0.9 },
  ];
  return shells.flatMap(({ n, r, tilt }) =>
    Array.from({ length: n }, (_, i): Vec3 => {
      const a = (i / n) * Math.PI * 2;
      const x = r * Math.cos(a);
      const z = r * Math.sin(a);
      return [x, z * Math.sin(tilt), z * Math.cos(tilt)];
    }),
  );
}

function Spheres({ values, sizes }: { values: MotionValue<number>[][]; sizes: number[] }) {
  const group = useRef<Group>(null);
  useFrame(() => {
    const g = group.current;
    if (!g) return;
    g.children.forEach((m, i) => m.position.set(values[i][0].get(), values[i][1].get(), values[i][2].get()));
  });
  return (
    <group ref={group} rotation={[0.25, 0.4, 0]}>
      {sizes.map((s, i) => (
        <mesh key={i} scale={s}>
          <sphereGeometry args={[0.5, 40, 40]} />
          <meshStandardMaterial color={CLAY.color} metalness={CLAY.metalness} roughness={CLAY.roughness} />
        </mesh>
      ))}
    </group>
  );
}

export interface ClayClusterProps {
  height?: number;
  label?: string;
}

/**
 * 24 clay spheres. Hover drifts them from a loose cluster into orbital
 * shells on Framer Motion springs; leaving drifts them back. Reduced motion
 * switches arrangements instantly.
 */
export function ClayCluster({ height = 360, label = "Clay molecular cluster" }: ClayClusterProps) {
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [box, inView] = useInView<HTMLDivElement>();
  const layouts = useMemo(() => ({ random: randomCluster(), orbital: orbitalShells() }), []);
  const sizes = useMemo(() => {
    const rnd = mulberry32(11);
    return Array.from({ length: COUNT }, () => 0.3 + rnd() * 0.3);
  }, []);
  const values = useMemo(() => layouts.random.map((p) => p.map((v) => motionValue(v))), [layouts]);

  useEffect(() => setWebgl(hasWebGL()), []);

  const arrange = (to: Vec3[]) => {
    values.forEach((axes, i) =>
      axes.forEach((mv, k) => {
        if (reduced) mv.set(to[i][k]);
        else animate(mv, to[i][k], { type: "spring", stiffness: 40, damping: 12, mass: 1 + (i % 5) * 0.15 });
      }),
    );
  };

  if (webgl === false) return <ClusterFallback height={height} />;

  return (
    <div
      ref={box}
      role="img"
      aria-label={label}
      className="w-full"
      style={{ height }}
      onPointerEnter={() => arrange(layouts.orbital)}
      onPointerLeave={() => arrange(layouts.random)}
    >
      {webgl === null ? (
        <ClusterFallback height={height} />
      ) : (
        <Canvas flat frameloop={inView ? "always" : "never"} dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 35 }} gl={{ alpha: true }}>
          <ClayLights />
          <Spheres values={values} sizes={sizes} />
        </Canvas>
      )}
    </div>
  );
}

export default ClayCluster;
