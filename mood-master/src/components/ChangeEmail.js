import React, { useState } from "react";
import "./Settings.css";

const ChangeEmail = () => {
  const [newEmail, setNewEmail] = useState("");

  const handleSave = () => {
    alert("Email updated successfully!");
  };

  return (
    <div className="settings-page">
      <div className="settings-box">
        <h2 className="settings-title">Change Email</h2>
        <div className="settings-form">
          <label className="settings-label">
            New Email:
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
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

export default ChangeEmail;
