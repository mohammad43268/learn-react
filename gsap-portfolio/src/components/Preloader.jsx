import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './Preloader.css';

export const Preloader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useGSAP(() => {
    // We simulate loading progress for the portfolio
    const tl = gsap.timeline({
      onComplete: () => {
        // Wipe transition to reveal hero
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 1.2,
          ease: 'power4.inOut',
          onComplete
        });
      }
    });

    const mockLoad = { val: 0 };
    tl.to(mockLoad, {
      val: 100,
      duration: 2.5, // 2.5s simulated load
      ease: 'power2.out',
      onUpdate: () => {
        setProgress(Math.round(mockLoad.val));
      }
    });

    // Animate the SVG stroke
    tl.to('.preloader-svg-path', {
      strokeDashoffset: 0,
      duration: 2,
      ease: 'power3.inOut'
    }, 0); // Start at the same time as the counter

    // Fade out text before wipe
    tl.to('.preloader-content', {
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: 'power2.in'
    }, '>-0.5');

  }, { scope: containerRef });

  return (
    <div className="preloader-container" ref={containerRef}>
      <div className="preloader-content">
        <svg 
          className="preloader-svg" 
          width="120" 
          height="120" 
          viewBox="0 0 100 100"
          fill="none"
          stroke="var(--accent-color)"
          strokeWidth="2"
        >
          {/* A cool abstract monogram/shape */}
          <path 
            className="preloader-svg-path" 
            d="M50 10 L90 50 L50 90 L10 50 Z" 
          />
        </svg>
        <div className="preloader-counter" ref={progressRef}>
          {progress}%
        </div>
      </div>
    </div>
  );
};
