import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './CustomCursor.css';

export const CustomCursor = () => {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);

  useGSAP(() => {
    // Only engage custom cursor for fine pointers (desktops/mice)
    let mm = gsap.matchMedia();

    mm.add("(pointer: fine)", () => {
      // Show cursor only when fine pointer is detected
      gsap.set([cursorRef.current, cursorDotRef.current], { opacity: 1 });

      // quickTo is highly optimized for mousemove events
      const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.6, ease: "power3" });
      const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.6, ease: "power3" });
      
      const dotXTo = gsap.quickTo(cursorDotRef.current, "x", { duration: 0.1, ease: "power3" });
      const dotYTo = gsap.quickTo(cursorDotRef.current, "y", { duration: 0.1, ease: "power3" });

      const onMouseMove = (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
        dotXTo(e.clientX);
        dotYTo(e.clientY);
      };

      const onMouseEnterLink = () => {
        gsap.to(cursorRef.current, { scale: 2.5, backgroundColor: 'rgba(212, 175, 55, 0.1)', borderColor: 'var(--accent-color)', duration: 0.3 });
        gsap.to(cursorDotRef.current, { scale: 0, duration: 0.3 });
      };

      const onMouseLeaveLink = () => {
        gsap.to(cursorRef.current, { scale: 1, backgroundColor: 'transparent', borderColor: 'var(--text-secondary)', duration: 0.3 });
        gsap.to(cursorDotRef.current, { scale: 1, duration: 0.3 });
      };

      window.addEventListener("mousemove", onMouseMove);

      // Magnetic/hover effect for interactive elements
      const interactiveElements = document.querySelectorAll('a, button, .interactive');
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnterLink);
        el.addEventListener('mouseleave', onMouseLeaveLink);
      });

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        interactiveElements.forEach((el) => {
          el.removeEventListener('mouseenter', onMouseEnterLink);
          el.removeEventListener('mouseleave', onMouseLeaveLink);
        });
      };
    });

    return () => mm.revert(); // Cleanup matchMedia
  });

  return (
    <>
      <div className="custom-cursor" ref={cursorRef}></div>
      <div className="custom-cursor-dot" ref={cursorDotRef}></div>
    </>
  );
};
