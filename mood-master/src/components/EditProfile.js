import React, { useState } from "react";
import "./Settings.css";

const EditProfile = () => {
  const [username, setUsername] = useState("user123");
  const [email, setEmail] = useState("user@example.com");

  const handleSave = () => {
    // Logic to save updated username/email
    alert("Profile updated successfully!");
  };

  return (
    <div className="settings-page">
      <h2>Edit Profile</h2>
      <div className="settings-form">
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button className="save-button" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
