import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Laugh, Smile, Meh, Frown, Angry,
} from 'lucide-react';
import './Tracker.css';
import { useCreateMoodStore } from "../store/useCreateMoodStore";
import { MoodService } from "../apiService/Apis";

const MOOD_CONFIG = [
  { icon: Angry, label: "Angry", value: 1, emoji: "😠" },
  { icon: Frown, label: "Frown", value: 2, emoji: "😔" },
  { icon: Meh, label: "Meh", value: 3, emoji: "😐" },
  { icon: Smile, label: "Smile", value: 4, emoji: "😊" },
  { icon: Laugh, label: "Laugh", value: 5, emoji: "😄" }
];

const TrackerPage = () => {
  const { createMood, setCreateMood, clearCreateMood } = useCreateMoodStore();
  const [mood, setMood] = useState(MOOD_CONFIG.find(m => m.label === createMood?.mood_type)?.value || null);
  const [moodHistory, setMoodHistory] = useState([]);
  const [aiInsight, setAiInsight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  console.log(createMood);
  useEffect(() => {
    if (mood !== null) {
      const position = ((mood - 1) * 80);
      const arrowContainer = document.getElementById('arrow-container');
      if (arrowContainer) {
        arrowContainer.style.left = `${5+position}px`;
        // Add and remove active class to trigger animation
        arrowContainer.classList.add('active');
        setTimeout(() => {
          arrowContainer.classList.remove('active');
        }, 500);
      }
    }
  }, [mood]);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-CA', {
      year: 'numeric', month: '2-digit', day: '2-digit'
    }).replace(/\//g, '-');
  };

  useEffect(() => {
    const fetchYesterdayMoodData = async () => {
      setLoading(true);
      setError(null);
      try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1); // Subtract 1 day to get yesterday's date

        const formattedYesterdayDate = formatDate(yesterday);

        const data = await MoodService.getMoodByDate(formattedYesterdayDate);

        console.log("Fetched Yesterday's Mood Data:", data);

        if (data) {
          setAiInsight(data[2]);
        } else {
          setAiInsight(null);
          setError("No mood data found for yesterday");
        }
      } catch (error) {
        console.error("Error fetching yesterday's mood data:", error);
        setError(error.message || "Failed to fetch yesterday's mood data");
        setAiInsight(null);
      } finally {
        setLoading(false);
      }
    };

    fetchYesterdayMoodData();
  }, []);


  const handleMoodClick = (selectedMood, moodValue) => {
    setMood(moodValue);
    const existingMood = createMood?.mood_type;
    if (existingMood !== selectedMood) {
      const newMood = {...createMood, mood_type: selectedMood};
      setCreateMood(newMood);
    }
    setMoodHistory((prev) => [...prev, moodValue]);
  };

  const getMoodEmoji = (moodValue) => {
    const mood = MOOD_CONFIG.find(m => m.value === moodValue);
    return mood ? mood.emoji : "";
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="tracker-container">
      <h1>Track Your Activities</h1>
      
      <div className="mood-buttons">
        {MOOD_CONFIG.map(({ icon: Icon, label, value }) => (
          <div key={label} className="mood-button-wrapper">
            <button
              className="mood-button"
              data-mood={label}
              onClick={() => handleMoodClick(label, value)}
            >
              <Icon size={32} />
            </button>
            <span className="mood-label">{label}</span>
          </div>
        ))}
      </div>

      <div className="mood-bar">
        <div className="mood-gradient">
          <div id="arrow-container" className="arrow-container">
                {mood ? 
            <div className="mood-arrow">
              <span className="mood-indicator">
                {getMoodEmoji(mood)} 
              </span>
            </div>
            : ""}
          </div>
        </div>
      </div>

      {/* Rest of the component remains the same */}
      <div className="activity-buttons">
        {["Sleep", "Exercise", "Nutrition"].map((activity) => (
          <button
            key={activity}
            className="activity-btn"
            onClick={() => handleNavigate(`/${activity.toLowerCase()}`)}
          >
            {activity}
          </button>
        ))}
      </div>

      <button
        className="journal-btn"
        onClick={() => handleNavigate("/journal")}
      >
        Daily Journal
      </button>

      <div className="insight-box">
        <div className="insight-header">
          <span className="hollow-heart-icon">♡</span>
          <h3>AI Insight</h3>
          <p className="insight-subtext">It's on the basis of your previous day's mood</p>
        </div>

        <div className="insight-content">
          {aiInsight || "No insights available"}
        </div>
      </div>
        <p onClick={()=>clearCreateMood()} className="clear-btn">Clear Today's Entries</p>
    </div>
  );
};

export default TrackerPage;