import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '/Users/varshachintalapati/mood-master/src/components/images/logo.png';
import './Login.css';

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // Handle login logic here
    navigate("/tracker");  // Navigate to tracker page after login
  };

  return (
    <div className="login-container">
    <img src={logo} alt="Mood Tracker Logo" className="login-logo" />
    <p>The best place to start your mental health journey</p>
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
    <button type="submit">Login</button>
  </form>
      <h5>New User? <Link to="/register">Create an Account</Link></h5>
    </div>
  );
};

export default LoginPage;
