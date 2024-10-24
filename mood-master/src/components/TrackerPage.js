import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './TrackerPage.css';

const TrackerPage = () => {
  const [mood, setMood] = useState(null);
  const navigate = useNavigate();

  const handleJournalClick = () => {
    navigate("/journal");
  };

  const handleNavigate = (path) => {
    // Function to navigate to other activity pages
    // these other pages still need to be set up
    navigate(path); 
  };

  return (
    <div className="tracker-container">
      <h1>Track Your Activites</h1>
      <h2>How is your mood today?</h2>
      <div className="mood-buttons">
        <button className="red-emoji" onClick={() => setMood("😢")}>😢</button>
        <button className="orange-emoji" onClick={() => setMood("🙁")}>🙁</button>
        <button className="yellow-emoji" onClick={() => setMood("😐")}>😐</button>
        <button className="green-emoji" onClick={() => setMood("🙂")}>🙂</button>
        <button className="darkgreen-emoji" onClick={() => setMood("😄")}>😄</button>
      </div>
      <div className="activity-buttons">
        <h3>Track Activities</h3>
        <button className="activity-btn" onClick={() => handleNavigate("/sleep")}>Sleep</button>
        <button className="activity-btn" onClick={() => handleNavigate("/exercise")}>Exercise</button>
        <button className="activity-btn" onClick={() => handleNavigate("/nutrition")}>Nutrition</button>
        <button className="activity-btn" onClick={() => handleNavigate("/self-care")}>Self-Care</button>
      </div>
      <button className="journal-btn" onClick={handleJournalClick}>Daily Journal</button>
    </div>
  );
};

export default TrackerPage;
