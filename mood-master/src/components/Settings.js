import React, { useState } from 'react';
import { 
  Bell, Lock, Shield, Award, ChevronRight, User, Mail, Phone, 
  Moon, Sun, LogOut, Trash2, Clock
} from 'lucide-react';
import './Settings.css';
import { Link, useNavigate } from 'react-router-dom';

const SettingsView = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [dataSharing, setDataSharing] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    dailyReminder: { enabled: true, time: '20:00' },
    weeklyInsights: { enabled: true, time: '10:00', day: 'Monday' },
    communityUpdates: { enabled: false, time: '12:00' }
  });

  const handleNotificationChange = (setting, field, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: {
        ...prev[setting],
        [field]: value
      }
    }));
  };

  const achievements = [
    { icon: Award, color: '#EAB308', title: '7-Day Streak', description: 'Logged your mood for 7 days straight' },
    { icon: Award, color: '#3B82F6', title: 'Mindfulness Master', description: 'Completed 10 meditation sessions' },
    { icon: Award, color: '#22C55E', title: 'Insight Seeker', description: 'Reviewed your monthly insights 5 times' },
    { icon: Award, color: '#A855F7', title: 'Community Supporter', description: 'Participated in 3 community discussions' }
  ];

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  const DeleteDialog = () => (
    showDeleteDialog && (
      <div className="delete-dialog-overlay">
        <div className="delete-dialog">
          <h3>Are you absolutely sure?</h3>
          <p>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</p>
          <div className="delete-dialog-buttons">
            <button className="cancel-button" onClick={() => setShowDeleteDialog(false)}>Cancel</button>
            <button className="delete-button">Delete Account</button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="settings-container">
      <h2 className="settings-title">Settings</h2>

      {/* Account settings card */}
      <div className="settings-card">
        <div className="card-header">
          <h3>Account</h3>
        </div>
        <div className="card-content">
          <div className="setting-item">
            <div className="setting-left">
              <User className="setting-icon" />
             <Link to="/profile"> 
             <span>Edit Profile</span>
             </Link>
            </div>
            <Link to="/profile"><ChevronRight /></Link>
          </div>
          <div className="setting-item">
            <div className="setting-left">
              <Mail className="setting-icon" />
              <span>Change Email</span>
            </div>
            <ChevronRight />
          </div>
          <div className="setting-item">
            <div className="setting-left">
              <Phone className="setting-icon" />
              <span>Update Phone Number</span>
            </div>
            <ChevronRight />
          </div>
        </div>
      </div>

      {/* Notifications card */}
      <div className="settings-card">
        <div className="card-header">
          <h3>Notifications</h3>
        </div>
        <div className="card-content">
          {Object.keys(notificationSettings).map((setting) => (
            <div key={setting} className="notification-setting">
              <div className="setting-item">
                <div className="setting-left">
                  <Bell className="setting-icon" />
                  <span>{setting.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notificationSettings[setting].enabled}
                    onChange={(e) => handleNotificationChange(setting, 'enabled', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              {notificationSettings[setting].enabled && (
                <div className="notification-options">
                  {setting === 'weeklyInsights' && (
                    <select
                      value={notificationSettings[setting].day}
                      onChange={(e) => handleNotificationChange(setting, 'day', e.target.value)}
                      className="select-input"
                    >
                      {dayOptions.map((day) => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  )}
                  <select
                    value={notificationSettings[setting].time}
                    onChange={(e) => handleNotificationChange(setting, 'time', e.target.value)}
                    className="select-input"
                  >
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Privacy & Security card */}
      <div className="settings-card">
        <div className="card-header">
          <h3>Privacy & Security</h3>
        </div>
        <div className="card-content">
          <div className="setting-item">
            <div className="setting-left">
              <Lock className="setting-icon" />
              <span>Two-Factor Authentication</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={twoFactorAuth}
                onChange={(e) => setTwoFactorAuth(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-left">
              <Shield className="setting-icon" />
              <span>Data Sharing</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={dataSharing}
                onChange={(e) => setDataSharing(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
          <button 
            className="delete-account-button"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="setting-icon" />
            Delete Account
          </button>
        </div>
      </div>

      {/* Appearance card */}
      <div className="settings-card">
        <div className="card-header">
          <h3>Appearance</h3>
        </div>
        <div className="card-content">
          <div className="setting-item">
            <div className="setting-left">
              {darkMode ? <Moon className="setting-icon" /> : <Sun className="setting-icon" />}
              <span>Dark Mode</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Achievements card */}
      <div className="settings-card">
        <div className="card-header">
          <h3>Achievements</h3>
        </div>
        <div className="card-content">
          <div className="achievements-list">
            {achievements.map((achievement, index) => (
              <div key={index} className="achievement-item">
                <achievement.icon 
                  className="achievement-icon" 
                  style={{ color: achievement.color }} 
                />
                <div className="achievement-details">
                  <div className="achievement-title">{achievement.title}</div>
                  <div className="achievement-description">{achievement.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        <LogOut className="setting-icon" />
        Log Out
      </button>

      <DeleteDialog />
    </div>
  );
};

export default SettingsView;