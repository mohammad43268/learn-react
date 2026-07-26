import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './Stats.css';

gsap.registerPlugin(ScrollTrigger);

const statsData = [
  { id: 1, value: 42, label: 'Projects Delivered' },
  { id: 2, value: 15, label: 'Awwwards' },
  { id: 3, value: 99, label: 'Lighthouse Score' },
  { id: 4, value: 300, label: 'Cups of Coffee' }
];

export const Stats = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Use ScrollTrigger.batch for stagger effect when scrolling down
      ScrollTrigger.batch(".stat-item", {
        interval: 0.1, // time window (in seconds) for batching elements that enter at the same time
        batchMax: 4,   // max elements per batch
        onEnter: (batch) => {
          gsap.fromTo(batch, 
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out" }
          );

          // Animate numbers counting up
          batch.forEach((el) => {
            const numEl = el.querySelector('.stat-number-val');
            const targetVal = parseInt(numEl.getAttribute('data-val'), 10);
            
            const countObj = { val: 0 };
            gsap.to(countObj, {
              val: targetVal,
              duration: 1.5,
              ease: "power2.out",
              onUpdate: () => {
                numEl.textContent = Math.round(countObj.val);
              }
            });
          });
        },
        start: "top 85%"
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      ScrollTrigger.batch(".stat-item", {
        onEnter: (batch) => gsap.set(batch, { opacity: 1 }),
        start: "top 90%"
      });
      // Just set the final values for numbers immediately
      document.querySelectorAll('.stat-number-val').forEach(el => {
        el.textContent = el.getAttribute('data-val');
      });
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section className="stats-section" id="stats" ref={containerRef}>
      <div className="container">
        <div className="stats-grid">
          {statsData.map((stat) => (
            <div key={stat.id} className="stat-item gsap-reveal">
              <div className="stat-number">
                <span className="stat-number-val" data-val={stat.value}>0</span>
                <span className="stat-plus">+</span>
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
