# 🌌 NEXUS.3D — Real-Time Mathematical & Physics Simulation Engine

> An interactive 3D WebGL experience built with **React Three Fiber (R3F)**, **Three.js**, and **GSAP**, powered by deterministic chaos theory, multi-agent artificial life, 4D topological projections, and graph theory.

![React Three Fiber](https://img.shields.io/badge/Three.js-R3F-00f0ff?style=for-the-badge&logo=three.js&logoColor=black)
![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-88ce02?style=for-the-badge&logo=greensock&logoColor=black)
![WebGL](https://img.shields.io/badge/WebGL-60_FPS-ff0077?style=for-the-badge&logo=webgl&logoColor=white)
![Web Audio](https://img.shields.io/badge/Web_Audio-Procedural_Synth-ffd700?style=for-the-badge)

---

## 🧮 Integrated Mathematical & Algorithmic Engines

### 1. 🦋 Runge-Kutta 4th-Order (RK4) Chaos Attractors
Continuous numerical integration of non-linear ordinary differential equations (ODEs) tracing orbital phase portraits with over 4,000 continuous vertex coordinates and dynamic velocity color gradients.
- **Lorenz Attractor**:
  $$\frac{dx}{dt} = \sigma (y - x), \quad \frac{dy}{dt} = x (\rho - z) - y, \quad \frac{dz}{dt} = xy - \beta z$$
- **Rössler System**:
  $$\frac{dx}{dt} = -y - z, \quad \frac{dy}{dt} = x + ay, \quad \frac{dz}{dt} = b + z(x - c)$$
- **Aizawa Spherical Attractor**:
  $$\frac{dx}{dt} = (z - b)x - dy, \quad \frac{dy}{dt} = dx + (z - b)y, \quad \frac{dz}{dt} = c + az - \frac{z^3}{3} - (x^2 + y^2)(1 + ez) + fz x^3$$
- **Chen Hyperchaos & Thomas Labyrinth**

---

### 2. 🦅 Craig Reynolds 3D Boids Swarm Intelligence
Multi-agent artificial life simulation computing emergent collective dynamics via spatial force accumulation:
- **Separation**: $\vec{F}_{sep} = \sum \frac{\vec{p}_i - \vec{p}_j}{\|\vec{p}_i - \vec{p}_j\|^2}$
- **Alignment**: $\vec{F}_{ali} = \frac{1}{N}\sum \vec{v}_j - \vec{v}_i$
- **Cohesion**: $\vec{F}_{coh} = \frac{1}{N}\sum \vec{p}_j - \vec{p}_i$
- **Boundary & Predator Repulsion**: Soft bounding container and predator vector evasion.
- **Optimization**: Three.js `InstancedMesh` with matrix transforms running smoothly at 60 FPS for hundreds of agents.

---

### 3. 🌀 4D Tesseract & Hopf Fibration ($\mathbb{S}^3 \to \mathbb{S}^2$)
- **4D Hypercube**: 16 vertices and 32 topological edges rotated simultaneously across 6 hyperplanes ($XY, XZ, XW, YZ, YW, ZW$) and stereographically projected into 3-dimensional Euclidean space.
- **Hopf Fibration**: Parametrization of Clifford tori mapping fiber bundles from the 3-sphere $\mathbb{S}^3$ to the 2-sphere $\mathbb{S}^2$ with golden-ratio angular phase distributions.

---

### 4. 🧠 Dynamic Synaptic Neural Network (Graph Theory)
- **Distance Matrix**: Dynamic Euclidean proximity matrix linking soma nodes with distance-weighted axon lines.
- **Action Potential**: Action potentials (nerve impulses) propagating across synapses with refractory cascade triggers.
- **Interactive Cursor Physics**: Mouse raycasting creates local gravitational and repulsive fields.

---

### 5. 🔮 Sacred Geometry Particle Morpher
- **Fibonacci Phyllotaxis Sphere**: Golden ratio angle $\phi \approx 2.39996$ radian distribution.
- **6D Calabi-Yau Manifold**: Complex 2D projection slice of quintic threefold compactification space.
- **Parametric (3,7) Torus Knot & DNA Double Helix**.
- **Smooth GPU Interpolation**: Cubic bezier easing transitions blending thousands of glowing particles.

---

### 6. 🔊 Procedural Web Audio Synthesizer
- Zero-external-asset audio engine generating cosmic sub-bass drones, resonant dimensional sweeps, and cybernetic UI feedback.

---

## 🚀 Getting Started

```bash
# Clone repository
git clone https://github.com/mohammad43268/learn-react.git
cd learn-react/gsap-portfolio

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🎛️ Interactive Controls

- **Algo Studio HUD**: Click `ALGO STUDIO` in the header or bottom right to customize mathematical models, dynamical equations, and morph targets.
- **3D Orbit Lock**: Toggle orbit mode inside the Studio to rotate, pan, and zoom the camera freely in 3D.
- **Procedural Audio**: Click `SOUND OFF` to activate the harmonic sound synthesizer.
- **Telemetry Monitor**: Bottom-left HUD displays live FPS, frame delta, and active compute metrics.
