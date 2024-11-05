import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Journal.css';

const JournalPage = () => {
  const [entry, setEntry] = useState("");
  const [dailyPrompt, setDailyPrompt] = useState("");
  const navigate = useNavigate();

  // Array of prompts for each day
  const prompts = [
    "What made you smile today?",
    "What challenges did you face and how did you overcome them?",
    "What are three things you’re grateful for today?",
    "What was the best part of your day?",
    "Did you learn something new today?",
    "How did you practice self-care today?",
    "What is one thing you want to improve tomorrow?",
  ];

  useEffect(() => {
    // Set the daily prompt based on the current date
    const date = new Date();
    const index = date.getDate() % prompts.length; // Cycle through prompts based on the date
    setDailyPrompt(prompts[index]);
  }, []);

  const handleSave = () => {
    // Navigate to the calendar page after saving the entry
    navigate("/calendar");
  };

  return (
    <div className="journal-container">
      <h2>Daily Journal</h2>
      <p className="daily-prompt">{dailyPrompt}</p> {/* Display the daily prompt */}
      <textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        rows="10"
        cols="50"
        placeholder="Write about your day..."
      />
      <button onClick={handleSave}>Save Entry</button>
    </div>
  );
};

export default JournalPage;
