// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import for authentication
import { getStorage } from "firebase/storage"; // Import for storage

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnXpjtoaizNndv-wYO4MFrSn8EkaJKslA",
  authDomain: "tea-stall-reviews.firebaseapp.com",
  projectId: "tea-stall-reviews",
  storageBucket: "tea-stall-reviews.appspot.com",
  messagingSenderId: "749750040357",
  appId: "1:749750040357:web:7ef29b4e252b0573b2cccc",
  measurementId: "G-XDVPNETLKN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Firestore for database
const auth = getAuth(app); // Authentication
const storage = getStorage(app); // Storage for uploading files

export { db, auth, storage };
