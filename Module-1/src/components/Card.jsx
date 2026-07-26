import React from 'react';
import './Card.css';

export const Card = ({ children, className = '', title, footer }) => {
  return (
    <div className={`card glass animate-fade-in ${className}`}>
      {title && <div className="card-header"><h3 className="card-title text-gradient">{title}</h3></div>}
      <div className="card-body">
        {children}
      </div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};
