import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateAccount.css'; 
import { UserService } from '../apiService/Apis';
import { setToken } from '../utils/LocalStorage';
import { ToastContainer, toast } from 'react-toastify';
const CreateAccount = () => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
      
    const navigate = useNavigate();
      
    const handleCreateAccount = async (e) => {
        if (!firstName || !email || !username || !password) {
            toast.error('Please fill in all required fields.');
            return;
        }
        e.preventDefault();
        setIsLoading(true);
        // Here you can add logic to save the account info or validate
        try {
            const response = await UserService.createUser({ fname:firstName, lname:lastName, email, phone:phoneNumber, username, password });
            await setToken('access_token', response.access_token);
            await setToken('refresh_token', response.refresh_token);
            navigate("/"); // Redirect to tracker page
            toast.success('Account created successfully!');
        } catch (error) {
            console.error("Error creating account:", error);
            toast.error('Oops! Something went wrong while creating account!');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginClick = () => {
        navigate("/login"); // Redirect to home page
    };

  return (
    <div className="create-account-container">
      <ToastContainer />
      <h2>Start tracking my mood today!</h2>
      <div>
        <label>First Name:</label>
        <input type="text" required  value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </div>
      <div>
        <label>Last Name:</label>
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Phone Number:</label>
        <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
      </div>
      <div>
        <label>Username:</label>
        <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleCreateAccount} disabled={isLoading}>{isLoading ? 'Creating account...' : 'Create Account'}</button>
      <div className="existing-user-container">
        <span>Already have an account?</span>
        <span className="login-button" onClick={handleLoginClick}>Login</span>
      </div>
    </div>
  );
};

export default CreateAccount;
