import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD4tQ0CcoTHvmssrvyfR9KdPnolWNKxCMg",
    authDomain: "hotel-booking-bb79d.firebaseapp.com",
    projectId: "hotel-booking-bb79d",
    storageBucket: "hotel-booking-bb79d.appspot.com",
    messagingSenderId: "985112712149",
    appId: "1:985112712149:web:597c4166f8de618e0a635c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

export { auth, db };