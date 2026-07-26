import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { Sun, Moon, Home, LayoutDashboard } from 'lucide-react';
import './Navbar.css';

export const Navbar = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="navbar glass">
      <div className="container nav-content">
        <div className="nav-brand">
          <span className="text-gradient">ReactMastery</span>
        </div>
        
        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
              <Home size={18} />
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
          </li>
        </ul>

        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};
