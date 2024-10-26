import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import logo from './images/logo.png';

const Navbar = () => {
  const location = useLocation();

  const getLinkStyle = (path) => {
    return location.pathname === path ? { color: '#C76C98' } : { color: '#632B6C' };
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link to="/">
          <img src={logo} alt="Mood Tracker Logo" className="navbar-logo" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/" style={getLinkStyle('/')}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tracker" style={getLinkStyle('/tracker')}>Tracker</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/journal" style={getLinkStyle('/journal')}>Journal</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/calendar" style={getLinkStyle('/calendar')}>Mood Analysis</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profile" style={getLinkStyle('/profile')}>Profile</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
