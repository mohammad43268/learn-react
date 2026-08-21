import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { NeuralNetworkGraph } from '../../math/neuralNetworkGraph';

export const NeuralGraphScene = ({ nodeCount = 85 }) => {
  const lineRef = useRef();
  const nodesRef = useRef();
  const pulsesRef = useRef();

  const graph = useMemo(() => new NeuralNetworkGraph(nodeCount, 4.5, 4), [nodeCount]);

  const lineGeometry = useMemo(() => new THREE.BufferGeometry(), []);
  const pulseGeometry = useMemo(() => new THREE.BufferGeometry(), []);

  const nodePositions = useMemo(() => new Float32Array(nodeCount * 3), [nodeCount]);
  const nodeGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    return geo;
  }, [nodePositions]);

  const { pointer, viewport } = useThree();

  useFrame(() => {
    // Mouse raycast vector in world space
    const mouseWorld = [
      (pointer.x * viewport.width) / 2,
      (pointer.y * viewport.height) / 2,
      0
    ];

    graph.update(mouseWorld);

    // Update node positions
    const nodePosAttr = nodeGeo.attributes.position;
    for (let i = 0; i < nodeCount; i++) {
      nodePosAttr.array[i * 3] = graph.nodes[i].pos[0];
      nodePosAttr.array[i * 3 + 1] = graph.nodes[i].pos[1];
      nodePosAttr.array[i * 3 + 2] = graph.nodes[i].pos[2];
    }
    nodePosAttr.needsUpdate = true;

    // Update lines
    const lineData = graph.getLineBufferData();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(lineData.positions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineData.colors, 3));

    // Update action potential pulses
    const pulseData = graph.getPulseBufferData();
    if (pulseData.count > 0) {
      pulseGeometry.setAttribute('position', new THREE.BufferAttribute(pulseData.positions, 3));
    }
  });

  return (
    <group>
      {/* Axon Connection Lines */}
      <lineSegments ref={lineRef} geometry={lineGeometry}>
        <lineBasicMaterial
          vertexColors
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Neuron Soma Nodes */}
      <points ref={nodesRef} geometry={nodeGeo}>
        <pointsMaterial
          size={0.25}
          color="#00ffff"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Action Potential Signal Pulses */}
      <points ref={pulsesRef} geometry={pulseGeometry}>
        <pointsMaterial
          size={0.45}
          color="#ffffff"
          transparent
          opacity={1.0}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};
