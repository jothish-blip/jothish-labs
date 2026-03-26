"use client";

import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 6] }}>
      {/* Lights */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 3, 3]} />

      {/* Floating Object */}
      <Float speed={2} rotationIntensity={1.2} floatIntensity={2}>
        <mesh>
          <icosahedronGeometry args={[1.8, 1]} />
          <meshStandardMaterial
            color="#00ffff"
            wireframe
          />
        </mesh>
      </Float>

      {/* Disable zoom for cleaner UX */}
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}