"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * R3F STUB — placeholder particle field for the hero background.
 * Intentionally minimal: Design will specify the real shader/visual later.
 * Loaded lazily (ssr:false, after idle) by HeroBackground so it never blocks
 * first paint. Colour is read from the --accent token, not hard-coded.
 */
function Particles() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 1800;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 11;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, []);

  const color = useMemo(() => {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim(); // e.g. "199 89% 58%"
    const [h, s, l] = raw.split(/\s+/);
    return new THREE.Color(`hsl(${h}, ${s}, ${l})`);
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.04;
    ref.current.rotation.x += delta * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color={color}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 6], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
    >
      <Particles />
    </Canvas>
  );
}
