/**
 * Higher-Dimensional Mathematical Visualizer
 * Includes: 4D Tesseract (Hypercube) with 6-plane 4D rotations and stereographic projection,
 * Hopf Fibration from S^3 -> S^2, and Parametric Klein Bottle / Calabi-Yau slices.
 */

// 16 Vertices of a 4D Hypercube (±1, ±1, ±1, ±1)
export function get4DTesseractVertices() {
  const vertices = [];
  for (let x of [-1, 1]) {
    for (let y of [-1, 1]) {
      for (let z of [-1, 1]) {
        for (let w of [-1, 1]) {
          vertices.push([x, y, z, w]);
        }
      }
    }
  }
  return vertices;
}

// 32 Edges of 4D Hypercube (pairs of vertex indices with hamming distance 1)
export function get4DTesseractEdges() {
  const edges = [];
  const verts = get4DTesseractVertices();
  for (let i = 0; i < verts.length; i++) {
    for (let j = i + 1; j < verts.length; j++) {
      let diff = 0;
      for (let k = 0; k < 4; k++) {
        if (verts[i][k] !== verts[j][k]) diff++;
      }
      if (diff === 1) {
        edges.push([i, j]);
      }
    }
  }
  return edges;
}

/**
 * 4D Rotation in 6 planes (XY, XZ, XW, YZ, YW, ZW)
 */
export function rotate4D(v, angles) {
  let [x, y, z, w] = v;
  const { xy = 0, xz = 0, xw = 0, yz = 0, yw = 0, zw = 0 } = angles;

  // XW rotation
  if (xw !== 0) {
    const cos = Math.cos(xw), sin = Math.sin(xw);
    const nx = x * cos - w * sin;
    const nw = x * sin + w * cos;
    x = nx; w = nw;
  }

  // YW rotation
  if (yw !== 0) {
    const cos = Math.cos(yw), sin = Math.sin(yw);
    const ny = y * cos - w * sin;
    const nw = y * sin + w * cos;
    y = ny; w = nw;
  }

  // ZW rotation
  if (zw !== 0) {
    const cos = Math.cos(zw), sin = Math.sin(zw);
    const nz = z * cos - w * sin;
    const nw = z * sin + w * cos;
    z = nz; w = nw;
  }

  // XY rotation
  if (xy !== 0) {
    const cos = Math.cos(xy), sin = Math.sin(xy);
    const nx = x * cos - y * sin;
    const ny = x * sin + y * cos;
    x = nx; y = ny;
  }

  // XZ rotation
  if (xz !== 0) {
    const cos = Math.cos(xz), sin = Math.sin(xz);
    const nx = x * cos - z * sin;
    const nz = x * sin + z * cos;
    x = nx; z = nz;
  }

  // YZ rotation
  if (yz !== 0) {
    const cos = Math.cos(yz), sin = Math.sin(yz);
    const ny = y * cos - z * sin;
    const nz = y * sin + z * cos;
    y = ny; z = nz;
  }

  return [x, y, z, w];
}

/**
 * Perspective/Stereographic 4D -> 3D projection
 */
export function project4DTo3D(v, distance = 2.5, scale = 2.8) {
  const [x, y, z, w] = v;
  const factor = 1 / (distance - w);
  return [x * factor * scale, y * factor * scale, z * factor * scale];
}

/**
 * Generate Hopf Fibration: mapping circles on S^3 to nested Clifford Tori in 3D
 */
export function generateHopfFibration(numRings = 16, pointsPerRing = 64, scale = 3.2) {
  const positions = [];
  const colors = [];

  for (let r = 0; r < numRings; r++) {
    const eta = (r / numRings) * (Math.PI / 2); // Latitude on S^2 base space
    const xi2 = (r * 2.39996) % (Math.PI * 2);  // Golden ratio phase

    const ringPositions = [];
    const rHue = r / numRings;

    for (let p = 0; p <= pointsPerRing; p++) {
      const xi1 = (p / pointsPerRing) * Math.PI * 2;

      // Coordinates in S^3
      const q1 = Math.cos(xi1 + xi2) * Math.sin(eta);
      const q2 = Math.sin(xi1 + xi2) * Math.sin(eta);
      const q3 = Math.cos(xi1 - xi2) * Math.cos(eta);
      const q4 = Math.sin(xi1 - xi2) * Math.cos(eta);

      // Stereographic projection from S^3 to R^3
      const denom = 1.0001 - q4;
      const x = (q1 / denom) * scale;
      const y = (q2 / denom) * scale;
      const z = (q3 / denom) * scale;

      ringPositions.push(x, y, z);

      // Cybernetic colors
      colors.push(
        0.3 + 0.7 * Math.sin(rHue * Math.PI * 2),
        0.5 + 0.5 * Math.cos(rHue * Math.PI * 2),
        0.9 - 0.3 * Math.sin(xi1)
      );
    }
    positions.push(new Float32Array(ringPositions));
  }

  return { rings: positions, colors };
}

/**
 * Parametric Klein Bottle Surface Generator
 */
export function getKleinBottlePoint(u, v, scale = 1.2) {
  u = u * Math.PI;
  v = v * 2 * Math.PI;

  let x, y, z;
  const cosU = Math.cos(u);
  const sinU = Math.sin(u);
  const cosV = Math.cos(v);
  const sinV = Math.sin(v);

  if (u < Math.PI) {
    x = 3 * cosU * (1 + sinU) + 2 * (1 - cosU / 2) * cosU * cosV;
    y = -8 * sinU - 2 * (1 - cosU / 2) * sinU * cosV;
  } else {
    x = 3 * cosU * (1 + sinU) + 2 * (1 - cosU / 2) * Math.cos(v + Math.PI);
    y = -8 * sinU;
  }
  z = 2 * (1 - cosU / 2) * sinV;

  return [x * scale * 0.3, y * scale * 0.3, z * scale * 0.3];
}
