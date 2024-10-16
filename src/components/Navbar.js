// src/components/Navbar.js
import React from "react";
import './styling/Navbar.scss';

const Navbar = ({ user, onSignOut, setActiveTab }) => {
  return (
    <div className="navbar">
      <h1 className="navbar-title">
        Welcome, {user.email.slice(0, 5) + "*".repeat(user.email.length - 5)}
      </h1>
      <div className="navbar-tabs">
        <button onClick={() => setActiveTab("bookings")} className="navbar-tab">Book a Room</button>
        <button onClick={() => setActiveTab("my-bookings")} className="navbar-tab">My Bookings</button>
      </div>
      <button onClick={onSignOut} className="signout-button">
        Sign Out
      </button>
    </div>
  );
};

export default Navbar;
