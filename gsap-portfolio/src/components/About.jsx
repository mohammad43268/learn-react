import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

export const About = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // Pin the text content while image scrubs past
      ScrollTrigger.create({
        trigger: ".about-content",
        start: "top center",
        end: "bottom center",
        pin: ".about-text-wrapper",
        scrub: true,
      });

      // Parallax effect on the images
      gsap.to(".about-image-wrapper", {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-container",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });
    });

    mm.add("(max-width: 767px)", () => {
      // Simple fade up for mobile (no pin/parallax to avoid touch issues)
      gsap.fromTo('.about-fade-mobile', 
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: ".about-container",
            start: "top 80%"
          }
        }
      );
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.fromTo('.about-container', 
        { opacity: 0 },
        { opacity: 1, scrollTrigger: { trigger: ".about-container", start: "top 80%" } }
      );
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section className="about-section" id="about" ref={containerRef}>
      <div className="container about-container">
        <div className="about-content">
          <div className="about-text-wrapper about-fade-mobile">
            <h2 className="section-title">Design, Meet Code.</h2>
            <p className="about-desc">
              I merge high-end editorial aesthetics with robust engineering. 
              My philosophy is simple: animation must serve a purpose, layout must respect the content, 
              and performance is non-negotiable.
            </p>
          </div>
          <div className="about-images">
            <div className="about-image-wrapper about-fade-mobile interactive">
              <div className="image-placeholder"></div>
              <p className="image-caption">01 // Execution</p>
            </div>
            <div className="about-image-wrapper offset about-fade-mobile interactive">
              <div className="image-placeholder dark"></div>
              <p className="image-caption">02 // Precision</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
