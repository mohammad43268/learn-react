import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './Contact.css';

export const Contact = () => {
  const containerRef = useRef(null);
  const btnRef = useRef(null);
  const textRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(pointer: fine)", () => {
      // Magnetic CTA effect
      const btn = btnRef.current;
      const text = textRef.current;

      const xTo = gsap.quickTo(btn, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
      const yTo = gsap.quickTo(btn, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });
      const textXTo = gsap.quickTo(text, "x", { duration: 1, ease: "power3.out" });
      const textYTo = gsap.quickTo(text, "y", { duration: 1, ease: "power3.out" });

      const onMouseMove = (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        
        xTo(x * 0.4);
        yTo(y * 0.4);
        textXTo(x * 0.2); // Text moves slightly less for parallax
        textYTo(y * 0.2);
      };

      const onMouseLeave = () => {
        xTo(0);
        yTo(0);
        textXTo(0);
        textYTo(0);
      };

      btn.addEventListener("mousemove", onMouseMove);
      btn.addEventListener("mouseleave", onMouseLeave);

      return () => {
        btn.removeEventListener("mousemove", onMouseMove);
        btn.removeEventListener("mouseleave", onMouseLeave);
      };
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <footer className="contact-section" id="contact" ref={containerRef}>
      <div className="container contact-container">
        <h2 className="contact-title">Let's build something<br/>exceptional together.</h2>
        
        <div className="magnetic-btn-wrapper">
          <a href="mailto:hello@example.com" className="magnetic-btn interactive" ref={btnRef}>
            <span ref={textRef} style={{ display: 'inline-block' }}>Get in touch</span>
          </a>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Frontend Dev. All rights reserved.</p>
          <div className="social-links">
            <a href="#" className="interactive">Twitter</a>
            <a href="#" className="interactive">LinkedIn</a>
            <a href="#" className="interactive">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
