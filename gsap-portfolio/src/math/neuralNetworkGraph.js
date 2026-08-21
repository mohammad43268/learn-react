/**
 * Dynamic Synaptic Neural Graph Simulation
 * Implements 3D graph algorithms: Euclidean Distance Matrix, dynamic edge pruning,
 * and Action Potential (spike) signal propagation along axon connections.
 */

export class NeuralNetworkGraph {
  constructor(nodeCount = 90, maxDistance = 4.2, maxConnectionsPerNode = 4) {
    this.nodeCount = nodeCount;
    this.maxDistance = maxDistance;
    this.maxConnections = maxConnectionsPerNode;

    this.nodes = [];
    this.edges = [];
    this.pulses = [];

    this.initNodes();
    this.updateEdges();
  }

  initNodes() {
    this.nodes = [];
    for (let i = 0; i < this.nodeCount; i++) {
      // Clustered 3D spatial distribution (Brain lobe lobes / hypergraph clusters)
      const cluster = i % 3;
      const center = [
        (cluster === 0 ? -3.5 : cluster === 1 ? 3.5 : 0),
        (cluster === 2 ? 2.5 : -1.0),
        (cluster === 0 ? 1.0 : cluster === 1 ? -1.0 : 0)
      ];

      const r = Math.pow(Math.random(), 0.6) * 3.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = center[0] + r * Math.sin(phi) * Math.cos(theta);
      const y = center[1] + r * Math.sin(phi) * Math.sin(theta);
      const z = center[2] + r * Math.cos(phi);

      this.nodes.push({
        id: i,
        pos: [x, y, z],
        basePos: [x, y, z],
        vel: [
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.008
        ],
        activity: Math.random(),
        refractory: 0
      });
    }
  }

  updateEdges() {
    this.edges = [];
    const maxDistSq = this.maxDistance * this.maxDistance;

    for (let i = 0; i < this.nodeCount; i++) {
      let connections = 0;
      const p1 = this.nodes[i].pos;

      for (let j = i + 1; j < this.nodeCount; j++) {
        const p2 = this.nodes[j].pos;
        const dx = p1[0] - p2[0];
        const dy = p1[1] - p2[1];
        const dz = p1[2] - p2[2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < maxDistSq) {
          const dist = Math.sqrt(distSq);
          const weight = 1.0 - (dist / this.maxDistance);

          this.edges.push({
            source: i,
            target: j,
            weight,
            p1: [...p1],
            p2: [...p2]
          });

          connections++;
          if (connections >= this.maxConnections) break;
        }
      }
    }
  }

  triggerSignalPulse(sourceIndex) {
    if (this.edges.length === 0) return;
    const connectedEdges = this.edges.filter(e => e.source === sourceIndex || e.target === sourceIndex);
    if (connectedEdges.length === 0) return;

    const edge = connectedEdges[Math.floor(Math.random() * connectedEdges.length)];
    this.pulses.push({
      edge,
      progress: 0,
      speed: 0.02 + Math.random() * 0.03,
      direction: edge.source === sourceIndex ? 1 : -1
    });
  }

  update(mouseWorld = null) {
    // Oscillate & float nodes with harmonic drift
    for (let i = 0; i < this.nodeCount; i++) {
      const node = this.nodes[i];
      node.pos[0] += node.vel[0];
      node.pos[1] += node.vel[1];
      node.pos[2] += node.vel[2];

      // Tether back to base position
      const dx = node.basePos[0] - node.pos[0];
      const dy = node.basePos[1] - node.pos[1];
      const dz = node.basePos[2] - node.pos[2];
      node.vel[0] += dx * 0.01;
      node.vel[1] += dy * 0.01;
      node.vel[2] += dz * 0.01;

      // Mouse interactive repulsion/gravity
      if (mouseWorld) {
        const mdx = node.pos[0] - mouseWorld[0];
        const mdy = node.pos[1] - mouseWorld[1];
        const mdz = node.pos[2] - (mouseWorld[2] || 0);
        const mDistSq = mdx * mdx + mdy * mdy + mdz * mdz;

        if (mDistSq < 16.0 && mDistSq > 0.01) {
          const mDist = Math.sqrt(mDistSq);
          const force = (1.0 - mDist / 4.0) * 0.04;
          node.pos[0] += (mdx / mDist) * force;
          node.pos[1] += (mdy / mDist) * force;
        }
      }

      // Spontaneous synaptic firing
      if (Math.random() < 0.02) {
        this.triggerSignalPulse(i);
      }
    }

    // Refresh dynamic edge positions
    this.updateEdges();

    // Advance synaptic pulses along axons
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const pulse = this.pulses[i];
      pulse.progress += pulse.speed;
      if (pulse.progress >= 1.0) {
        // Cascade to next node
        const targetNode = pulse.direction === 1 ? pulse.edge.target : pulse.edge.source;
        if (Math.random() < 0.6) {
          this.triggerSignalPulse(targetNode);
        }
        this.pulses.splice(i, 1);
      }
    }
  }

  getLineBufferData() {
    const edgeCount = this.edges.length;
    const positions = new Float32Array(edgeCount * 6);
    const colors = new Float32Array(edgeCount * 6);

    for (let i = 0; i < edgeCount; i++) {
      const edge = this.edges[i];
      const p1 = this.nodes[edge.source].pos;
      const p2 = this.nodes[edge.target].pos;

      const idx = i * 6;
      positions[idx] = p1[0];
      positions[idx + 1] = p1[1];
      positions[idx + 2] = p1[2];

      positions[idx + 3] = p2[0];
      positions[idx + 4] = p2[1];
      positions[idx + 5] = p2[2];

      const alpha = edge.weight * 0.6;
      colors[idx] = 0.0;
      colors[idx + 1] = 0.8 * alpha;
      colors[idx + 2] = 1.0 * alpha;

      colors[idx + 3] = 0.0;
      colors[idx + 4] = 0.5 * alpha;
      colors[idx + 5] = 0.9 * alpha;
    }

    return { positions, colors, count: edgeCount };
  }

  getPulseBufferData() {
    const pulseCount = this.pulses.length;
    const positions = new Float32Array(pulseCount * 3);

    for (let i = 0; i < pulseCount; i++) {
      const pulse = this.pulses[i];
      const p1 = this.nodes[pulse.edge.source].pos;
      const p2 = this.nodes[pulse.edge.target].pos;
      const t = pulse.direction === 1 ? pulse.progress : (1.0 - pulse.progress);

      positions[i * 3] = p1[0] + (p2[0] - p1[0]) * t;
      positions[i * 3 + 1] = p1[1] + (p2[1] - p1[1]) * t;
      positions[i * 3 + 2] = p1[2] + (p2[2] - p1[2]) * t;
    }

    return { positions, count: pulseCount };
  }
}
