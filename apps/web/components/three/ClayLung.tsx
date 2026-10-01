"use client";

import { Billboard } from "@react-three/drei";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import type { Group, Mesh } from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ClayLights } from "./ClayLights";
import { LungFallback } from "./LungFallback";
import { CLAY, easeOutBack, hasWebGL, lungGeometry } from "./clay";
import { useInView } from "./useInView";

export type LungRegion = "right lung" | "left lung" | "trachea" | "bronchi" | "tumour site";

export interface ClayLungProps {
  /** Height of the canvas box (px or any CSS length); width fills the parent. */
  height?: number | string;
  /** Report hovered anatomy (anatomy explorer). */
  onRegion?: (region: LungRegion | null) => void;
  label?: string;
}

interface Controls {
  hoverX: number;
  hoverY: number;
  dragYaw: number;
  dragPitch: number;
  zoom: number;
  lastInteraction: number;
  dragging: boolean;
}

const INTRO_S = 1.2;
const THREE_QUARTER = 0.62; // radians, the settled three-quarter view
const IDLE_SPEED = 0.12; // radians per second
const IDLE_AFTER_MS = 3000;

function Lobe({ side, position, scale, region, onRegion, hovered }: {
  side: -1 | 1;
  position: [number, number, number];
  scale: [number, number, number];
  region: LungRegion;
  onRegion?: (r: LungRegion | null) => void;
  hovered: boolean;
}) {
  const handlers = onRegion
    ? {
        onPointerOver: (e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          onRegion(region);
        },
        onPointerOut: () => onRegion(null),
      }
    : {};
  const geometry = useMemo(() => lungGeometry(side), [side]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh position={position} scale={scale} geometry={geometry} {...handlers}>
      <meshStandardMaterial
        color={CLAY.color}
        metalness={CLAY.metalness}
        roughness={CLAY.roughness}
        emissive={CLAY.accent}
        emissiveIntensity={hovered ? 0.12 : 0}
      />
    </mesh>
  );
}

function Airway({ position, rotation, radius, length, region, onRegion }: {
  position: [number, number, number];
  rotation: [number, number, number];
  radius: number;
  length: number;
  region: LungRegion;
  onRegion?: (r: LungRegion | null) => void;
}) {
  return (
    <mesh
      position={position}
      rotation={rotation}
      onPointerOver={onRegion ? (e) => (e.stopPropagation(), onRegion(region)) : undefined}
      onPointerOut={onRegion ? () => onRegion(null) : undefined}
    >
      <cylinderGeometry args={[radius, radius * 0.92, length, 32]} />
      <meshStandardMaterial color={CLAY.color} metalness={0} roughness={CLAY.roughness} />
    </mesh>
  );
}

function TumourMarker({ reduced, onRegion }: { reduced: boolean; onRegion?: (r: LungRegion | null) => void }) {
  const halo = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (!halo.current) return;
    const s = reduced ? 1.4 : 1.2 + 0.35 * (0.5 + 0.5 * Math.sin(clock.elapsedTime * 2.4));
    halo.current.scale.setScalar(s);
  });
  return (
    <group position={[0.92, 0.42, 0.36]}>
      <mesh
        onPointerOver={onRegion ? (e) => (e.stopPropagation(), onRegion("tumour site")) : undefined}
        onPointerOut={onRegion ? () => onRegion(null) : undefined}
      >
        <sphereGeometry args={[0.07, 32, 32]} />
        <meshStandardMaterial color={CLAY.accent} metalness={0} roughness={0.5} />
      </mesh>
      <Billboard>
        <mesh ref={halo}>
          <ringGeometry args={[0.1, 0.115, 48]} />
          <meshBasicMaterial color={CLAY.accent} transparent opacity={0.7} />
        </mesh>
      </Billboard>
    </group>
  );
}

function LungModel({ controls, reduced, onRegion, region }: {
  controls: React.MutableRefObject<Controls>;
  reduced: boolean;
  onRegion?: (r: LungRegion | null) => void;
  region: LungRegion | null;
}) {
  const group = useRef<Group>(null);
  const t0 = useRef<number | null>(null);
  const idleYaw = useRef(0);

  useFrame(({ clock, camera, size }, delta) => {
    const g = group.current;
    if (!g) return;
    const c = controls.current;
    if (t0.current === null) t0.current = clock.elapsedTime;
    const t = clock.elapsedTime - t0.current;

    // Load: front -> three-quarter (slight overshoot) -> settle, once.
    const intro = reduced ? THREE_QUARTER : THREE_QUARTER * easeOutBack(Math.min(1, t / INTRO_S));
    const idle = !reduced && !c.dragging && performance.now() - c.lastInteraction > IDLE_AFTER_MS && t > INTRO_S;
    if (idle) idleYaw.current += delta * IDLE_SPEED;
    const hover = reduced ? 0 : 1;

    const targetYaw = intro + idleYaw.current + c.dragYaw + hover * c.hoverX * 0.45;
    const targetPitch = c.dragPitch + hover * c.hoverY * 0.25;
    const k = reduced ? 1 : 1 - Math.pow(0.001, delta); // frame-rate independent smoothing
    g.rotation.y += (targetYaw - g.rotation.y) * k;
    g.rotation.x += (targetPitch - g.rotation.x) * k;
    const aspect = size.width / Math.max(1, size.height);
    const fit = aspect < 1 ? 5.4 / Math.max(0.55, aspect) : 5.4;
    camera.position.z += (fit / c.zoom - camera.position.z) * k;
  });

  return (
    <group ref={group} position={[0, -0.15, 0]}>
      {/* patient's right lung (viewer's left): larger, three lobes */}
      <Lobe side={-1} position={[-0.78, -0.12, 0]} scale={[0.82, 1.12, 0.66]} region="right lung" onRegion={onRegion} hovered={region === "right lung"} />
      {/* patient's left lung: smaller, two lobes, cardiac notch implied by inset */}
      <Lobe side={1} position={[0.78, -0.16, -0.04]} scale={[0.74, 1.06, 0.62]} region="left lung" onRegion={onRegion} hovered={region === "left lung"} />
      {/* airways */}
      <Airway position={[0, 1.05, 0]} rotation={[0, 0, 0]} radius={0.11} length={1.0} region="trachea" onRegion={onRegion} />
      <Airway position={[-0.27, 0.45, 0]} rotation={[0, 0, -0.95]} radius={0.08} length={0.6} region="bronchi" onRegion={onRegion} />
      <Airway position={[0.27, 0.47, 0]} rotation={[0, 0, 1.05]} radius={0.075} length={0.58} region="bronchi" onRegion={onRegion} />
      <TumourMarker reduced={reduced} onRegion={onRegion} />
    </group>
  );
}

/**
 * Procedural clay lungs. Hover tracks the cursor, drag spins, pinch or
 * ctrl/⌘ + wheel zooms (plain wheel keeps scrolling the page). Under
 * prefers-reduced-motion there is no intro, idle spin, hover tracking or pulse.
 */
export function ClayLung({ height = 460, onRegion, label = "Clay model of the lungs and airways" }: ClayLungProps) {
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [region, setRegion] = useState<LungRegion | null>(null);
  const [box, inView] = useInView<HTMLDivElement>();
  const controls = useRef<Controls>({
    hoverX: 0, hoverY: 0, dragYaw: 0, dragPitch: 0, zoom: 1, lastInteraction: 0, dragging: false,
  });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<number | null>(null);

  useEffect(() => setWebgl(hasWebGL()), []);

  // ctrl/⌘ + wheel (and trackpad pinch, which arrives as ctrl + wheel) zooms.
  useEffect(() => {
    const node = box.current;
    if (!node) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const c = controls.current;
      c.zoom = Math.min(1.8, Math.max(0.7, c.zoom * Math.exp(-e.deltaY * 0.002)));
      c.lastInteraction = performance.now();
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [box, webgl]);

  const handleRegion = useMemo(
    () => (r: LungRegion | null) => {
      setRegion(r);
      onRegion?.(r);
    },
    [onRegion],
  );

  if (webgl === false) return <LungFallback height={height} />;

  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const c = controls.current;
    const rect = e.currentTarget.getBoundingClientRect();
    c.hoverX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    c.hoverY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    const prev = pointers.current.get(e.pointerId);
    if (prev) {
      if (pointers.current.size === 2) {
        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        const [a, b] = Array.from(pointers.current.values());
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinch.current) c.zoom = Math.min(1.8, Math.max(0.7, c.zoom * (d / pinch.current)));
        pinch.current = d;
      } else if (c.dragging) {
        c.dragYaw += (e.clientX - prev.x) * 0.01;
        c.dragPitch = Math.max(-0.8, Math.min(0.8, c.dragPitch + (e.clientY - prev.y) * 0.006));
        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      }
    }
    c.lastInteraction = performance.now();
  };
  const onDown = (e: RPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    controls.current.dragging = pointers.current.size === 1;
    pinch.current = null;
  };
  const onUp = (e: RPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    controls.current.dragging = false;
    pinch.current = null;
  };
  const onLeave = () => {
    controls.current.hoverX = 0;
    controls.current.hoverY = 0;
  };

  return (
    <div
      ref={box}
      role="img"
      aria-label={label}
      className="relative w-full cursor-grab select-none active:cursor-grabbing"
      style={{ height, touchAction: "pan-y" }}
      onPointerMove={onMove}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerLeave={onLeave}
    >
      {webgl === null ? (
        <LungFallback height={height} />
      ) : (
        <Canvas
          frameloop={inView ? "always" : "never"}
          dpr={[1, 2]}
          flat
          camera={{ position: [0, 0.1, 5.4], fov: 35 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ClayLights />
          <LungModel controls={controls} reduced={reduced} onRegion={onRegion ? handleRegion : undefined} region={region} />
        </Canvas>
      )}
    </div>
  );
}

export default ClayLung;
