import React, { useState } from "react";
import "./Settings.css";

const ChangeEmail = () => {
  const [newEmail, setNewEmail] = useState("");

  const handleSave = () => {
    // Logic to save updated email
    alert("Email updated successfully!");
  };

  return (
    <div className="settings-page">
      <h2>Change Email</h2>
      <div className="settings-form">
        <label>
          New Email:
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </label>
        <button className="save-button" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ChangeEmail;
