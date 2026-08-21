import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './Skills.css';

gsap.registerPlugin(ScrollTrigger);

export const Skills = () => {
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const scrollWidth = scrollContainerRef.current.scrollWidth;
      const amountToScroll = scrollWidth - window.innerWidth;

      gsap.to(scrollContainerRef.current, {
        x: -amountToScroll,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${amountToScroll}`,
          pin: true,
          scrub: 1,
        }
      });
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section className="skills-section" id="skills" ref={containerRef}>
      <div className="skills-horizontal-wrapper" ref={scrollContainerRef}>
        <div className="skills-panel">
          <span className="section-badge">CORE STACK</span>
          <h2 className="skills-title">Mathematical & 3D Engineering</h2>
        </div>
        <div className="skills-panel">
          <h3 className="panel-heading text-accent">01 // WebGL & R3F</h3>
          <p className="panel-text">React Three Fiber, Three.js, Custom GLSL Shaders, InstancedMesh, BufferGeometry.</p>
        </div>
        <div className="skills-panel">
          <h3 className="panel-heading text-accent">02 // Numerical Algorithms</h3>
          <p className="panel-text">RK4 Differential Solvers, 4D Stereographic Projections, Swarm Flocking Physics, Graph Theory.</p>
        </div>
        <div className="skills-panel">
          <h3 className="panel-heading text-accent">03 // Motion & Choreography</h3>
          <p className="panel-text">GSAP Core, ScrollTrigger, Flip Plugin, MatchMedia, Lenis Smooth Scroll.</p>
        </div>
        <div className="skills-panel">
          <h3 className="panel-heading text-accent">04 // Audio Synthesis</h3>
          <p className="panel-text">Web Audio API, Procedural Sound Synthesis, Biquad Filtering, Harmonic Oscillators.</p>
        </div>
      </div>
    </section>
  );
};
