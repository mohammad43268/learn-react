import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

import { Scene3D } from './components/canvas/Scene3D';
import { Navbar } from './components/ui/Navbar';
import { AlgorithmStudio } from './components/ui/AlgorithmStudio';
import { TelemetryOverlay } from './components/ui/TelemetryOverlay';
import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/CustomCursor';
import { Hero } from './components/Hero';
import { AlgorithmShowcase } from './components/AlgorithmShowcase';
import { About } from './components/About';
import { Work } from './components/Work';
import { Skills } from './components/Skills';
import { Stats } from './components/Stats';
import { Contact } from './components/Contact';

import { ATTRACTOR_TYPES } from './math/rk4Solver';
import { MORPH_TARGETS } from './math/particleMorpher';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('chaos'); // 'chaos' | 'boids' | '4d' | 'neural' | 'morph'
  const [chaosType, setChaosType] = useState(ATTRACTOR_TYPES.LORENZ);
  const [morphTarget, setMorphTarget] = useState(MORPH_TARGETS.FIBONACCI_SPHERE);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [enableOrbit, setEnableOrbit] = useState(false);

  useEffect(() => {
    // Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

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

      {/* Persistent WebGL 3D Background Canvas */}
      <Scene3D
        mode={mode}
        chaosType={chaosType}
        morphTarget={morphTarget}
        enableOrbit={enableOrbit}
        interactive={true}
        className="fixed-3d-background"
      />

      {/* Cybernetic Navigation Header */}
      <Navbar
        currentMode={mode}
        setMode={setMode}
        isStudioOpen={isStudioOpen}
        setIsStudioOpen={setIsStudioOpen}
      />

      {/* Telemetry Monitor HUD */}
      <TelemetryOverlay
        mode={mode}
        chaosType={chaosType}
        morphTarget={morphTarget}
      />

      {/* Floating Algorithm Tweaking Studio */}
      <AlgorithmStudio
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        mode={mode}
        setMode={setMode}
        chaosType={chaosType}
        setChaosType={setChaosType}
        morphTarget={morphTarget}
        setMorphTarget={setMorphTarget}
        enableOrbit={enableOrbit}
        setEnableOrbit={setEnableOrbit}
      />

      {/* Content Layers */}
      <main className="content-scroller">
        <Hero setMode={setMode} setIsStudioOpen={setIsStudioOpen} />
        <AlgorithmShowcase
          setMode={setMode}
          setChaosType={setChaosType}
          setMorphTarget={setMorphTarget}
          setIsStudioOpen={setIsStudioOpen}
        />
        <About />
        <Work />
        <Skills />
        <Stats />
        <Contact />
      </main>
    </div>
  );
}

export default App;
