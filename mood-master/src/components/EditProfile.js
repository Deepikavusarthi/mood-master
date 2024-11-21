import React, { useState } from "react";
import "./Settings.css";

const EditProfile = () => {
  const [username, setUsername] = useState("user123");
  const [email, setEmail] = useState("user@example.com");

  const handleSave = () => {
    alert("Profile updated successfully!");
  };

  return (
    <div className="settings-page">
      <div className="settings-box">
        <h2 className="settings-title">Edit Profile</h2>
        <div className="settings-form">
          <label className="settings-label">
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="settings-input"
            />
          </label>
          <label className="settings-label">
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="settings-input"
            />
          </label>
          <button className="save-button" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
