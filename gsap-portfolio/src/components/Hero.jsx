import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Sparkles, Terminal, Activity, Layers, ArrowDown } from 'lucide-react';
import { SplitText } from '../utils/SplitText';
import { soundSynth } from '../audio/soundSynthesizer';
import './Hero.css';

export const Hero = ({ setMode, setIsStudioOpen }) => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo('.hero-badge',
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );

      tl.fromTo('.hero-title .char', 
        { y: 100, opacity: 0, rotateX: -60 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.1,
          ease: 'power4.out',
          stagger: 0.02
        },
        "-=0.3"
      );

      tl.fromTo(['.hero-subtitle', '.hero-quick-toggles', '.hero-cta-group'],
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15
        },
        "-=0.5"
      );
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section className="hero-section" id="hero" ref={sectionRef}>
      <div className="container hero-container">
        <div className="hero-badge">
          <Sparkles size={14} className="hero-badge-icon" />
          <span>REACT THREE FIBER & GSAP MATHEMATICAL SIMULATION</span>
        </div>

        <h1 className="hero-title">
          <SplitText text="Deterministic Chaos" />
          <br />
          <SplitText text="& Higher Dimensional Geometry." className="text-accent" />
        </h1>
        
        <p className="hero-subtitle">
          Real-time numerical integration of strange attractors, 4D hyperspatial projections,
          flocking multi-agent physics, and synaptic graph theory on WebGL.
        </p>

        {/* Quick Simulator Switchers */}
        <div className="hero-quick-toggles">
          <span className="toggle-lead">Engage Model:</span>
          <button
            className="quick-chip interactive"
            onClick={() => {
              setMode('chaos');
              soundSynth.playClick('click');
            }}
          >
            Lorenz RK4
          </button>
          <button
            className="quick-chip interactive"
            onClick={() => {
              setMode('boids');
              soundSynth.playClick('click');
            }}
          >
            3D Boids
          </button>
          <button
            className="quick-chip interactive"
            onClick={() => {
              setMode('4d');
              soundSynth.playClick('click');
            }}
          >
            4D Tesseract
          </button>
          <button
            className="quick-chip interactive"
            onClick={() => {
              setMode('neural');
              soundSynth.playClick('click');
            }}
          >
            Neural Graph
          </button>
          <button
            className="quick-chip interactive"
            onClick={() => {
              setMode('morph');
              soundSynth.playClick('morph');
            }}
          >
            Sacred Morph
          </button>
        </div>
        
        <div className="hero-cta-group">
          <a
            href="#algorithms"
            className="btn-primary interactive"
            onClick={() => soundSynth.playClick('click')}
          >
            Explore Mathematical Models
          </a>
          <button
            className="btn-secondary interactive"
            onClick={() => {
              setIsStudioOpen(true);
              soundSynth.playClick('click');
            }}
          >
            <Activity size={16} />
            <span>Open Algo Studio</span>
          </button>
        </div>

        <div className="scroll-indicator">
          <ArrowDown size={16} className="scroll-arrow-anim" />
          <span>SCROLL TO DISCOVER</span>
        </div>
      </div>
    </section>
  );
};
