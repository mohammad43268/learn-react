import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Sparkles, Cpu, Layers, GitBranch, Share2 } from 'lucide-react';
import { ATTRACTOR_TYPES } from '../math/rk4Solver';
import { MORPH_TARGETS } from '../math/particleMorpher';
import { soundSynth } from '../audio/soundSynthesizer';
import './AlgorithmShowcase.css';

export const AlgorithmShowcase = ({ setMode, setChaosType, setMorphTarget, setIsStudioOpen }) => {
  const containerRef = useRef(null);

  const algorithms = [
    {
      id: 'chaos',
      icon: <Sparkles size={24} />,
      title: 'RK4 Chaos Attractor Theory',
      tag: 'Nonlinear Dynamics',
      desc: 'Real-time 4th-order Runge-Kutta ODE numerical solver tracing continuous chaotic phase trajectories of the Lorenz, Rössler, and Aizawa differential equations.',
      action: () => {
        setMode('chaos');
        setChaosType(ATTRACTOR_TYPES.LORENZ);
        setIsStudioOpen(true);
        soundSynth.playClick('morph');
      }
    },
    {
      id: 'boids',
      icon: <Cpu size={24} />,
      title: 'Craig Reynolds 3D Flocking',
      tag: 'Multi-Agent Swarm Intelligence',
      desc: 'Instanced flocking vectors computing emergent collective behavior via Separation, Alignment, Cohesion, Boundary physics, and Predator evasion.',
      action: () => {
        setMode('boids');
        setIsStudioOpen(true);
        soundSynth.playClick('morph');
      }
    },
    {
      id: '4d',
      icon: <Layers size={24} />,
      title: '4D Tesseract & Hopf Fibration',
      tag: 'Higher-Dimensional Topology',
      desc: '6-plane 4D rotation tensors (XY, XZ, XW, YZ, YW, ZW) stereographically projected to 3D with nested Clifford tori mapping S³ hypersphere coordinates.',
      action: () => {
        setMode('4d');
        setIsStudioOpen(true);
        soundSynth.playClick('morph');
      }
    },
    {
      id: 'neural',
      icon: <GitBranch size={24} />,
      title: 'Synaptic Axon Neural Graph',
      tag: 'Dynamic Graph Theory',
      desc: 'Euclidean distance matrix calculating real-time dynamic edge linkages, firing refractory action potential wave pulses across 3D synaptic vertices.',
      action: () => {
        setMode('neural');
        setIsStudioOpen(true);
        soundSynth.playClick('morph');
      }
    },
    {
      id: 'morph',
      icon: <Share2 size={24} />,
      title: 'Sacred Geometry Particle Morpher',
      tag: 'Parametric Geometry Engine',
      desc: 'GPU particle coordinate interpolation morphing across Fibonacci Phyllotaxis, 6D Calabi-Yau manifolds, Metatron Sacred Cubes, and Torus Knots.',
      action: () => {
        setMode('morph');
        setMorphTarget(MORPH_TARGETS.CALABI_YAU);
        setIsStudioOpen(true);
        soundSynth.playClick('morph');
      }
    }
  ];

  return (
    <section className="algo-showcase-section" id="algorithms" ref={containerRef}>
      <div className="container">
        <div className="section-header">
          <span className="section-badge">MATHEMATICAL ENGINES</span>
          <h2 className="section-title">Complex JS Algorithms in 3D Space</h2>
          <p className="section-subtitle">
            Explore deterministic chaos, multi-agent artificial life, 4D topological manifolds, and graph theory running in real-time WebGL.
          </p>
        </div>

        <div className="algo-cards-grid">
          {algorithms.map((algo) => (
            <div
              key={algo.id}
              className="algo-card interactive"
              onClick={algo.action}
            >
              <div className="algo-card-top">
                <div className="algo-icon-wrap">{algo.icon}</div>
                <span className="algo-tag">{algo.tag}</span>
              </div>
              <h3 className="algo-title">{algo.title}</h3>
              <p className="algo-desc">{algo.desc}</p>
              <button className="algo-launch-btn">
                <span>Engage Live Simulation</span>
                <span className="arrow">→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
