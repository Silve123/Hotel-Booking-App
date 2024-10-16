import { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"; 
import firebase from 'firebase/compat/app'; // Use compat if needed
import 'firebase/compat/auth'; // Import the auth module from compat
import * as firebaseui from 'firebaseui'; // Import firebaseui
import './styling/Auth.scss';

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(true);
  const auth = getAuth(); // Get the Firebase Auth instance

  useEffect(() => {
    let ui;

    // Check if an instance already exists, otherwise create a new one
    if (!firebaseui.auth.AuthUI.getInstance()) {
      ui = new firebaseui.auth.AuthUI(auth); // Create a new instance of Firebase UI
    } else {
      ui = firebaseui.auth.AuthUI.getInstance(); // Use the existing instance
    }

    ui.start('#firebaseui-auth-container', {
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ],
      signInFlow: 'popup',
      callbacks: {
        signInSuccessWithAuthResult: (authResult) => {
          alert(`Welcome ${authResult.user.displayName}!`);
          return false; // Prevent redirect after sign-in
        },
      },
      // credentialHelper: firebaseui.auth.CredentialHelper.NONE, // Optional: Disable helper for cleaner UI
    });

    return () => {
      ui.reset(); // Clean up the UI when the component unmounts
    };
  }, [auth]);

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registration successful!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h1>Hotel Booking App</h1>
      <div className="auth-toggle">
        <a
          onClick={() => setLogin(true)}
          className={login ? "auth-title title-checked" : "auth-title"}
        >
          Login
        </a>
        <a
          onClick={() => setLogin(false)}
          className={!login ? "auth-title title-checked" : "auth-title"}
        >
          Register
        </a>
      </div>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="auth-input"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="auth-input"
      />

      {login ? (
        <button onClick={handleLogin} className="auth-button">
          Login
        </button>
      ) : (
        <button onClick={handleSignUp} className="auth-button">
          Register
        </button>
      )}

      {/* Firebase UI Container for Google Sign-In */}
      <div id="firebaseui-auth-container"></div>
    </div>
  );
};

export default Auth;
