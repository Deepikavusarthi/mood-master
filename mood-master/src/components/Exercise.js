import React, { useState } from "react";
import './Exercise.css';

const ExercisePage = () => {
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState({
    type: "",
    intensity: "",
    duration: "",
  });
  const [stepsWalked, setStepsWalked] = useState("");
  const [journalEntry, setJournalEntry] = useState("");

  const handleAddExercise = () => {
    const exerciseType = currentExercise.type === "Other" ? currentExercise.customType : currentExercise.type;

    if (exerciseType && currentExercise.intensity && currentExercise.duration) {
      setExercises([...exercises, { 
        type: exerciseType, 
        intensity: currentExercise.intensity, 
        duration: currentExercise.duration 
      }]);
      setCurrentExercise({ type: "", intensity: "", duration: "", customType: "" }); // Reset current exercise fields
    }
  };

  const handleExerciseChange = (field, value) => {
    setCurrentExercise({ ...currentExercise, [field]: value });
  };

  const handleDeleteExercise = (id) => {
    setExercises(exercises.filter((exercise) => exercise.id !== id));
  };

  const handleEditExercise = (id) => {
    const exerciseToEdit = exercises.find((exercise) => exercise.id === id);
    setCurrentExercise({
      type: exerciseToEdit.type === "Other" ? "Other" : exerciseToEdit.type,
      customType: exerciseToEdit.type === "Other" ? exerciseToEdit.type : "",
      intensity: exerciseToEdit.intensity,
      duration: exerciseToEdit.duration,
    });
    setExercises(exercises.filter((exercise) => exercise.id !== id));
  };

  return (
    <div className="page-container">
      <h1>Exercise Tracker</h1>

      {/* Add Exercise Section */}
      <div className="exercise-entry">
        <label>Choose Exercise:</label>
        <select
          value={currentExercise.type}
          onChange={(e) => handleExerciseChange("type", e.target.value)}
        >
          <option value="">Select Exercise</option>
          <option value="Running">Running</option>
          <option value="Strength Training">Strength Training</option>
          <option value="Hiking">Hiking</option>
          <option value="Walking">Walking</option>
          <option value="Cycling">Cycling</option>
          <option value="Swimming">Swimming</option>
          <option value="Kickboxing">Kickboxing</option>
          <option value="Yoga">Yoga</option>
          <option value="Pilates">Pilates</option>
          <option value="Other">Other...</option>
        </select>
        {currentExercise.type === "Other" && (
          <input
            type="text"
            placeholder="Enter exercise type"
            value={currentExercise.customType || ""}
            onChange={(e) => handleExerciseChange("customType", e.target.value)}
          />
        )}
        <label>Intensity:</label>
        <select
          value={currentExercise.intensity}
          onChange={(e) => handleExerciseChange("intensity", e.target.value)}
        >
          <option value="">Select Intensity</option>
          <option value="Low">Low</option>
          <option value="Moderate">Moderate</option>
          <option value="High">High</option>
        </select>
        <label>Duration (minutes):</label>
        <input
          type="number"
          placeholder="Enter duration"
          value={currentExercise.duration}
          onChange={(e) => handleExerciseChange("duration", e.target.value)}
        />
        <button onClick={handleAddExercise}>Add Exercise</button>
      </div>

      {/* Steps Tracker */}
      <div className="input-section">
        <label>Total Steps Walked:</label>
        <input
          type="number"
          value={stepsWalked}
          onChange={(e) => setStepsWalked(e.target.value)}
          placeholder="Enter steps"
        />
        {/* <button onClick={() => alert("Steps submitted!")}>Submit Steps</button> */}
      </div>

      {/* Journal Entry */}
      <div className="journal-entry">
        <p>How did you feel before and after the exercises?</p>
        <textarea
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          placeholder="Write your thoughts here..."
        ></textarea>
        {/* <button onClick={() => alert("Journal entry submitted!")}>Submit Journal</button> */}
      </div>

      {/* Display Exercises */}
      <div className="exercise-list">
        <h2>Recorded Exercises</h2>
        {exercises.map((exercise, index) => (
          <div key={index} className="exercise-box">
            <h3>{exercise.type}</h3>
            <p><strong>Intensity:</strong> {exercise.intensity}</p>
            <p><strong>Duration:</strong> {exercise.duration} minutes</p>
            <button onClick={() => handleEditExercise(exercise.id)}>Edit</button>
            <button onClick={() => handleDeleteExercise(exercise.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExercisePage;
