import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateAccount.css'; 

const CreateAccount = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
      
    const navigate = useNavigate();
      
    const handleCreateAccount = () => {
        // Here you can add logic to save the account info or validate
        navigate("/tracker"); // Redirect to tracker page
    };

    const handleLoginClick = () => {
        navigate("/"); // Redirect to home page
    };

  return (
    <div className="create-account-container">
      <h2>Start tracking my mood today!</h2>
      <div>
        <label>First Name:</label>
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </div>
      <div>
        <label>Last Name:</label>
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Phone Number:</label>
        <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
      </div>
      <div>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleCreateAccount}>Create Account</button>
      <div className="existing-user-container">
        <span>Already have an account?</span>
        <span className="login-button" onClick={handleLoginClick}>Login</span>
      </div>
    </div>
  );
};

export default CreateAccount;
