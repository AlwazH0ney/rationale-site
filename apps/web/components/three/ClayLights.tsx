"use client";

/** Three-point setup: key, fill, rim, plus ambient 0.4. */
export function ClayLights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 7, 5]} intensity={1.5} />
      <directionalLight position={[-5, -3, 3]} intensity={0.45} />
      <directionalLight position={[0, -5, -5]} intensity={0.7} />
    </>
  );
}
