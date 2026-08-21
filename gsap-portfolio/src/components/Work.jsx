import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';
import { Sparkles, ExternalLink, Code2, Layers } from 'lucide-react';
import { soundSynth } from '../audio/soundSynthesizer';
import './Work.css';

gsap.registerPlugin(Flip);

const projects = [
  {
    id: 1,
    title: 'Quantum Attractor Core',
    category: 'Nonlinear Chaos Engine',
    year: '2026',
    desc: 'Ultra-fast Runge-Kutta 4th order numerical integrator solving strange attractors in WebGL with 10,000 continuous orbital ribbon points and parametric bifurcation control.',
    tags: ['RK4 ODE', 'Three.js', 'WebGL Shaders', 'GSAP']
  },
  {
    id: 2,
    title: 'Hyperdimensional Topology',
    category: '4D Tesseract & Hopf S³',
    year: '2026',
    desc: 'Higher-dimensional spatial projection matrix rotating 4D geometric polytopes across 6 independent planes, mapped to nested Clifford tori.',
    tags: ['4D Projections', 'Topology', 'React Three Fiber', 'Matrix Math']
  },
  {
    id: 3,
    title: 'Bio-Swarm Artificial Life',
    category: 'Multi-Agent Flocking',
    year: '2026',
    desc: 'Craig Reynolds 3D boids simulation utilizing instanced spatial geometry, dynamic predator tracking, cohesion/separation balancing, and leader steering.',
    tags: ['Swarm Intelligence', 'Instancing', 'Spatial Physics', 'GSAP']
  },
  {
    id: 4,
    title: 'Synaptic Neural Matrix',
    category: 'Dynamic Graph Theory',
    year: '2026',
    desc: 'Autonomous 3D neuro-synaptic network dynamically constructing axon edges via Euclidean distance thresholding with action potential signal propagation.',
    tags: ['Graph Theory', 'Neural Networks', 'Spatial KD-Tree', 'Audio Synth']
  }
];

export const Work = () => {
  const containerRef = useRef(null);
  const [activeProject, setActiveProject] = useState(null);

  useGSAP(() => {
    // Scroll reveal animation for project cards
    gsap.fromTo('.project-card',
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%'
        }
      }
    );
  }, { scope: containerRef });

  const handleProjectClick = (project) => {
    soundSynth.playClick('click');
    const state = Flip.getState('.project-card, .project-detail');

    setActiveProject(activeProject?.id === project.id ? null : project);

    setTimeout(() => {
      Flip.from(state, {
        duration: 0.8,
        ease: 'power3.inOut',
        absolute: true,
        onEnter: elements => gsap.fromTo(elements, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4, delay: 0.3 }),
        onLeave: elements => gsap.to(elements, { opacity: 0, scale: 0.95, duration: 0.3 })
      });
    }, 0);
  };

  return (
    <section className="work-section" id="work" ref={containerRef}>
      <div className="container">
        <div className="section-header text-center">
          <span className="section-badge">SELECTED EXHIBITS</span>
          <h2 className="section-title">Algorithmic Architecture</h2>
          <p className="section-subtitle">
            Engineered systems combining advanced mathematics, 3D computer graphics, and physics simulations.
          </p>
        </div>
        
        <div className="work-grid">
          {projects.map((project) => (
            <div 
              key={project.id}
              className={`project-card interactive ${activeProject?.id === project.id ? 'is-active' : ''}`}
              onClick={() => handleProjectClick(project)}
              data-flip-id={`project-${project.id}`}
            >
              <div className="project-preview-box">
                <div className="preview-glow" />
                <div className="project-index">0{project.id}</div>
                <div className="project-tags-row">
                  {project.tags.slice(0, 2).map((t, i) => (
                    <span key={i} className="project-tag-pill">{t}</span>
                  ))}
                </div>
              </div>
              <div className="project-info">
                <h3 className="project-title">{project.title}</h3>
                <span className="project-meta">{project.category} // {project.year}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Modal View */}
        {activeProject && (
          <div className="project-detail" onClick={() => handleProjectClick(activeProject)}>
            <div className="project-detail-content" data-flip-id={`project-${activeProject.id}`} onClick={(e) => e.stopPropagation()}>
              <div className="project-detail-header">
                <div>
                  <span className="project-tag-pill">{activeProject.category}</span>
                  <h2 className="project-detail-title">{activeProject.title}</h2>
                </div>
                <button className="btn-close interactive" onClick={() => handleProjectClick(activeProject)}>✕</button>
              </div>

              <p className="project-detail-desc">{activeProject.desc}</p>

              <div className="project-tech-stack">
                <span className="stack-label">Core Architecture:</span>
                <div className="tags-container">
                  {activeProject.tags.map((t, idx) => (
                    <span key={idx} className="tech-badge">{t}</span>
                  ))}
                </div>
              </div>

              <div className="project-actions">
                <a href="#algorithms" className="btn-primary interactive" onClick={() => setActiveProject(null)}>
                  <Sparkles size={16} />
                  <span>Launch Interactive Simulator</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
