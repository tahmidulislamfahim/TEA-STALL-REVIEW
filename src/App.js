import React from 'react';
import Home from './pages/Home';
import Review from './pages/Review';
import Navbar from './components/Navebar';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from './firebase'; // Add Firebase Auth
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './pages/AdminLogin'; 
 // This line requires the installed package


function App() {
  const [user] = useAuthState(auth);
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/review" element={<Review />} />
        <Route path="/admin/login" element={<AdminLogin />} /> {/* Add the login route */}
        {user?.email === 'opi@gmail.com' && <Route path="/admin" element={<AdminPanel />} />}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
