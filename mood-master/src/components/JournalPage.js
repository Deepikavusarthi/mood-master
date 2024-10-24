// components/JournalPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './JournalPage.css';

const JournalPage = () => {
  const [entry, setEntry] = useState("");
  const navigate = useNavigate(); 

  const handleSave = () => {
    
    navigate("/calendar"); 
  };

  return (
    <div className="journal-container">
      <h2>Daily Journal</h2>
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
