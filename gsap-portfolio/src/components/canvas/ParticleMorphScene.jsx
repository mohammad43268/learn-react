import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { MORPH_TARGETS, getMorphTargetPositions } from '../../math/particleMorpher';
import { soundSynth } from '../../audio/soundSynthesizer';

export const ParticleMorphScene = ({
  target = MORPH_TARGETS.FIBONACCI_SPHERE,
  count = 2500,
  colorScheme = 'cyber'
}) => {
  const pointsRef = useRef();
  const currentPositions = useMemo(() => new Float32Array(count * 3), [count]);
  const sourcePositions = useMemo(() => new Float32Array(count * 3), [count]);
  const targetPositions = useMemo(() => new Float32Array(count * 3), [count]);
  const colors = useMemo(() => new Float32Array(count * 3), [count]);

  const morphProgress = useRef({ value: 1 });

  // Initialize with Fibonacci sphere
  useMemo(() => {
    const initPos = getMorphTargetPositions(MORPH_TARGETS.FIBONACCI_SPHERE, count);
    for (let i = 0; i < count * 3; i++) {
      currentPositions[i] = initPos[i];
      sourcePositions[i] = initPos[i];
      targetPositions[i] = initPos[i];
    }

    // Set colors
    for (let i = 0; i < count; i++) {
      const t = i / count;
      colors[i * 3] = 0.1 + 0.9 * Math.sin(t * Math.PI);
      colors[i * 3 + 1] = 0.6 + 0.4 * Math.cos(t * Math.PI * 2);
      colors[i * 3 + 2] = 0.9;
    }
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [currentPositions, colors]);

  // When target changes, animate morph via GSAP
  useEffect(() => {
    const newTargetPos = getMorphTargetPositions(target, count);
    
    // Copy current state to source
    for (let i = 0; i < count * 3; i++) {
      sourcePositions[i] = currentPositions[i];
      targetPositions[i] = newTargetPos[i];
    }

    morphProgress.current.value = 0;
    soundSynth.playClick('morph');

    gsap.to(morphProgress.current, {
      value: 1,
      duration: 1.8,
      ease: 'power3.inOut'
    });
  }, [target, count]);

  useFrame((state, delta) => {
    const p = morphProgress.current.value;
    const posAttr = geometry.attributes.position;
    const time = state.clock.elapsedTime;

    // Interpolate positions with subtle harmonic wave ripple
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const sx = sourcePositions[i3];
      const sy = sourcePositions[i3 + 1];
      const sz = sourcePositions[i3 + 2];

      const tx = targetPositions[i3];
      const ty = targetPositions[i3 + 1];
      const tz = targetPositions[i3 + 2];

      // Morph interpolation
      let nx = sx + (tx - sx) * p;
      let ny = sy + (ty - sy) * p;
      let nz = sz + (tz - sz) * p;

      // Harmonic organic wave drift
      const ripple = Math.sin(time * 2.0 + i * 0.05) * 0.05;
      nx += ripple;
      ny += ripple;
      nz += ripple;

      posAttr.array[i3] = nx;
      posAttr.array[i3 + 1] = ny;
      posAttr.array[i3 + 2] = nz;
    }
    posAttr.needsUpdate = true;

    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.12;
      pointsRef.current.rotation.x = Math.sin(time * 0.15) * 0.1;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.88}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
