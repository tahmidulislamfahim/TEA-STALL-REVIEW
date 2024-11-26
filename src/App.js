import React from 'react';
import Home from './pages/Home';
import Review from './pages/Review';
import UserLogin from './pages/UserLogin'; // Ensure correct casing in the filename and import
import UserSignup from './pages/UserSignup'; // Ensure correct casing in the filename and import
import UserProfile from './pages/UserProfile'; // Ensure correct casing in the filename and import
import Navbar from './components/Navebar'; // Ensure correct casing in the filename and import
import AdminPanel from './components/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from './firebase'; // Import Firebase Auth
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Qr from './components/reviewByQr';

function App() {
  const [user] = useAuthState(auth);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/review" element={user ? <Review /> : <UserLogin />} /> {/* Protect the review page */}
        <Route path="/Qr" element={ <Qr /> } /> {/* Protect the review page */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/profile" element={user ? <UserProfile /> : <UserLogin />} /> {/* Protect profile page */}
        <Route path="/admin/login" element={<AdminLogin />} />
        {user?.email === 'opi@gmail.com' && <Route path="/admin" element={<AdminPanel />} />}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
