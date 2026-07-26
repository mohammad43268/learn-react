import React, { useRef, useEffect } from 'react';

/**
 * A custom SplitText utility to replicate GSAP's premium SplitText behavior.
 * Splits text into words and characters, wrapping them in spans.
 */
export const SplitText = ({ text, className = '' }) => {
  if (typeof text !== 'string') return <span className={className}>{text}</span>;

  const words = text.split(' ');

  return (
    <span className={`split-text ${className}`} style={{ display: 'inline-block' }}>
      {words.map((word, wordIndex) => (
        <span 
          key={wordIndex} 
          className="word" 
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {word.split('').map((char, charIndex) => (
            <span 
              key={charIndex} 
              className="char gsap-reveal" 
              style={{ display: 'inline-block' }}
            >
              {char}
            </span>
          ))}
          {/* Add space after word unless it's the last word */}
          {wordIndex !== words.length - 1 && <span className="char space"> </span>}
        </span>
      ))}
    </span>
  );
};
