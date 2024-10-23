// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const db = getFirestore(app);

export { db };