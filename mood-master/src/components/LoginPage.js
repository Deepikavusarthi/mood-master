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
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>Don't have an account? <Link to="/register">Create an Account</Link></p>
    </div>
  );
};

export default LoginPage;
