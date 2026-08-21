import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Activity, Layers, Terminal } from 'lucide-react';
import { soundSynth } from '../../audio/soundSynthesizer';
import './Navbar.css';

export const Navbar = ({ currentMode, setMode, isStudioOpen, setIsStudioOpen }) => {
  const [isMuted, setIsMuted] = useState(soundSynth.isMuted);

  const handleAudioToggle = () => {
    const active = soundSynth.toggleMute();
    setIsMuted(!active);
    soundSynth.playClick('click');
  };

  return (
    <header className="site-header">
      <div className="header-container">
        <a href="#" className="brand-logo interactive" onClick={() => soundSynth.playClick('hover')}>
          <Sparkles size={20} className="brand-icon" />
          <span className="brand-name">NEXUS<span className="text-accent">.3D</span></span>
        </a>

        <nav className="header-nav">
          <a href="#hero" className="nav-link interactive">Core</a>
          <a href="#algorithms" className="nav-link interactive">Algorithms</a>
          <a href="#work" className="nav-link interactive">Exhibits</a>
          <a href="#skills" className="nav-link interactive">Stack</a>
          <a href="#contact" className="nav-link interactive">Contact</a>
        </nav>

        <div className="header-actions">
          {/* Audio toggle button */}
          <button
            className={`action-btn interactive ${!isMuted ? 'is-active' : ''}`}
            onClick={handleAudioToggle}
            title={isMuted ? "Enable Sound Synthesizer" : "Mute Sound Synthesizer"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            <span className="btn-label">{isMuted ? 'SOUND OFF' : 'AUDIO LIVE'}</span>
          </button>

          {/* Algorithm Studio Toggle */}
          <button
            className={`action-btn studio-toggle interactive ${isStudioOpen ? 'is-open' : ''}`}
            onClick={() => {
              setIsStudioOpen(!isStudioOpen);
              soundSynth.playClick('click');
            }}
          >
            <Activity size={18} />
            <span className="btn-label">ALGO STUDIO</span>
          </button>
        </div>
      </div>
    </header>
  );
};
