// src/App.js
import { useState, useEffect } from "react";
import { auth } from "./firebaseConfig";
import Auth from "./components/Auth";
import Navbar from "./components/Navbar"; // Import Navbar
import Booking from "./components/Booking";
import MyBookings from "./components/MyBookings"; // Import MyBookings
import './styles.scss';
import { signOut } from "firebase/auth"; // Import signOut function

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("bookings"); // State to manage active tab

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert("Successfully signed out!");
    } catch (error) {
      alert("Error signing out: " + error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      {user ? (
        <>
          <Navbar user={user} onSignOut={handleSignOut} setActiveTab={setActiveTab} /> {/* Pass setActiveTab to Navbar */}
          {activeTab === "bookings" ? <Booking /> : <MyBookings />} {/* Render based on active tab */}
        </>
      ) : (
        <Auth />
      )}
    </div>
  );
}

export default App;
