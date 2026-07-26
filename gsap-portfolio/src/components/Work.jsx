import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';
import './Work.css';

gsap.registerPlugin(Flip);

const projects = [
  { id: 1, title: 'Ethereal', category: 'E-commerce', year: '2023' },
  { id: 2, title: 'Nova', category: 'Fintech', year: '2024' },
  { id: 3, title: 'Lumina', category: 'Portfolio', year: '2024' },
];

export const Work = () => {
  const containerRef = useRef(null);
  const [activeProject, setActiveProject] = useState(null);

  useGSAP(() => {
    // Only animate if Flip is available and state changes
  }, { dependencies: [activeProject], scope: containerRef });

  const handleProjectClick = (project) => {
    // Get the state before the DOM changes
    const state = Flip.getState('.project-card, .project-detail');

    setActiveProject(activeProject?.id === project.id ? null : project);

    // Wait for React to render the change, then animate
    setTimeout(() => {
      Flip.from(state, {
        duration: 0.8,
        ease: 'power3.inOut',
        absolute: true, // Prevents layout shifting during animation
        onEnter: elements => gsap.fromTo(elements, {opacity: 0}, {opacity: 1, duration: 0.4, delay: 0.4}),
        onLeave: elements => gsap.to(elements, {opacity: 0, duration: 0.4})
      });
    }, 0);
  };

  return (
    <section className="work-section" id="work" ref={containerRef}>
      <div className="container">
        <h2 className="section-title text-center">Selected Works</h2>
        
        <div className="work-grid">
          {projects.map((project) => (
            <div 
              key={project.id}
              className={`project-card interactive ${activeProject?.id === project.id ? 'is-active' : ''}`}
              onClick={() => handleProjectClick(project)}
              data-flip-id={`project-${project.id}`}
            >
              <div className="project-image-placeholder"></div>
              <div className="project-info">
                <h3 className="project-title">{project.title}</h3>
                <span className="project-meta">{project.category} // {project.year}</span>
              </div>
            </div>
          ))}
        </div>

        {/* The Detail View that morphs from the card */}
        {activeProject && (
          <div className="project-detail" onClick={() => handleProjectClick(activeProject)}>
            <div className="project-detail-content" data-flip-id={`project-${activeProject.id}`}>
              <div className="project-detail-image"></div>
              <div className="project-detail-text">
                <h2 className="project-detail-title">{activeProject.title}</h2>
                <p>
                  A deep dive into the {activeProject.category} architecture. This view animates seamlessly
                  from the grid using GSAP Flip plugin. Click anywhere to close.
                </p>
                <button className="btn-primary mt-2">Visit Live Site</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
