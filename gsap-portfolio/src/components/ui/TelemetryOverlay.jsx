import React, { useState, useEffect } from 'react';
import './TelemetryOverlay.css';

export const TelemetryOverlay = ({ mode, chaosType, morphTarget }) => {
  const [fps, setFps] = useState(60);
  const [frameTime, setFrameTime] = useState(16.6);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId;

    const loop = (now) => {
      frameCount++;
      const delta = now - lastTime;
      if (delta >= 1000) {
        const calculatedFps = Math.round((frameCount * 1000) / delta);
        setFps(calculatedFps);
        setFrameTime((1000 / calculatedFps).toFixed(1));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const getStats = () => {
    switch (mode) {
      case 'chaos':
        return { name: `Chaos RK4 // ${chaosType.toUpperCase()}`, points: '4,000 pts', order: 'O(4) Runge-Kutta' };
      case 'boids':
        return { name: 'Reynolds Swarm // 3D Flocking', points: '280 boids', order: 'O(N²) Spatial Matrix' };
      case '4d':
        return { name: '4D Tesseract & Hopf S³', points: '32 edges / 672 rings', order: 'Stereographic Proj' };
      case 'neural':
        return { name: 'Synaptic Graph // Axon Mesh', points: '80 soma / 160 axons', order: 'Dynamic Distance' };
      case 'morph':
        return { name: `Sacred Particles // ${morphTarget.replace('_', ' ').toUpperCase()}`, points: '2,500 particles', order: 'Cubic Bezier Morph' };
      default:
        return { name: 'WebGL 3D Engine', points: '10,000+', order: 'High Precision' };
    }
  };

  const stat = getStats();

  return (
    <div className="telemetry-overlay">
      <div className="telemetry-item">
        <span className="telemetry-label">FPS</span>
        <span className="telemetry-val text-neon">{fps}</span>
      </div>
      <div className="telemetry-divider" />
      <div className="telemetry-item">
        <span className="telemetry-label">FRAME</span>
        <span className="telemetry-val">{frameTime}ms</span>
      </div>
      <div className="telemetry-divider" />
      <div className="telemetry-item hide-mobile">
        <span className="telemetry-label">COMPUTE</span>
        <span className="telemetry-val">{stat.name}</span>
      </div>
      <div className="telemetry-divider hide-mobile" />
      <div className="telemetry-item hide-mobile">
        <span className="telemetry-label">ELEMENTS</span>
        <span className="telemetry-val">{stat.points}</span>
      </div>
    </div>
  );
};
