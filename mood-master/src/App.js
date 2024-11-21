import logo from './logo.svg';
import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "./components/Login";
import Tracker from "./components/Tracker";
import Journal from "./components/Journal";
import Calendar from "./components/Calendar";
import SettingsView from "./components/Settings";
import Profile from "./components/Profile";
import CreateAccount from './components/CreateAccount'; 
import Navbar from "./components/Navbar";
import Sleep from './components/Sleep';
import Exercise from './components/Exercise';
import Nutrition from './components/Nutrition';
import ProtectedRoute from './ProtectedRoute';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
    <div className="App">
      <header className="App-header">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />

          <Route path="/" element={<ProtectedRoute><Tracker /></ProtectedRoute>} />
          <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsView /></ProtectedRoute>} />
          <Route path="/sleep" element={<ProtectedRoute><Sleep /></ProtectedRoute>} />
          <Route path="/exercise" element={<ProtectedRoute><Exercise /></ProtectedRoute>} />
          <Route path="/nutrition" element={<ProtectedRoute><Nutrition /></ProtectedRoute>} />
        </Routes>
      </header>
    </div>
    </Router>
  );
}

export default App;
