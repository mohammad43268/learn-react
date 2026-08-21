import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './Stats.css';

gsap.registerPlugin(ScrollTrigger);

const statsData = [
  { id: 1, value: 60, suffix: ' FPS', label: 'Realtime WebGL Frame Lock' },
  { id: 2, value: 10000, suffix: '+', label: 'Differential Trajectory Points' },
  { id: 3, value: 5, suffix: ' Engines', label: 'Active Mathematical Solvers' },
  { id: 4, value: 100, suffix: '%', label: 'Procedural Shader Compute' }
];

export const Stats = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.batch(".stat-item", {
        interval: 0.1,
        batchMax: 4,
        onEnter: (batch) => {
          gsap.fromTo(batch, 
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out" }
          );

          batch.forEach((el) => {
            const numEl = el.querySelector('.stat-number-val');
            const targetVal = parseInt(numEl.getAttribute('data-val'), 10);
            
            const countObj = { val: 0 };
            gsap.to(countObj, {
              val: targetVal,
              duration: 1.8,
              ease: "power2.out",
              onUpdate: () => {
                numEl.textContent = Math.round(countObj.val).toLocaleString();
              }
            });
          });
        },
        start: "top 85%"
      });
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section className="stats-section" id="stats" ref={containerRef}>
      <div className="container">
        <div className="stats-grid">
          {statsData.map((stat) => (
            <div key={stat.id} className="stat-item">
              <div className="stat-number">
                <span className="stat-number-val" data-val={stat.value}>0</span>
                <span className="stat-suffix">{stat.suffix}</span>
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
