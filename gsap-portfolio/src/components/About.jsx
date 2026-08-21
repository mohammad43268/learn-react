import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Cpu, Terminal, Compass, Zap } from 'lucide-react';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

export const About = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      ScrollTrigger.create({
        trigger: ".about-content",
        start: "top center",
        end: "bottom center",
        pin: ".about-text-wrapper",
        scrub: true,
      });

      gsap.to(".about-image-wrapper", {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-container",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section className="about-section" id="about" ref={containerRef}>
      <div className="container about-container">
        <div className="about-content">
          <div className="about-text-wrapper about-fade-mobile">
            <span className="section-badge">ENGINEERING PHILOSOPHY</span>
            <h2 className="section-title">Mathematics Meets Creative WebGL.</h2>
            <p className="about-desc">
              We bridge theoretical physics, differential equations, and 3D computer graphics to create
              alive, responsive, high-performance web applications. Every particle trajectory, swarm movement,
              and higher-dimensional projection is computed deterministically in real-time.
            </p>
          </div>
          <div className="about-images">
            <div className="about-image-wrapper interactive">
              <div className="feature-card-inner">
                <Zap size={32} className="feature-icon" />
                <h3>Deterministic Physics</h3>
                <p>Runge-Kutta 4th-order integration and spatial collision optimization running at 60 FPS.</p>
              </div>
              <p className="image-caption">01 // NUMERICAL PRECISION</p>
            </div>
            <div className="about-image-wrapper offset interactive">
              <div className="feature-card-inner dark">
                <Compass size={32} className="feature-icon" />
                <h3>Higher Dimensionality</h3>
                <p>Translating 4-dimensional hypercubes and Clifford tori into observable 3D spaces.</p>
              </div>
              <p className="image-caption">02 // SPATIAL TOPOLOGY</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
