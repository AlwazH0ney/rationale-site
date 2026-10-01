import { SphereGeometry } from "three";

/** Shared clay look: matte sage-tinted material and the three-point light rig. */
export const CLAY = {
  color: "#A8B5AC",
  accent: "#6B7E73",
  metalness: 0,
  roughness: 0.65,
} as const;

export function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function easeOutBack(t: number): number {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

/** Soft groove: 1 at the fissure line, falling to 0 within ~width. */
function groove(distance: number, width: number): number {
  return Math.exp(-((distance / width) ** 2));
}

/**
 * Procedural lung: a sphere reshaped to a narrow apex and broad base, with the
 * medial (inner) face flattened and fissures pressed in as soft grooves.
 * side = -1 for the patient's right lung (viewer's left, three lobes: one
 * horizontal and one oblique fissure), +1 for the left lung (two lobes: one
 * oblique fissure).
 */
export function lungGeometry(side: -1 | 1, segments = 96): SphereGeometry {
  const g = new SphereGeometry(1, segments, segments);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);
    const t = (y + 1) / 2; // 0 at the base, 1 at the apex
    const taper = 1 - 0.48 * Math.pow(t, 1.7);
    x *= taper;
    z *= taper;
    if (x * side < 0) x *= 0.58; // medial face, towards the heart and midline
    if (y < -0.72) y = -0.72 + (y + 0.72) * 0.35; // broad, flattened base on the diaphragm

    // fissures: shrink the radius slightly near each fissure plane
    const oblique = (y - (-0.2 + 0.55 * z)) / Math.hypot(1, 0.55);
    let press = 0.06 * groove(oblique, 0.05);
    if (side === -1) press = Math.max(press, 0.05 * groove(y - 0.22, 0.045) * (z > -0.3 ? 1 : 0.4));
    x *= 1 - press;
    z *= 1 - press;
    pos.setXYZ(i, x, y, z);
  }
  g.computeVertexNormals();
  return g;
}
