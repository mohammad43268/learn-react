/**
 * 3D Craig Reynolds Boids Flocking Simulation Engine
 * Computes emergent swarm intelligence: Separation, Alignment, Cohesion, Boundary Avoidance, and Predator Repulsion.
 */

export class BoidsSimulation {
  constructor(count = 250, bounds = 25) {
    this.count = count;
    this.bounds = bounds;

    // Parameters
    this.maxSpeed = 0.45;
    this.maxForce = 0.025;
    this.separationRadius = 2.0;
    this.neighborRadius = 6.0;
    this.separationWeight = 1.6;
    this.alignmentWeight = 1.0;
    this.cohesionWeight = 1.1;
    this.boundaryWeight = 1.8;
    this.predatorWeight = 2.5;

    // Float32Arrays for cache-friendly memory layout
    this.positions = new Float32Array(count * 3);
    this.velocities = new Float32Array(count * 3);
    this.accelerations = new Float32Array(count * 3);

    // Predator / Attractor state
    this.predatorPos = [0, 0, 0];
    this.targetPos = [0, 0, 0];
    this.hasTarget = false;

    this.init();
  }

  init() {
    for (let i = 0; i < this.count; i++) {
      const idx = i * 3;
      // Random distribution in sphere
      const r = Math.random() * this.bounds * 0.7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      this.positions[idx] = r * Math.sin(phi) * Math.cos(theta);
      this.positions[idx + 1] = r * Math.sin(phi) * Math.sin(theta);
      this.positions[idx + 2] = r * Math.cos(phi);

      // Random initial velocity
      this.velocities[idx] = (Math.random() - 0.5) * this.maxSpeed;
      this.velocities[idx + 1] = (Math.random() - 0.5) * this.maxSpeed;
      this.velocities[idx + 2] = (Math.random() - 0.5) * this.maxSpeed;

      this.accelerations[idx] = 0;
      this.accelerations[idx + 1] = 0;
      this.accelerations[idx + 2] = 0;
    }
  }

  setPredator(x, y, z) {
    this.predatorPos[0] = x;
    this.predatorPos[1] = y;
    this.predatorPos[2] = z;
  }

  setTarget(x, y, z, active = true) {
    this.targetPos[0] = x;
    this.targetPos[1] = y;
    this.targetPos[2] = z;
    this.hasTarget = active;
  }

  update() {
    const {
      count,
      bounds,
      maxSpeed,
      maxForce,
      separationRadius,
      neighborRadius,
      separationWeight,
      alignmentWeight,
      cohesionWeight,
      boundaryWeight,
      predatorWeight,
      positions,
      velocities,
      accelerations
    } = this;

    const sepRadSq = separationRadius * separationRadius;
    const neighRadSq = neighborRadius * neighborRadius;

    // Reset accelerations
    for (let i = 0; i < count * 3; i++) {
      accelerations[i] = 0;
    }

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const px = positions[i3];
      const py = positions[i3 + 1];
      const pz = positions[i3 + 2];

      const vx = velocities[i3];
      const vy = velocities[i3 + 1];
      const vz = velocities[i3 + 2];

      let sepX = 0, sepY = 0, sepZ = 0;
      let aliX = 0, aliY = 0, aliZ = 0;
      let cohX = 0, cohY = 0, cohZ = 0;
      let neighborCount = 0;
      let sepCount = 0;

      for (let j = 0; j < count; j++) {
        if (i === j) continue;
        const j3 = j * 3;
        const dx = positions[j3] - px;
        const dy = positions[j3 + 1] - py;
        const dz = positions[j3 + 2] - pz;
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < neighRadSq && distSq > 0.0001) {
          const dist = Math.sqrt(distSq);

          // Cohesion accumulation
          cohX += positions[j3];
          cohY += positions[j3 + 1];
          cohZ += positions[j3 + 2];

          // Alignment accumulation
          aliX += velocities[j3];
          aliY += velocities[j3 + 1];
          aliZ += velocities[j3 + 2];
          neighborCount++;

          // Separation accumulation (inverse distance weighting)
          if (distSq < sepRadSq) {
            sepX -= (dx / dist) / dist;
            sepY -= (dy / dist) / dist;
            sepZ -= (dz / dist) / dist;
            sepCount++;
          }
        }
      }

      // Apply forces
      let fx = 0, fy = 0, fz = 0;

      if (neighborCount > 0) {
        // Cohesion: Steer towards center of mass
        cohX = (cohX / neighborCount) - px;
        cohY = (cohY / neighborCount) - py;
        cohZ = (cohZ / neighborCount) - pz;
        const cohLen = Math.sqrt(cohX * cohX + cohY * cohY + cohZ * cohZ);
        if (cohLen > 0) {
          const steerX = (cohX / cohLen) * maxSpeed - vx;
          const steerY = (cohY / cohLen) * maxSpeed - vy;
          const steerZ = (cohZ / cohLen) * maxSpeed - vz;
          fx += this.limitForce(steerX, maxForce) * cohesionWeight;
          fy += this.limitForce(steerY, maxForce) * cohesionWeight;
          fz += this.limitForce(steerZ, maxForce) * cohesionWeight;
        }

        // Alignment: Match average velocity
        aliX = aliX / neighborCount;
        aliY = aliY / neighborCount;
        aliZ = aliZ / neighborCount;
        const aliLen = Math.sqrt(aliX * aliX + aliY * aliY + aliZ * aliZ);
        if (aliLen > 0) {
          const steerX = (aliX / aliLen) * maxSpeed - vx;
          const steerY = (aliY / aliLen) * maxSpeed - vy;
          const steerZ = (aliZ / aliLen) * maxSpeed - vz;
          fx += this.limitForce(steerX, maxForce) * alignmentWeight;
          fy += this.limitForce(steerY, maxForce) * alignmentWeight;
          fz += this.limitForce(steerZ, maxForce) * alignmentWeight;
        }
      }

      if (sepCount > 0) {
        const sepLen = Math.sqrt(sepX * sepX + sepY * sepY + sepZ * sepZ);
        if (sepLen > 0) {
          const steerX = (sepX / sepLen) * maxSpeed - vx;
          const steerY = (sepY / sepLen) * maxSpeed - vy;
          const steerZ = (sepZ / sepLen) * maxSpeed - vz;
          fx += this.limitForce(steerX, maxForce * 1.5) * separationWeight;
          fy += this.limitForce(steerY, maxForce * 1.5) * separationWeight;
          fz += this.limitForce(steerZ, maxForce * 1.5) * separationWeight;
        }
      }

      // Boundary soft container force
      const distFromCenter = Math.sqrt(px * px + py * py + pz * pz);
      if (distFromCenter > bounds) {
        const excess = (distFromCenter - bounds) / bounds;
        fx -= (px / distFromCenter) * maxForce * boundaryWeight * excess * 4;
        fy -= (py / distFromCenter) * maxForce * boundaryWeight * excess * 4;
        fz -= (pz / distFromCenter) * maxForce * boundaryWeight * excess * 4;
      }

      // Predator repulsion
      const predDx = px - this.predatorPos[0];
      const predDy = py - this.predatorPos[1];
      const predDz = pz - this.predatorPos[2];
      const predDistSq = predDx * predDx + predDy * predDy + predDz * predDz;
      const predRadius = 8.0;

      if (predDistSq < predRadius * predRadius && predDistSq > 0.01) {
        const predDist = Math.sqrt(predDistSq);
        const repelForce = (1.0 - predDist / predRadius) * maxForce * predatorWeight * 3;
        fx += (predDx / predDist) * repelForce;
        fy += (predDy / predDist) * repelForce;
        fz += (predDz / predDist) * repelForce;
      }

      // Target seek if active
      if (this.hasTarget) {
        const tarDx = this.targetPos[0] - px;
        const tarDy = this.targetPos[1] - py;
        const tarDz = this.targetPos[2] - pz;
        const tarDist = Math.sqrt(tarDx * tarDx + tarDy * tarDy + tarDz * tarDz);
        if (tarDist > 1.0) {
          fx += (tarDx / tarDist) * maxForce * 0.8;
          fy += (tarDy / tarDist) * maxForce * 0.8;
          fz += (tarDz / tarDist) * maxForce * 0.8;
        }
      }

      accelerations[i3] = fx;
      accelerations[i3 + 1] = fy;
      accelerations[i3 + 2] = fz;
    }

    // Integrate velocities and positions
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      velocities[i3] += accelerations[i3];
      velocities[i3 + 1] += accelerations[i3 + 1];
      velocities[i3 + 2] += accelerations[i3 + 2];

      // Limit speed
      const speed = Math.sqrt(
        velocities[i3] ** 2 +
        velocities[i3 + 1] ** 2 +
        velocities[i3 + 2] ** 2
      );

      if (speed > maxSpeed) {
        velocities[i3] = (velocities[i3] / speed) * maxSpeed;
        velocities[i3 + 1] = (velocities[i3 + 1] / speed) * maxSpeed;
        velocities[i3 + 2] = (velocities[i3 + 2] / speed) * maxSpeed;
      }

      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];
    }
  }

  limitForce(f, max) {
    return Math.max(-max, Math.min(max, f));
  }
}
