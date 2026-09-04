'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';

function BackgroundMesh() {
  const meshRef = useRef<any>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]} scale={10}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        color="#eff6ff"
        attach="material"
        distort={0.4}
        speed={1}
        roughness={0.5}
        metalness={0.1}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

export function ThreeBackground() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#2563eb" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#3b82f6" />
        <BackgroundMesh />
      </Canvas>
    </div>
  );
}
