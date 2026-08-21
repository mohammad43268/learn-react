import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  get4DTesseractVertices,
  get4DTesseractEdges,
  rotate4D,
  project4DTo3D,
  generateHopfFibration
} from '../../math/higherDimensions';

export const DimensionalTesseractScene = ({ showHopf = true }) => {
  const lineRef = useRef();
  const nodesRef = useRef();
  const hopfGroupRef = useRef();

  const tesseractVerts = useMemo(() => get4DTesseractVertices(), []);
  const tesseractEdges = useMemo(() => get4DTesseractEdges(), []);
  const hopfData = useMemo(() => generateHopfFibration(14, 48, 3.5), []);

  const edgeLinePositions = useMemo(() => {
    return new Float32Array(tesseractEdges.length * 6);
  }, [tesseractEdges]);

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(edgeLinePositions, 3));
    return geo;
  }, [edgeLinePositions]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // 4D multi-plane rotation angles
    const angles = {
      xw: time * 0.4,
      yw: time * 0.3,
      zw: time * 0.2,
      xy: time * 0.15
    };

    // Transform and project 4D vertices
    const projected = tesseractVerts.map(v => {
      const rot = rotate4D(v, angles);
      return project4DTo3D(rot, 3.0, 3.2);
    });

    // Update edges line buffer
    const posAttr = lineGeometry.attributes.position;
    for (let i = 0; i < tesseractEdges.length; i++) {
      const [u, v] = tesseractEdges[i];
      const p1 = projected[u];
      const p2 = projected[v];

      const idx = i * 6;
      posAttr.array[idx] = p1[0];
      posAttr.array[idx + 1] = p1[1];
      posAttr.array[idx + 2] = p1[2];

      posAttr.array[idx + 3] = p2[0];
      posAttr.array[idx + 4] = p2[1];
      posAttr.array[idx + 5] = p2[2];
    }
    posAttr.needsUpdate = true;

    // Rotate Hopf Fibration
    if (hopfGroupRef.current) {
      hopfGroupRef.current.rotation.y = time * 0.15;
      hopfGroupRef.current.rotation.x = Math.sin(time * 0.2) * 0.2;
    }
  });

  return (
    <group>
      {/* 4D Tesseract Wireframe */}
      <lineSegments ref={lineRef} geometry={lineGeometry}>
        <lineBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.8}
          linewidth={2}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Hopf Fibration Clifford Rings */}
      {showHopf && (
        <group ref={hopfGroupRef}>
          {hopfData.rings.map((ringPos, idx) => {
            const ringGeo = new THREE.BufferGeometry();
            ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPos, 3));
            return (
              <line key={idx} geometry={ringGeo}>
                <lineBasicMaterial
                  color={idx % 2 === 0 ? '#ff00aa' : '#ffd700'}
                  transparent
                  opacity={0.35}
                  blending={THREE.AdditiveBlending}
                />
              </line>
            );
          })}
        </group>
      )}
    </group>
  );
};
