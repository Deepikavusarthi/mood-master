import React, { useState, useEffect } from "react";
import './Sleep.css';
import { useCreateMoodStore } from "../store/useCreateMoodStore";
const SleepPage = () => {
  const { createMood, setCreateMood, clearCreateMood } = useCreateMoodStore();
const [hoursSlept, setHoursSlept] = useState(createMood?.activities?.find(activity => activity.name === "Sleep")?.duration || 0);
  const [sleepQuality, setSleepQuality] = useState(createMood?.activities?.find(activity => activity.name === "Sleep")?.quality || "");

  // useEffect(() => {
  //   // console.log(hoursSlept);
  //   // const existingSleepActivity = createMood?.activities?.find(activity => activity.name === "Sleep");

  //   // if (existingSleepActivity) {
  //   //   const newMood = {...createMood, activities: createMood?.activities?.map(activity => activity.name === "Sleep" ? {name: "Sleep", duration: hoursSlept, type: "Sleep", quality: sleepQuality} : activity)};
  //   //   setCreateMood(newMood);
          
  //   // } else {
  //   //   const newMood = {...createMood, activities: [...createMood?.activities, {name: "Sleep", duration: hoursSlept, type: "Sleep", quality: sleepQuality}]};
  //   //   setCreateMood(newMood);
  //   // }
  // }, [hoursSlept,sleepQuality]);
  console.log(createMood);

  const handleQualityChange = (e) => {
    const value = e.target.value;
    setSleepQuality(value);
    const existingSleepActivity = createMood?.activities?.find(activity => activity.name === "Sleep");

    if (existingSleepActivity) {
      const newMood = {...createMood, activities: createMood?.activities?.map(activity => activity.name === "Sleep" ? {name: "Sleep", duration: hoursSlept, type: "Sleep", quality: value} : activity)};
      setCreateMood(newMood);
          
    } else {
      const newMood = {...createMood, activities: [...createMood?.activities, {name: "Sleep", duration: hoursSlept, type: "Sleep", quality: value}]};
      setCreateMood(newMood);
    }

  };

  const handleHoursSleptChange = (e) => { 
    const value = parseInt(e.target.value);
    setHoursSlept(value);
    const existingSleepActivity = createMood?.activities?.find(activity => activity.name === "Sleep");

    if (existingSleepActivity) {
      const newMood = {...createMood, activities: createMood?.activities?.map(activity => activity.name === "Sleep" ? {name: "Sleep", duration: value, type: "Sleep", quality: sleepQuality} : activity)};
      setCreateMood(newMood);
    } else {
      const newMood = {...createMood, activities: [...createMood?.activities, {name: "Sleep", duration: value, type: "Sleep", quality: sleepQuality}]};
      setCreateMood(newMood);
    }
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
          onChange={handleHoursSleptChange}
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