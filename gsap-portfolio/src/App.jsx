import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/CustomCursor';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Work } from './components/Work';
import { Skills } from './components/Skills';
import { Stats } from './components/Stats';
import { Contact } from './components/Contact';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Setup Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Wire Lenis to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return (
    <div className="app-main">
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <CustomCursor />
      
      {/* We keep components mounted but hidden behind preloader via z-index until it finishes */}
      <Hero />
      <About />
      <Work />
      <Skills />
      <Stats />
      <Contact />
    </div>
  );
}

export default App;
