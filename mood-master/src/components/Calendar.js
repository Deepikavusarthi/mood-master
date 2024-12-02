import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';
import { useCreateMoodStore } from "../store/useCreateMoodStore";
import { MoodService } from "../apiService/Apis";
import Markdown from 'react-markdown'

const CalendarPage = () => {
  const { createMood } = useCreateMoodStore();
  const [date, setDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(date.getMonth());
  const [journal, setJournal] = useState(createMood.journal[0]?.text || "No journal entry saved yet.");
  const [loading, setLoading] = useState(false);
  const [moodInfo, setMoodInfo] = useState(null);
  const [error, setError] = useState(null);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-CA', {
      year: 'numeric', month: '2-digit', day: '2-digit'
    }).replace(/\//g, '-');
  };

  useEffect(() => {
    const fetchMoodData = async () => {
      setLoading(true);
      setError(null);
      try {
        const localDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          0, 0, 0
        );

        const formattedDate = formatDate(localDate);

        const data = await MoodService.getMoodByDate(formattedDate);

        console.log("Fetched Mood Data:", data);

        if (data) {
          setMoodInfo(data);
        } else {
          setMoodInfo(null);
          setError("No mood data found for this date");
        }
      } catch (error) {
        console.error("Error fetching mood data:", error);
        setError(error.message || "Failed to fetch mood data");
        setMoodInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, [date]);

  useEffect(() => {
    if (moodInfo?.journals) {
      setJournal(moodInfo.journals[0]?.text || "No journal entry saved yet.");
    }
  }, [moodInfo]);

  const handleMonthChange = (monthIndex) => {
    const newDate = new Date(date.getFullYear(), monthIndex, 1);
    setDate(newDate);
    setCurrentMonth(monthIndex);
  };

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return (
    <div className="calendar-container">
      <h3>Let's look at how your wellness journey is going recently!</h3>

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
          <p>{journal}</p>
        </div>
      </div>

      <div className="mood-details">
        <h4>Details for {formatDate(date)}</h4>

        {loading ? (
          <p>Loading...</p>
        ) : error && !moodInfo ? (
          <div className="error-message">
            <p>Error: {error}</p>
          </div>
        ) : moodInfo ? (
          <div className="mood-info-grid">
            {moodInfo.mood_type && (
              <div className="mood-info-item">
                <h5>Mood Type</h5>
                <p>{moodInfo.mood_type}</p>
              </div>
            )}

            {moodInfo.activities && moodInfo.activities.length > 0 && (
              <div className="mood-info-item">
                <h5>Activities</h5>
                {moodInfo.activities.map((activity, index) => (
                  <div key={index} className="activity-item">
                    {activity.name && (
                      <span className="activity-tag">{activity.name } Type: {activity.type} </span>
                    )}
                   
                    {activity.quantity && (
                      <span className="activity-tag">
                        Qty: {activity.quantity}
                      </span>
                    )}
                    {activity.duration && (
                      <span className="activity-tag">
                        Duration: {activity.duration}
                      </span>
                    )}
                    {activity.quality && (
                      <span className="activity-tag">
                        Quality: {activity.quality}
                      </span>
                    )}
                    {activity.gain && (
                      <span className="activity-tag">
                        Gain: {activity.gain}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {moodInfo.reward && (
              <div className="mood-info-item">
                <h5>Reward</h5>
                {moodInfo.reward.journal && (
                  <p>Journal: {moodInfo.reward.journal}</p>
                )}
                {moodInfo.reward.strike && (
                  <p>Strike: {moodInfo.reward.strike}</p>
                )}
                {moodInfo.reward.activity && (
                  <p>Activity: {moodInfo.reward.activity}</p>
                )}
              </div>
            )}

            {moodInfo.ai_insights && (
              <div className="mood-info-item insight-box">
                <div className="insight-header">
                  <span className="hollow-heart-icon">♡</span>
                  <h5>AI Insight</h5>
                </div>
                <div className="insight-content">
                  <Markdown>{moodInfo.ai_insights}</Markdown>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p>No mood data available for this date</p>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;