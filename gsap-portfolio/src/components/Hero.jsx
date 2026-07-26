import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from '../utils/SplitText';
import './Hero.css';

export const Hero = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // The timeline that plays after preloader finishes
      // We can tie this to a global context or simply add a slight delay
      // assuming preloader takes ~3s total. For a real app, a context state is better.
      const tl = gsap.timeline({ delay: 3.2 });

      // Staggered reveal from masked state for characters
      tl.fromTo('.hero-title .char', 
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.02
        }
      );

      // Subtitle and CTA stagger in off the same timeline
      tl.fromTo(['.hero-subtitle', '.hero-cta'],
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.2
        },
        "-=0.5" // Start slightly before headline finishes
      );
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      const tl = gsap.timeline({ delay: 3.2 });
      tl.fromTo(['.hero-title', '.hero-subtitle', '.hero-cta'], 
        { opacity: 0 },
        { opacity: 1, duration: 1, stagger: 0.2 }
      );
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section className="hero-section" ref={sectionRef}>
      <div className="container hero-container">
        <h1 className="hero-title">
          <SplitText text="Interfaces that move" />
          <br />
          <SplitText text="like they mean it." className="text-accent" />
        </h1>
        
        <p className="hero-subtitle">
          Frontend developer specializing in cinematic, award-tier web experiences.
        </p>
        
        <div className="hero-cta interactive">
          <a href="#work" className="btn-primary">View Selected Work</a>
        </div>
      </div>
    </section>
  );
};
