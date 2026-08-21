import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import { ChaosAttractorScene } from './ChaosAttractorScene';
import { BoidsFlockScene } from './BoidsFlockScene';
import { DimensionalTesseractScene } from './DimensionalTesseractScene';
import { NeuralGraphScene } from './NeuralGraphScene';
import { ParticleMorphScene } from './ParticleMorphScene';
import { ATTRACTOR_TYPES } from '../../math/rk4Solver';
import { MORPH_TARGETS } from '../../math/particleMorpher';

function CameraRig({ interactive = true }) {
  useFrame((state) => {
    if (!interactive) return;
    const { pointer, camera } = state;
    // Gentle parallax tracking
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 2.5, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 2.5 + 2.0, 0.04);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export const Scene3D = ({
  mode = 'chaos', // 'chaos' | 'boids' | '4d' | 'neural' | 'morph'
  chaosType = ATTRACTOR_TYPES.LORENZ,
  morphTarget = MORPH_TARGETS.FIBONACCI_SPHERE,
  enableOrbit = false,
  interactive = true,
  className = ''
}) => {
  return (
    <div className={`scene-canvas-container ${className}`}>
      <Canvas
        camera={{ position: [0, 2, 16], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#05070f']} />
        
        {/* Deep space ambience */}
        <ambientLight intensity={0.6} />
        <pointLight position={[15, 20, 15]} intensity={1.5} color="#00ffff" />
        <pointLight position={[-15, -20, -15]} intensity={1.2} color="#ff0077" />
        <directionalLight position={[0, 10, 5]} intensity={0.8} />

        <Stars
          radius={50}
          depth={40}
          count={1500}
          factor={3}
          saturation={0.5}
          fade
          speed={1.2}
        />

        <Suspense fallback={null}>
          <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
            {mode === 'chaos' && <ChaosAttractorScene type={chaosType} />}
            {mode === 'boids' && <BoidsFlockScene count={280} />}
            {mode === '4d' && <DimensionalTesseractScene showHopf={true} />}
            {mode === 'neural' && <NeuralGraphScene nodeCount={80} />}
            {mode === 'morph' && <ParticleMorphScene target={morphTarget} />}
          </Float>
        </Suspense>

        <CameraRig interactive={!enableOrbit && interactive} />
        {enableOrbit && <OrbitControls enablePan={false} maxDistance={30} minDistance={5} />}
      </Canvas>
    </div>
  );
};
