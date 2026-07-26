import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import './Home.css';

export const Home = () => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  // useMemo example
  const expensiveCalculation = useMemo(() => {
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += i;
    }
    return result;
  }, []);

  // useCallback example
  const handleIncrement = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  // useEffect example
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="home-page animate-fade-in container">
      <header className="hero-section">
        <h1 className="hero-title">
          Mastering <span className="text-gradient">React Features</span>
        </h1>
        <p className="hero-subtitle">
          A comprehensive showcase of Hooks, Context, Routing, and Modern UI design.
        </p>
      </header>

      <section className="features-grid">
        <Card title="useState & useCallback" footer={<span className="text-small">Re-renders optimized</span>}>
          <div className="counter-demo">
            <p className="counter-value">{count}</p>
            <Button onClick={handleIncrement}>Increment Counter</Button>
          </div>
        </Card>

        <Card title="useRef & useEffect" footer={<span className="text-small">DOM manipulation & lifecycle</span>}>
          <div className="input-demo">
            <label htmlFor="focusInput">Auto-focused Input</label>
            <input 
              id="focusInput"
              ref={inputRef} 
              type="text" 
              className="custom-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type something..."
            />
            <p>You typed: {text}</p>
          </div>
        </Card>

        <Card title="useMemo" footer={<span className="text-small">Expensive calc cached</span>}>
          <div className="memo-demo">
            <p>The sum of 1 million numbers is:</p>
            <p className="memo-value text-gradient">{expensiveCalculation}</p>
            <p className="text-secondary mt-2">This value won't recalculate on re-renders.</p>
          </div>
        </Card>
      </section>
    </div>
  );
};
