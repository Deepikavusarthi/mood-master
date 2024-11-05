import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import logo from './images/logo.png';

const Navbar = () => {
  const location = useLocation(); // Get the current location

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container">
        <NavLink to="/" className="navbar-brand">
          <img src={logo} alt="Mood Tracker Logo" className="navbar-logo" />
        </NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" exact to="/" activeClassName="active">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={`nav-link ${
                  location.pathname.startsWith('/tracker') ||
                  ['/sleep', '/exercise', '/nutrition', '/self-care'].includes(location.pathname)
                    ? 'active'
                    : ''
                }`}
                to="/tracker"
              >
                Tracker
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/journal" activeClassName="active">Journal</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/calendar" activeClassName="active">Mood Analysis</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/profile" activeClassName="active">Profile</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
