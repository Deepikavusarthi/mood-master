import React, { useState } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();

  // State to hold selected times for notifications
  const [dailyTime, setDailyTime] = useState("09:00");
  const [weeklyTime, setWeeklyTime] = useState("10:00");
  const [communityTime, setCommunityTime] = useState("11:00");

  const handleLogout = () => {
    // Perform any logout logic here (e.g., clearing user session)
    navigate("/"); // Redirect to home page
  };

  return (
    <div className="settings-page">
      <div className="settings-content">
        <div className="settings-left">
          <h3 className="section-header">Account</h3>
          <div className="settings-list">
            <div className="list-item hoverable" onClick={() => navigate("/edit-profile")}>
              Edit Profile &gt;
            </div>
            <div className="list-item hoverable" onClick={() => navigate("/change-password")}>
              Change Password &gt;
            </div>
            <div className="list-item hoverable" onClick={() => navigate("/change-email")}>
              Change Email &gt;
            </div>
          </div>

          <h3 className="section-header">Notification</h3>
          <div className="notification-settings">
            <div className="list-item">
              <span>Daily</span>
              <input
                type="checkbox"
                defaultChecked
                style={{ marginLeft: "10px", marginRight: "10px" }}
              />
              <input
                type="time"
                value={dailyTime}
                onChange={(e) => setDailyTime(e.target.value)}
                className="time-selector"
              />
            </div>
            <div className="list-item">
              <span>Weekly Ins</span>
              <input
                type="checkbox"
                defaultChecked
                style={{ marginLeft: "10px", marginRight: "10px" }}
              />
              <input
                type="time"
                value={weeklyTime}
                onChange={(e) => setWeeklyTime(e.target.value)}
                className="time-selector"
              />
            </div>
            <div className="list-item">
              <span>Community Update</span>
              <input
                type="checkbox"
                defaultChecked
                style={{ marginLeft: "10px", marginRight: "10px" }}
              />
              <input
                type="time"
                value={communityTime}
                onChange={(e) => setCommunityTime(e.target.value)}
                className="time-selector"
              />
            </div>
          </div>

          <h3 className="section-header">Privacy and Security</h3>
          <div className="privacy-settings">
            <div className="list-item">
              <span>Data Sharing</span>
              <input type="checkbox" style={{ marginLeft: "10px" }} />
            </div>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="settings-right">
          <h3 className="achievements-header">Achievements</h3>
          <div className="achievements-list">
            <div className="achievement-item">
              <h4>7-Day Streak</h4>
              <p>Logged your mood for 7 days straight</p>
            </div>
            <div className="achievement-item">
              <h4>Mindfulness Master</h4>
              <p>Completed 10 meditation sessions</p>
            </div>
            <div className="achievement-item">
              <h4>Insight Seeker</h4>
              <p>Reviewed your monthly insights 5 times</p>
            </div>
            <div className="achievement-item">
              <h4>Community Supporter</h4>
              <p>Participated in 3 community discussions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
