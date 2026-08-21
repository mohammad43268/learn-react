import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BoidsSimulation } from '../../math/boidsEngine';

const tempObject = new THREE.Object3D();
const tempVec = new THREE.Vector3();
const tempTarget = new THREE.Vector3();

export const BoidsFlockScene = ({ count = 300, bounds = 18 }) => {
  const meshRef = useRef();
  const predatorMeshRef = useRef();

  const sim = useMemo(() => new BoidsSimulation(count, bounds), [count, bounds]);

  // Cone geometry for boids to indicate direction
  const boidGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.18, 0.6, 5);
    geo.rotateX(Math.PI / 2); // Align pointing forward along Z
    return geo;
  }, []);

  useFrame((state) => {
    // Interactive mouse / orbit predator
    const time = state.clock.elapsedTime;
    const px = Math.sin(time * 0.8) * 10;
    const py = Math.cos(time * 0.6) * 6;
    const pz = Math.sin(time * 0.4) * 8;

    sim.setPredator(px, py, pz);
    sim.update();

    if (predatorMeshRef.current) {
      predatorMeshRef.current.position.set(px, py, pz);
    }

    if (meshRef.current) {
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = sim.positions[i3];
        const y = sim.positions[i3 + 1];
        const z = sim.positions[i3 + 2];

        const vx = sim.velocities[i3];
        const vy = sim.velocities[i3 + 1];
        const vz = sim.velocities[i3 + 2];

        tempObject.position.set(x, y, z);
        tempTarget.set(x + vx, y + vy, z + vz);
        tempObject.lookAt(tempTarget);

        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(i, tempObject.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      <instancedMesh
        ref={meshRef}
        args={[boidGeometry, null, count]}
      >
        <meshStandardMaterial
          color="#00ffff"
          emissive="#005577"
          roughness={0.2}
          metalness={0.8}
        />
      </instancedMesh>

      {/* Predator orb */}
      <mesh ref={predatorMeshRef}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color="#ff0055" wireframe={true} />
        <pointLight color="#ff0055" intensity={3} distance={10} />
      </mesh>

      {/* Boundary container grid */}
      <mesh>
        <boxGeometry args={[bounds * 2, bounds * 2, bounds * 2]} />
        <meshBasicMaterial
          color="#112233"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
};
