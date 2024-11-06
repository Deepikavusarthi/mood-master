import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from './images/logo.png';
import './Login.css';

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleCreateAccountClick = () => {
    navigate('/create-account'); // Change the route as needed
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic here
    navigate("/tracker");  // Navigate to tracker page after login
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Mood Tracker Logo" className="login-logo" />
      <p>The best place to start your mental health journey!</p>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
      <div className="new-user-container">
        <p className="new-user-text">New User?</p>
        <button className="create-account-button" onClick={handleCreateAccountClick}>
          Create Account
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
