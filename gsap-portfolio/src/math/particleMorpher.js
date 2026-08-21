/**
 * Sacred Geometry & Mathematical Particle Morphing Engine
 * Generates exact 3D coordinates for diverse mathematical structures with seamless GPU/CPU morphing interpolation.
 */

export const MORPH_TARGETS = {
  FIBONACCI_SPHERE: 'fibonacci_sphere',
  TORUS_KNOT: 'torus_knot',
  CALABI_YAU: 'calabi_yau',
  METATRON_CUBE: 'metatron_cube',
  DOUBLE_HELIX: 'double_helix',
  QUANTUM_SINGULARITY: 'quantum_singularity'
};

/**
 * Fibonacci Lattice on Sphere (Phyllotaxis distribution)
 */
export function generateFibonacciSphere(count = 2000, radius = 5.0) {
  const positions = new Float32Array(count * 3);
  const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle ~2.39996 rad

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = phi * i;

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    positions[i * 3] = x * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = z * radius;
  }
  return positions;
}

/**
 * 3D Torus Knot (p, q) = (3, 7) parametric curve with cross-sectional dispersion
 */
export function generateTorusKnotParticles(count = 2000, p = 3, q = 7, scale = 2.4) {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2 * p;
    const r = 1.2 * (2 + Math.cos(q * t / p));
    const x = r * Math.cos(t) * scale;
    const y = r * Math.sin(t) * scale;
    const z = -Math.sin(q * t / p) * scale * 2.2;

    // Small tube jitter
    const angle = Math.random() * Math.PI * 2;
    const offsetRad = Math.random() * 0.35;

    positions[i * 3] = x + Math.cos(angle) * offsetRad;
    positions[i * 3 + 1] = y + Math.sin(angle) * offsetRad;
    positions[i * 3 + 2] = z + (Math.random() - 0.5) * offsetRad;
  }
  return positions;
}

/**
 * 2D slice of Calabi-Yau 6D compactification manifold
 */
export function generateCalabiYauPoints(count = 2000, scale = 3.2) {
  const positions = new Float32Array(count * 3);
  const n = 5; // Quintic threefold

  for (let i = 0; i < count; i++) {
    const z1Mod = Math.random();
    const z1Arg = (Math.random() * 2 * Math.PI) / n;
    const z1 = [Math.cos(z1Arg) * z1Mod, Math.sin(z1Arg) * z1Mod];

    const z2Mod = Math.pow(1 - Math.pow(z1Mod, n), 1 / n);
    const z2Arg = (Math.random() * 2 * Math.PI) / n;
    const z2 = [Math.cos(z2Arg) * z2Mod, Math.sin(z2Arg) * z2Mod];

    // Stereographic projection to 3D
    const u = z1[0];
    const v = z1[1];
    const w = z2[0];

    positions[i * 3] = u * scale * 3.5;
    positions[i * 3 + 1] = v * scale * 3.5;
    positions[i * 3 + 2] = w * scale * 3.5;
  }
  return positions;
}

/**
 * Metatron's Cube sacred geometry vertex & midpoint dispersion
 */
export function generateMetatronPoints(count = 2000, scale = 4.0) {
  const positions = new Float32Array(count * 3);

  // 13 Sacred Spheres centers
  const centers = [
    [0, 0, 0],
    // Inner hexagon
    [1, 0, 0], [-1, 0, 0], [0.5, 0.866, 0], [-0.5, 0.866, 0], [0.5, -0.866, 0], [-0.5, -0.866, 0],
    // Outer hexagon
    [2, 0, 0], [-2, 0, 0], [1, 1.732, 0], [-1, 1.732, 0], [1, -1.732, 0], [-1, -1.732, 0]
  ];

  for (let i = 0; i < count; i++) {
    const center = centers[i % centers.length];
    const z = (Math.sin(i * 0.1) * 0.8) + ((i % 3) - 1) * 0.5;

    const rad = Math.random() * 0.7;
    const ang = Math.random() * Math.PI * 2;

    positions[i * 3] = (center[0] + Math.cos(ang) * rad) * scale * 0.6;
    positions[i * 3 + 1] = (center[1] + Math.sin(ang) * rad) * scale * 0.6;
    positions[i * 3 + 2] = (center[2] + z) * scale * 0.6;
  }
  return positions;
}

/**
 * Double Helix DNA strand with connecting hydrogen bond bridges
 */
export function generateDoubleHelix(count = 2000, height = 12.0, radius = 2.5) {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const t = (i / count) * 4 * Math.PI; // 2 full revolutions
    const y = ((i / count) - 0.5) * height;

    const strand = i % 3;
    let x, z;

    if (strand === 0) {
      // Strand 1
      x = Math.cos(t) * radius;
      z = Math.sin(t) * radius;
    } else if (strand === 1) {
      // Strand 2 (180 deg shifted)
      x = Math.cos(t + Math.PI) * radius;
      z = Math.sin(t + Math.PI) * radius;
    } else {
      // Rung bridge between strands
      const alpha = Math.random() * 2 - 1; // -1 to 1 interpolation
      x = Math.cos(t) * radius * alpha;
      z = Math.sin(t) * radius * alpha;
    }

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  return positions;
}

/**
 * Quantum Singularity (Accretion disk + Event horizon + Relativistic polar jets)
 */
export function generateQuantumSingularity(count = 2000, scale = 4.0) {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    if (i < count * 0.7) {
      // Accretion disk spiral
      const r = 1.2 + Math.pow(Math.random(), 0.5) * 4.5;
      const theta = r * 4.0 + Math.random() * 0.2;
      positions[i * 3] = Math.cos(theta) * r * scale * 0.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.3 * (1 + r * 0.2);
      positions[i * 3 + 2] = Math.sin(theta) * r * scale * 0.5;
    } else {
      // Relativistic polar jets
      const jetSign = i % 2 === 0 ? 1 : -1;
      const jetHeight = Math.random() * 5.0;
      const jetSpread = 0.08 * jetHeight + Math.random() * 0.15;
      const ang = Math.random() * Math.PI * 2;

      positions[i * 3] = Math.cos(ang) * jetSpread * scale;
      positions[i * 3 + 1] = jetSign * (1.2 + jetHeight) * scale * 0.7;
      positions[i * 3 + 2] = Math.sin(ang) * jetSpread * scale;
    }
  }
  return positions;
}

/**
 * Get target position array by name
 */
export function getMorphTargetPositions(name, count = 2000) {
  switch (name) {
    case MORPH_TARGETS.FIBONACCI_SPHERE:
      return generateFibonacciSphere(count);
    case MORPH_TARGETS.TORUS_KNOT:
      return generateTorusKnotParticles(count);
    case MORPH_TARGETS.CALABI_YAU:
      return generateCalabiYauPoints(count);
    case MORPH_TARGETS.METATRON_CUBE:
      return generateMetatronPoints(count);
    case MORPH_TARGETS.DOUBLE_HELIX:
      return generateDoubleHelix(count);
    case MORPH_TARGETS.QUANTUM_SINGULARITY:
      return generateQuantumSingularity(count);
    default:
      return generateFibonacciSphere(count);
  }
}
