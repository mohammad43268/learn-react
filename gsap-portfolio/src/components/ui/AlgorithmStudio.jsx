import React from 'react';
import { X, Play, RefreshCw, Cpu, Compass, Orbit } from 'lucide-react';
import { ATTRACTOR_TYPES } from '../../math/rk4Solver';
import { MORPH_TARGETS } from '../../math/particleMorpher';
import { soundSynth } from '../../audio/soundSynthesizer';
import './AlgorithmStudio.css';

export const AlgorithmStudio = ({
  isOpen,
  onClose,
  mode,
  setMode,
  chaosType,
  setChaosType,
  morphTarget,
  setMorphTarget,
  enableOrbit,
  setEnableOrbit
}) => {
  if (!isOpen) return null;

  const modes = [
    { id: 'chaos', name: 'Chaos Attractors (RK4)' },
    { id: 'boids', name: '3D Boids Swarm (Flocking)' },
    { id: '4d', name: '4D Tesseract & Hopf Fibration' },
    { id: 'neural', name: 'Synaptic Neural Graph' },
    { id: 'morph', name: 'Sacred Geometry Particles' }
  ];

  const chaosOptions = [
    { id: ATTRACTOR_TYPES.LORENZ, name: 'Lorenz Butterfly' },
    { id: ATTRACTOR_TYPES.ROSSLER, name: 'Rössler Spiral' },
    { id: ATTRACTOR_TYPES.AIZAWA, name: 'Aizawa Sphere' },
    { id: ATTRACTOR_TYPES.CHEN, name: 'Chen Hyperchaos' },
    { id: ATTRACTOR_TYPES.THOMAS, name: 'Thomas Labyrinth' }
  ];

  const morphOptions = [
    { id: MORPH_TARGETS.FIBONACCI_SPHERE, name: 'Fibonacci Sphere' },
    { id: MORPH_TARGETS.TORUS_KNOT, name: 'Torus Knot (3,7)' },
    { id: MORPH_TARGETS.CALABI_YAU, name: 'Calabi-Yau 6D Manifold' },
    { id: MORPH_TARGETS.METATRON_CUBE, name: "Metatron's Sacred Cube" },
    { id: MORPH_TARGETS.DOUBLE_HELIX, name: 'DNA Double Helix' },
    { id: MORPH_TARGETS.QUANTUM_SINGULARITY, name: 'Quantum Singularity' }
  ];

  return (
    <div className="algo-studio-panel">
      <div className="studio-header">
        <div className="studio-title-box">
          <Cpu size={18} className="studio-icon" />
          <h3>ALGORITHM CONTROL STUDIO</h3>
        </div>
        <button
          className="studio-close-btn interactive"
          onClick={() => {
            soundSynth.playClick('click');
            onClose();
          }}
        >
          <X size={18} />
        </button>
      </div>

      <div className="studio-body">
        {/* Simulation Mode Selector */}
        <div className="studio-section">
          <label className="section-label">Active Computational Model</label>
          <div className="mode-btn-grid">
            {modes.map(m => (
              <button
                key={m.id}
                className={`mode-select-btn interactive ${mode === m.id ? 'active' : ''}`}
                onClick={() => {
                  setMode(m.id);
                  soundSynth.playClick('morph');
                }}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* Chaos Engine Controls */}
        {mode === 'chaos' && (
          <div className="studio-section">
            <label className="section-label">Dynamical System Equation</label>
            <div className="options-grid">
              {chaosOptions.map(c => (
                <button
                  key={c.id}
                  className={`sub-opt-btn interactive ${chaosType === c.id ? 'active' : ''}`}
                  onClick={() => {
                    setChaosType(c.id);
                    soundSynth.playClick('click');
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <div className="algo-math-box">
              <code>dx/dt = σ(y - x)</code>
              <code>dy/dt = x(ρ - z) - y</code>
              <code>dz/dt = xy - βz</code>
            </div>
          </div>
        )}

        {/* Morph Target Controls */}
        {mode === 'morph' && (
          <div className="studio-section">
            <label className="section-label">Sacred Geometry Morph Target</label>
            <div className="options-grid">
              {morphOptions.map(opt => (
                <button
                  key={opt.id}
                  className={`sub-opt-btn interactive ${morphTarget === opt.id ? 'active' : ''}`}
                  onClick={() => {
                    setMorphTarget(opt.id);
                    soundSynth.playClick('morph');
                  }}
                >
                  {opt.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Camera and Viewport Controls */}
        <div className="studio-section">
          <label className="section-label">Camera & Orbit Rig</label>
          <button
            className={`orbit-toggle-btn interactive ${enableOrbit ? 'active' : ''}`}
            onClick={() => {
              setEnableOrbit(!enableOrbit);
              soundSynth.playClick('click');
            }}
          >
            <Orbit size={16} />
            <span>{enableOrbit ? '3D Orbit Mode: ACTIVE (Click & Drag to Rotate)' : 'Scroll Tracking Camera: ACTIVE'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
