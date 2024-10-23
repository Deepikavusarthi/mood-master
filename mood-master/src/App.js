import logo from './logo.svg';
import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import TrackerPage from "./components/TrackerPage";
import JournalPage from "./components/JournalPage";
import CalendarPage from "./components/CalendarPage";
import ProfilePage from "./components/ProfilePage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
    <div className="App">
      <header className="App-header">
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </header>
    </div>
    </Router>
  );
}

export default App;
