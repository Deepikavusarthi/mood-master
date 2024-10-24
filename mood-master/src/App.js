import logo from './logo.svg';
import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "./components/Login";
import Tracker from "./components/Tracker";
import Journal from "./components/Journal";
import Calendar from "./components/Calendar";
import Profile from "./components/Profile";
import CreateAccount from './components/CreateAccount'; 
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
    <div className="App">
      <header className="App-header">
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-account" element={<CreateAccount />} />
        </Routes>
      </header>
    </div>
    </Router>
  );
}

export default App;
