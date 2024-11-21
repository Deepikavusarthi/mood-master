import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Tracker from "./components/Tracker";
import Journal from "./components/Journal";
import Calendar from "./components/Calendar";
import Profile from "./components/Profile";
import CreateAccount from "./components/CreateAccount";
import Navbar from "./components/Navbar";
import Sleep from './components/Sleep';
import Exercise from './components/Exercise';
import Nutrition from './components/Nutrition';
import EditProfile from "./components/EditProfile";
import ChangePassword from "./components/ChangePassword";
import ChangeEmail from "./components/ChangeEmail";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Navbar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/change-email" element={<ChangeEmail />} />
            <Route path="/sleep" element={<Sleep />} />
            <Route path="/exercise" element={<Exercise />} />
            <Route path="/nutrition" element={<Nutrition />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
