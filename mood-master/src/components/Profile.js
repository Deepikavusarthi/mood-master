// components/Profile/Profile.jsx
import React, { useState, useEffect } from 'react';
import { UserService, RewardService, CustomActivityService } from '../apiService/Apis';
import { Edit2, Save, Award, Activity, Calendar, CheckCircle } from 'lucide-react';
import './profile.css';
import { useProfileDataStore, useRewardsDataStore, useCustomActivitiesDataStore } from '../store/useProfileDataStore';

const Profile = () => {
  // const [profile, setProfile] = useState(null);
  // const [rewards, setRewards] = useState(null);
  // const [customActivities, setCustomActivities] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const { setProfile, profile } = useProfileDataStore();
  const { setRewards, rewards } = useRewardsDataStore();
  const { setCustomActivities, customActivities } = useCustomActivitiesDataStore();
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editForm, setEditForm] = useState(profile);
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      const listCalls = []
      if(profile==null){
        listCalls.push(UserService.getUserProfile());
      }
      if(rewards==null){
        listCalls.push(RewardService.getReward());
      }
      if(customActivities==null){
        listCalls.push(CustomActivityService.getCustomActivities());
      }

      if(listCalls.length>0){
        const [profileRes, rewardsRes, activitiesRes] = await Promise.allSettled(listCalls);
        if(profile==null && profileRes){
          setProfile(profileRes.value);
          setEditForm({
            fname: profileRes?.value?.fname,
            lname: profileRes?.value?.lname,
            username: profileRes?.value?.username,
            phone: profileRes?.value?.phone
          });
        }
        if(rewards==null && rewardsRes){
          setRewards(rewardsRes.value);
        }
        if(customActivities==null && activitiesRes){
          setCustomActivities(activitiesRes.value);
        }
      }
      
    } catch (err) {

      setError('Failed to load profile data');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsEditLoading(true);
    try {
      const response = await UserService.updateUserProfile(updatedData);
      setProfile(response);
      setUpdatedData({});
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setUpdatedData({
      ...updatedData,
      [e.target.name]: e.target.value
    })
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="profile-error">{error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <span className="avatar-text">
            {profile?.fname?.[0]?.toUpperCase()}{profile?.lname?.[0]?.toUpperCase()}
          </span>
        </div>
        <div className="profile-title">
          <h1>{profile?.fname} {profile?.lname}</h1>
          <span className="profile-username">@{profile?.username}</span>
        </div>
        {!isEditing && (
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            <Edit2 size={18} /> Edit Profile
          </button>
        )}
      </div>

      {isEditing ? (
        <form className="edit-form" onSubmit={handleEditSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="fname"
              value={editForm?.fname}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lname"
              value={editForm?.lname}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={editForm?.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={editForm?.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-buttons">
            <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
            <button type="submit" className="save-button" disabled={isEditLoading}>
              <Save size={18} /> Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-content">
          <div className="profile-section">
            <h2>Contact Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Email</label>
                <span>{profile?.email}</span>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <span>{profile?.phone || 'Not provided'}</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Statistics & Rewards</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <Award className="stat-icon" />
                <div className="stat-info">
                  <span className="stat-value">{rewards?.mood || 0}</span>
                  <span className="stat-label">Mood Entries</span>
                </div>
              </div>
              <div className="stat-card">
                <Activity className="stat-icon" />
                <div className="stat-info">
                  <span className="stat-value">{rewards?.activity || 0}</span>
                  <span className="stat-label">Activities</span>
                </div>
              </div>
              <div className="stat-card">
                <Calendar className="stat-icon" />
                <div className="stat-info">
                  <span className="stat-value">{rewards?.journal || 0}</span>
                  <span className="stat-label">Journal Entries</span>
                </div>
              </div>
              <div className="stat-card">
                <CheckCircle className="stat-icon" />
                <div className="stat-info">
                  <span className="stat-value">{rewards?.strike || 0}</span>
                  <span className="stat-label">Strike Days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Custom Activities</h2>
            <div className="activities-grid">
              {customActivities?.map(activity => (
                <div key={activity.id} className="activity-card">
                  <h3>{activity.name}</h3>
                  <p>{activity.desc || 'No description provided'}</p>
                </div>
              ))}
              {customActivities?.length === 0 && (
                <p className="no-activities">No custom activities created yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;