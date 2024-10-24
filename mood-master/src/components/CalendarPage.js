import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import './CalendarPage.css'; 

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(date.getMonth());
  

  //placeholder data
  const moodData = {
    '2024-10-20': { mood: '🙂', activities: 'Sleep, Exercise' },
    '2024-10-21': { mood: '😢', activities: 'Sleep' }
  };

  const handleMonthChange = (monthIndex) => {
    const newDate = new Date(date.getFullYear(), monthIndex, 1);
    setDate(newDate);
    setCurrentMonth(monthIndex);
  };

  const formattedDate = date.toISOString().split('T')[0];
  const moodInfo = moodData[formattedDate] || { mood: 'No data', activities: 'No data' };


  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return (
    <div className="calendar-container">
      <h2>Calendar</h2>
      <h5>Lets look how your wellness journey recently!</h5>
      <div className="month-links">
        {months.map((month, index) => (
          <span 
            key={index} 
            className={`month-link ${currentMonth === index ? 'active' : ''}`}
            onClick={() => handleMonthChange(index)}
          >
            {month}
          </span>
        ))}
      </div>
      <div className="calendar-journal-container">
        <div className="calendar">
          <Calendar 
            onChange={setDate} 
            value={date} 
            view="month"
          />
        </div>
        <div className="journal-entry-box">
          <h3>Journal Entry</h3>
          <p>No journal entry saved yet.</p>
          {/* The journal entry will be displayed here later */}
        </div>
      </div>
      <div className="mood-details">
        <h3>Details for {formattedDate}</h3>
        <p>Mood: {moodInfo.mood}</p>
        <p>Activities: {moodInfo.activities}</p>
      </div>
    </div>
  );
};

export default CalendarPage;
