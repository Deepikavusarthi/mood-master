import React, { useState } from "react";
import './Sleep.css';

const SleepPage = () => {
const [hoursSlept, setHoursSlept] = useState("");
  const [sleepQuality, setSleepQuality] = useState("");

  const handleQualityChange = (e) => {
    setSleepQuality(e.target.value);
  };

  return (
    <div className="page-container">
      <h1>Sleep Tracker</h1>
      <div className="input-section">
        <p>How many hours did you sleep last night?</p>
        <label>Hours Slept:</label>
        <input
          type="number"
          value={hoursSlept}
          onChange={(e) => setHoursSlept(e.target.value)}
          placeholder="Enter hours"
        />
      </div>
      <div className="input-section">
        <p>How well did you sleep?</p>
        <select value={sleepQuality} onChange={handleQualityChange}>
          <option value="">Select Quality</option>
          <option value="Excellent">Excellent</option>
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
          <option value="Poor">Poor</option>
        </select>
      </div>
    </div>
  );
};

export default SleepPage;
