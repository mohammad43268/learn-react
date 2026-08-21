/**
 * 4th-Order Runge-Kutta (RK4) Numerical ODE Solver for 3D Chaos Attractors
 * Computes non-linear differential equations with high precision for real-time WebGL rendering.
 */

export const ATTRACTOR_TYPES = {
  LORENZ: 'lorenz',
  ROSSLER: 'rossler',
  AIZAWA: 'aizawa',
  CHEN: 'chen',
  THOMAS: 'thomas',
  HALVORSEN: 'halvorsen'
};

export const DEFAULT_PARAMS = {
  [ATTRACTOR_TYPES.LORENZ]: {
    sigma: 10.0,
    rho: 28.0,
    beta: 8.0 / 3.0,
    dt: 0.008,
    scale: 0.22,
    offset: [0, 0, -25]
  },
  [ATTRACTOR_TYPES.ROSSLER]: {
    a: 0.2,
    b: 0.2,
    c: 5.7,
    dt: 0.025,
    scale: 0.35,
    offset: [0, 0, 0]
  },
  [ATTRACTOR_TYPES.AIZAWA]: {
    a: 0.95,
    b: 0.7,
    c: 0.6,
    d: 3.5,
    e: 0.25,
    f: 0.1,
    dt: 0.012,
    scale: 3.2,
    offset: [0, 0, 0]
  },
  [ATTRACTOR_TYPES.CHEN]: {
    a: 35.0,
    b: 3.0,
    c: 28.0,
    dt: 0.004,
    scale: 0.18,
    offset: [0, 0, -20]
  },
  [ATTRACTOR_TYPES.THOMAS]: {
    b: 0.208186,
    dt: 0.05,
    scale: 1.8,
    offset: [0, 0, 0]
  }
};

/**
 * Derivatives computation for various chaotic dynamical systems
 */
export function getDerivatives(type, x, y, z, p) {
  switch (type) {
    case ATTRACTOR_TYPES.LORENZ: {
      const dx = p.sigma * (y - x);
      const dy = x * (p.rho - z) - y;
      const dz = x * y - p.beta * z;
      return [dx, dy, dz];
    }
    case ATTRACTOR_TYPES.ROSSLER: {
      const dx = -y - z;
      const dy = x + p.a * y;
      const dz = p.b + z * (x - p.c);
      return [dx, dy, dz];
    }
    case ATTRACTOR_TYPES.AIZAWA: {
      const dx = (z - p.b) * x - p.d * y;
      const dy = p.d * x + (z - p.b) * y;
      const dz = p.c + p.a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + p.e * z) + p.f * z * (x * x * x);
      return [dx, dy, dz];
    }
    case ATTRACTOR_TYPES.CHEN: {
      const dx = p.a * (y - x);
      const dy = (p.c - p.a) * x - x * z + p.c * y;
      const dz = x * y - p.b * z;
      return [dx, dy, dz];
    }
    case ATTRACTOR_TYPES.THOMAS: {
      const dx = Math.sin(y) - p.b * x;
      const dy = Math.sin(z) - p.b * y;
      const dz = Math.sin(x) - p.b * z;
      return [dx, dy, dz];
    }
    default:
      return [0, 0, 0];
  }
}

/**
 * Perform a single 4th-order Runge-Kutta numerical step
 */
export function rk4Step(type, x, y, z, params, dt) {
  const [k1x, k1y, k1z] = getDerivatives(type, x, y, z, params);

  const x2 = x + 0.5 * dt * k1x;
  const y2 = y + 0.5 * dt * k1y;
  const z2 = z + 0.5 * dt * k1z;
  const [k2x, k2y, k2z] = getDerivatives(type, x2, y2, z2, params);

  const x3 = x + 0.5 * dt * k2x;
  const y3 = y + 0.5 * dt * k2y;
  const z3 = z + 0.5 * dt * k2z;
  const [k3x, k3y, k3z] = getDerivatives(type, x3, y3, z3, params);

  const x4 = x + dt * k3x;
  const y4 = y + dt * k3y;
  const z4 = z + dt * k3z;
  const [k4x, k4y, k4z] = getDerivatives(type, x4, y4, z4, params);

  const nextX = x + (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
  const nextY = y + (dt / 6) * (k1y + 2 * k2y + 2 * k3y + k4y);
  const nextZ = z + (dt / 6) * (k1z + 2 * k2z + 2 * k3z + k4z);

  return [nextX, nextY, nextZ];
}

/**
 * Generate a continuous ribbon/path trajectory of points for rendering
 */
export function generateAttractorPath(type, numPoints = 3500, initialPosition = [0.1, 0, 0], customParams = {}) {
  const params = { ...(DEFAULT_PARAMS[type] || DEFAULT_PARAMS[ATTRACTOR_TYPES.LORENZ]), ...customParams };
  const positions = new Float32Array(numPoints * 3);
  const colors = new Float32Array(numPoints * 3);
  const velocities = new Float32Array(numPoints);

  let [cx, cy, cz] = initialPosition;
  const dt = params.dt;
  const scale = params.scale;
  const [offX, offY, offZ] = params.offset;

  // Warmup to reach stable orbit
  for (let i = 0; i < 200; i++) {
    [cx, cy, cz] = rk4Step(type, cx, cy, cz, params, dt);
  }

  let maxSpeed = 0.01;
  const rawVelocities = [];

  for (let i = 0; i < numPoints; i++) {
    const prevX = cx;
    const prevY = cy;
    const prevZ = cz;

    [cx, cy, cz] = rk4Step(type, cx, cy, cz, params, dt);

    const speed = Math.sqrt((cx - prevX) ** 2 + (cy - prevY) ** 2 + (cz - prevZ) ** 2) / dt;
    if (speed > maxSpeed) maxSpeed = speed;
    rawVelocities.push(speed);

    positions[i * 3] = (cx + offX) * scale;
    positions[i * 3 + 1] = (cy + offY) * scale;
    positions[i * 3 + 2] = (cz + offZ) * scale;
  }

  // Calculate normalized colors based on velocity magnitude & normalized arc length
  for (let i = 0; i < numPoints; i++) {
    const t = i / numPoints;
    const normSpeed = rawVelocities[i] / maxSpeed;
    velocities[i] = normSpeed;

    // Gradient from deep electric cyan to vibrant gold / magenta
    colors[i * 3] = 0.2 + 0.8 * Math.sin(t * Math.PI + normSpeed * 1.5);
    colors[i * 3 + 1] = 0.5 + 0.5 * Math.cos(t * Math.PI * 2);
    colors[i * 3 + 2] = 0.9 - 0.4 * normSpeed;
  }

  return { positions, colors, velocities, count: numPoints };
}
