import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Journal.css';
import { useCreateMoodStore } from "../store/useCreateMoodStore";
import { MoodService } from "../apiService/Apis";
import { toast,ToastContainer } from "react-toastify";
const JournalPage = () => {
  const { createMood, setCreateMood, clearCreateMood } = useCreateMoodStore();
  const [entry, setEntry] = useState(createMood?.journal[0]?.text || "");
  const [dailyPrompt, setDailyPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSave = async() => {
    // Navigate to the calendar page after saving the entry
      try{
      setIsLoading(true);
      const res = await MoodService.createMood(createMood);
      console.log(res);
      toast.success("Entry saved successfully");
      // navigate("/calendar");
    }catch(error){
      toast.error("Error saving entry");
      console.error("Error navigating to calendar:", error);
    }finally{
      setIsLoading(false);
    }
  };
  const handleEntryChange = (e) => {
    setEntry(e.target.value);
    setCreateMood({ ...createMood, journal: [{ text: e.target.value }] });
  };
  return (
    <div className="journal-container">
      <ToastContainer />
      <h2>Daily Journal</h2>
      <p className="daily-prompt">{dailyPrompt}</p> {/* Display the daily prompt */}
      <textarea
        value={entry}
        onChange={handleEntryChange}
        rows="10"
        cols="50"
        placeholder="Write about your day..."
      />
      <button onClick={handleSave} disabled={isLoading}>{isLoading ? "Saving..." : "Save Entry"}</button>
    </div>
  );
};

export default JournalPage;
