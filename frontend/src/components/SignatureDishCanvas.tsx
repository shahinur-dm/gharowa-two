'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function RoyalKhichuriPlatter() {
  const meshRef = useRef<THREE.Group>(null);
  const steamRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.15;
    }
    if (steamRef.current) {
      steamRef.current.position.y = Math.sin(t * 1.5) * 0.1 + 0.3;
    }
  });

  return (
    <group ref={meshRef} position={[0, -0.2, 0]}>
      {/* Traditional Brass / Kansa Royal Platter Plate */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[2.5, 2.1, 0.15, 64]} />
        <meshStandardMaterial
          color="#D97706"
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>

      {/* Plate Rim Detail */}
      <mesh position={[0, -0.1, 0]}>
        <torusGeometry args={[2.45, 0.08, 16, 64]} />
        <meshStandardMaterial
          color="#F59E0B"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Signature Aromatic Khichuri Dome (Golden Yellow Rice) */}
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[1.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
        <meshStandardMaterial
          color="#FBBF24"
          roughness={0.8}
          bumpScale={0.15}
        />
      </mesh>

      {/* Tender Mutton Leg / Shank Piece */}
      <group position={[0.2, 0.4, 0.2]} rotation={[0.4, 0.5, 0.2]}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.3, 0.45, 1.1, 16]} />
          <meshStandardMaterial
            color="#5C2410"
            roughness={0.6}
            metalness={0.15}
          />
        </mesh>
        {/* Bone end */}
        <mesh position={[0, 0.85, 0]}>
          <cylinderGeometry args={[0.12, 0.15, 0.5, 12]} />
          <meshStandardMaterial
            color="#E5E7EB"
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Traditional Boiled Golden Egg */}
      <mesh position={[-0.9, 0.45, 0.5]} rotation={[0.3, 0.2, -0.4]}>
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshStandardMaterial
          color="#FEF08A"
          roughness={0.4}
        />
      </mesh>

      {/* Roasted Spiced Potato (Alu) */}
      <mesh position={[-0.5, 0.35, -0.8]}>
        <sphereGeometry args={[0.42, 20, 20]} />
        <meshStandardMaterial
          color="#B45309"
          roughness={0.7}
        />
      </mesh>

      {/* Fresh Green Chili Garnishes */}
      <mesh position={[0.7, 0.5, -0.4]} rotation={[0.8, -0.5, 0.3]}>
        <capsuleGeometry args={[0.06, 0.5, 8, 16]} />
        <meshStandardMaterial
          color="#16A34A"
          roughness={0.3}
        />
      </mesh>
      <mesh position={[-0.3, 0.55, 0.9]} rotation={[-0.4, 0.8, 0.2]}>
        <capsuleGeometry args={[0.05, 0.45, 8, 16]} />
        <meshStandardMaterial
          color="#15803D"
          roughness={0.3}
        />
      </mesh>

      {/* Crispy Golden Fried Onions (Beresta) / Spices particles */}
      <group ref={steamRef}>
        <Sparkles
          count={40}
          scale={3.2}
          size={2.5}
          speed={0.4}
          color="#FDE68A"
        />
      </group>
    </group>
  );
}

export default function SignatureDishCanvas() {
  return (
    <div className="relative w-full h-[380px] md:h-[480px] lg:h-[540px] flex items-center justify-center">
      {/* Ambient background gold glow */}
      <div className="absolute inset-0 bg-gold-glow-radial pointer-events-none opacity-70" />

      {/* Floating Heritage Badge */}
      <div className="absolute top-4 right-4 z-10 glass-card px-4 py-2 rounded-full border border-gold-500/30 text-xs font-semibold text-gold-400 backdrop-blur-md shadow-gold">
        ✨ 3D Interactive Platter
      </div>

      <Canvas
        camera={{ position: [0, 2.5, 4.8], fov: 45 }}
        className="cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} color="#FFFBEB" />
        <pointLight position={[-4, 3, -2]} intensity={1.2} color="#F59E0B" />
        <pointLight position={[0, -2, 2]} intensity={0.6} color="#D97706" />

        <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.5}>
          <RoyalKhichuriPlatter />
        </Float>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 4}
          rotateSpeed={0.6}
        />
      </Canvas>
    </div>
  );
}
