import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Tracker.css';

const TrackerPage = () => {
  const [mood, setMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Calculate and set the average mood when moodHistory updates
    if (moodHistory.length > 0) {
      const averageMood = calculateAverageMood(moodHistory);
      document.getElementById('arrow').style.left = `${averageMood}%`;
    }
  }, [moodHistory]);

  const handleMoodClick = (selectedMood, moodValue) => {
    setMood(selectedMood);
    setMoodHistory((prev) => [...prev, moodValue]); // Store numeric mood value
  };

  const calculateAverageMood = (history) => {
    const total = history.reduce((acc, curr) => acc + curr, 0);
    return (total / history.length) * 20; // Scale to a percentage (20% per mood step)
  };

  const handleNavigate = (path) => {
    navigate(path); // Navigate to other activity pages
  };

  const handleJournalClick = () => {
    navigate("/journal");
  };

  return (
    <div className="tracker-container">
      <h1>Track Your Activities</h1>
      <div className="mood-buttons">
        <button className="emoji red-emoji" onClick={() => handleMoodClick("😢", 1)}>😢</button>
        <button className="emoji orange-emoji" onClick={() => handleMoodClick("🙁", 2)}>🙁</button>
        <button className="emoji yellow-emoji" onClick={() => handleMoodClick("😐", 3)}>😐</button>
        <button className="emoji green-emoji" onClick={() => handleMoodClick("🙂", 4)}>🙂</button>
        <button className="emoji darkgreen-emoji" onClick={() => handleMoodClick("😄", 5)}>😄</button>
      </div>
      <div className="mood-bar">
        <div className="mood-gradient">
          <div id="arrow">▲</div> {/* Arrow that points to the average */}
        </div>
      </div>
      
      <div className="activity-buttons">
        <button className="activity-btn" onClick={() => handleNavigate("/sleep")}>Sleep</button>
        <button className="activity-btn" onClick={() => handleNavigate("/exercise")}>Exercise</button>
        <button className="activity-btn" onClick={() => handleNavigate("/nutrition")}>Nutrition</button>
        <button className="activity-btn" onClick={() => handleNavigate("/self-care")}>Self-Care</button>
      </div>

      <button className="journal-btn" onClick={handleJournalClick}>Daily Journal</button>

      {/* AI Insight Section */}
      <div className="insight-box">
        <div className="insight-header">
          <span className="hollow-heart-icon">♡</span>
          <h3>AI Insight</h3>
        </div>
        {/* Placeholder for future AI content */}
        <div className="insight-content">
          {aiInsight || "Select a mood to see insights"}
        </div>
      </div>
    </div>
  );
};

export default TrackerPage;
