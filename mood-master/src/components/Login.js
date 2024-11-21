import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from './images/logo.png';
import './Login.css';
import { UserService } from "../apiService/Apis";
import { setToken } from "../utils/LocalStorage";
import { ToastContainer, toast } from 'react-toastify';
const LoginPage = () => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateAccountClick = () => {
    navigate('/create-account'); // Change the route as needed
  };

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error('Please fill in all required fields.');
      return;
    }
    // Handle login logic here
    setIsLoading(true);
    try {
      const data = await UserService.login({ username, password });
      await setToken('access_token', data.access_token);
      await setToken('refresh_token', data.refresh_token);
      toast.success('Login successful!');
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error?.data?.detail || 'Oops! Something went wrong while logging in!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <img src={logo} alt="Mood Tracker Logo" className="login-logo" />
      <p>The best place to start your mental health journey</p>
      <div className="">
        <div className="input-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username or email"
            value={username}
            required
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
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="login-button"  onClick={handleLogin} disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
      </div>
      <div className="new-user-container">
        <p>New User?</p>
        <button className="create-account-button" onClick={handleCreateAccountClick}>
          Create Account</button>
      </div>
    </div>
  );
};

export default LoginPage;