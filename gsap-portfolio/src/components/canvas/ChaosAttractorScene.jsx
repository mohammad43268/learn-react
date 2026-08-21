import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { generateAttractorPath, ATTRACTOR_TYPES } from '../../math/rk4Solver';

export const ChaosAttractorScene = ({
  type = ATTRACTOR_TYPES.LORENZ,
  pointCount = 4000,
  speed = 1.0,
  params = {}
}) => {
  const lineRef = useRef();
  const tracerRef = useRef();
  const groupRef = useRef();

  const { positions, colors, count } = useMemo(() => {
    return generateAttractorPath(type, pointCount, [0.1, 0, 0], params);
  }, [type, pointCount, params]);

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25 * speed;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }

    if (tracerRef.current && count > 0) {
      const idx = Math.floor((state.clock.elapsedTime * 400 * speed) % count);
      tracerRef.current.position.set(
        positions[idx * 3],
        positions[idx * 3 + 1],
        positions[idx * 3 + 2]
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Glow Ribbon Trajectory */}
      <line ref={lineRef} geometry={lineGeometry}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          linewidth={2}
        />
      </line>

      {/* Leading Tracer Energy Core */}
      <mesh ref={tracerRef}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#ffffff" wireframe={false} />
        <pointLight color="#00f0ff" intensity={4} distance={6} />
      </mesh>
    </group>
  );
};
