// components/ProfilePage.js
import React from "react";


const ProfilePage = () => {
  const userInfo = {
    username: "user123",
    password: "password123",
  };

  return (
    <div>
      <h2>Profile</h2>
      <p>Username: {userInfo.username}</p>
      <p>Password: {userInfo.password}</p>
      {/* Add functionality to change password or edit user info */}
    </div>
  );
};

export default ProfilePage;
