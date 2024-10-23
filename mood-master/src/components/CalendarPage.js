// components/CalendarPage.js
import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const moodData = {
    // Placeholder data for mood/activity tracking
    '2024-10-20': { mood: '🙂', activities: 'Sleep, Exercise' },
    '2024-10-21': { mood: '😢', activities: 'Sleep' }
  };

  const formattedDate = date.toISOString().split('T')[0];
  const moodInfo = moodData[formattedDate] || { mood: 'No data', activities: 'No data' };

  return (
    <div>
      <h2>Calendar</h2>
      <Calendar onChange={setDate} value={date} />
      <div>
        <h3>Details for {formattedDate}</h3>
        <p>Mood: {moodInfo.mood}</p>
        <p>Activities: {moodInfo.activities}</p>
      </div>
    </div>
  );
};

export default CalendarPage;
