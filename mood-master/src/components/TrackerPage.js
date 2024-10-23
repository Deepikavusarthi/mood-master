// components/TrackerPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TrackerPage = () => {
  const [mood, setMood] = useState(null);
  const navigate = useNavigate();

  const handleJournalClick = () => {
    navigate("/journal");
  };

  return (
    <div>
      <h2>How is your mood today?</h2>
      <div>
        <button onClick={() => setMood("😢")}>😢</button>
        <button onClick={() => setMood("🙁")}>🙁</button>
        <button onClick={() => setMood("😐")}>😐</button>
        <button onClick={() => setMood("🙂")}>🙂</button>
        <button onClick={() => setMood("😄")}>😄</button>
      </div>
      <div>
        <h3>Track Activities</h3>
        <button>Track Sleep</button>
        <button>Track Exercise</button>
      </div>
      <button onClick={handleJournalClick}>Daily Journal</button>
    </div>
  );
};

export default TrackerPage;
