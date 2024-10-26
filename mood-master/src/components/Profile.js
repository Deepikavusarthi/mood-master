import React from "react";


const ProfilePage = () => {
  //placeholder data
  const userInfo = {
    username: "user123",
    password: "password123",
  };

  return (
    <div style={{color:"black"}}>
      <h2>Profile</h2>
      <p>Username: {userInfo.username}</p>
      <p>Password: {userInfo.password}</p>
    </div>
  );
};

export default ProfilePage;
