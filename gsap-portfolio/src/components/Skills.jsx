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

      // Pin the section and translate X
      gsap.to(scrollContainerRef.current, {
        x: -amountToScroll,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${amountToScroll}`, // Scroll distance equals width to scroll
          pin: true,
          scrub: 1, // Smooth scrub
        }
      });
    });

    mm.add("(max-width: 767px)", () => {
      // Mobile: standard vertical scroll for horizontal section
      // No pin/translation needed. CSS will handle overflow-x scroll.
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section className="skills-section" id="skills" ref={containerRef}>
      <div className="skills-horizontal-wrapper" ref={scrollContainerRef}>
        <div className="skills-panel">
          <h2 className="skills-title">Process & Stack</h2>
        </div>
        <div className="skills-panel">
          <h3 className="panel-heading text-accent">01 // Foundation</h3>
          <p className="panel-text">React, Vue, TypeScript, Next.js, Nuxt.</p>
        </div>
        <div className="skills-panel">
          <h3 className="panel-heading text-accent">02 // Motion</h3>
          <p className="panel-text">GSAP, Lenis, Framer Motion, WebGL basics.</p>
        </div>
        <div className="skills-panel">
          <h3 className="panel-heading text-accent">03 // Styling</h3>
          <p className="panel-text">CSS Variables, Tailwind, SCSS, CSS Modules.</p>
        </div>
        <div className="skills-panel">
          <h3 className="panel-heading text-accent">04 // Performance</h3>
          <p className="panel-text">Lighthouse optimization, Asset delivery, Render cycles.</p>
        </div>
      </div>
    </section>
  );
};
