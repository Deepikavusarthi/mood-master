import React, { useState } from "react";
import './Nutrition.css';
import { useCreateMoodStore } from "../store/useCreateMoodStore";
const NutritionPage = () => {
  const { createMood, setCreateMood, clearCreateMood } = useCreateMoodStore();
  const [mealType, setMealType] = useState("");
  const [customMealType, setCustomMealType] = useState("");
  const [mealTime, setMealTime] = useState(0);
  const [mealDescription, setMealDescription] = useState("");
  const [meals, setMeals] = useState(createMood?.activities?.filter(activity => activity.name === "Nutrition") || []);
  const [hydration, setHydration] = useState(0);

  const handleAddMeal = () => {
    const existingMeal = createMood?.activities?.find(activity =>  activity.type == mealType);
    if (existingMeal) {
      // alert("Meal already recorded.");
      const updatedMeals = createMood?.activities?.map(activity => activity.type === mealType ? {name:"Nutrition",type: mealType, quantity: parseInt(mealTime), quality: mealDescription, gain:hydration} : activity);
      const newMood = {...createMood, activities: updatedMeals};
      setCreateMood(newMood);
      return;
    }
    else {
      const newMeal = {type: mealType, quantity: parseInt(mealTime), quality: mealDescription, gain:hydration,name:"Nutrition"};
      const newMood = {...createMood, activities: [...createMood?.activities, newMeal]};
      setCreateMood(newMood);
    }

    if (mealType === "Other" && !customMealType) {
      alert("Please enter a custom meal type.");
      return;
    }
    const newMeal = {
      type: mealType === "Other" ? customMealType : mealType,
      quantity: parseInt(mealTime),
      quality: mealDescription,
      gain:hydration,
      name:"Nutrition"
    };
    setMeals([...meals, newMeal]);
    setMealType("");
    setCustomMealType("");
    setMealTime("");
    setMealDescription("");
  };

  const handleEditMeal = (index) => {
    const mealToEdit = meals[index];
    setMealType(mealToEdit.type);
    setMealTime(mealToEdit.quantity);
    setMealDescription(mealToEdit.quality);
    const updatedMeals = meals.filter((_, idx) => idx !== index);
    setMeals(updatedMeals);
    const updatedMood = {...createMood, activities: createMood?.activities?.filter(activity => activity.name !== "Nutrition" || activity.type !== mealToEdit.type)};
    setCreateMood(updatedMood);

  };

  const handleDeleteMeal = (index) => {
    const type = meals[index].type;
    const updatedMeals = meals.filter((_, idx) => idx !== index);
    setMeals(updatedMeals);
    const updatedMood = {...createMood, activities: createMood?.activities?.filter(activity => activity.name !== "Nutrition" || activity.type !== type)};
    setCreateMood(updatedMood);
  };

  const handleHydrationChange = (change) => {
    setHydration(hydration + change);
  };

  return (
    <div className="page-container">
      <h1>Nutrition Tracker</h1>

      {/* Meal Entry Section */}
      <div className="meal-entry">
        <div className="input-section">
          <label>Meal Type:</label>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
          >
            <option value="">Select Meal Type</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
            <option value="Other">Other</option>
          </select>
          {mealType === "Other" && (
            <input
              type="text"
              placeholder="Enter custom meal type"
              value={customMealType}
              onChange={(e) => setCustomMealType(e.target.value)}
            />
          )}
        </div>

        <div className="input-section">
          <label>Meal Quantity:</label>
          <input
            type="number"
            value={mealTime}
            onChange={(e) => setMealTime(e.target.value)}
            className="meal-time-input"
            placeholder="Enter quantity in grams"
          />
        </div>

        <div className="input-section">
          <label>Meal Description:</label>
          <textarea
            placeholder="What did you eat?"
            value={mealDescription}
            onChange={(e) => setMealDescription(e.target.value)}
          ></textarea>
        </div>

        <button onClick={handleAddMeal}>Add Meal</button>
      </div>

        {/* Hydration Tracker */}
    <div className="hydration-tracker">
        <label>Hydration:</label>
        <button onClick={() => handleHydrationChange(-1)}>-</button>
        <span>{hydration}</span>
        <button onClick={() => handleHydrationChange(1)}>+</button>
      </div>

      {/* Recorded Meals Section */}
      <div className="recorded-meals">
        <h2>Recorded Meals</h2>
        {meals.map((meal, index) => (
          <div key={index} className="meal-record">
            <p><strong>{meal.type}</strong> :{meal.quantity}g</p>
            <p>{meal.quality}</p>
            <button onClick={() => handleEditMeal(index)}>Edit</button>
            <button onClick={() => handleDeleteMeal(index)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionPage;