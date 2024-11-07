import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-teal-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
      <div className="flex items-center">
  <Link to="/" className="flex items-center text-white font-bold">
    <img src={logo} alt="Tea Stall Logo" className="w-12 h-12 mr-3 " /> {/* Adjusted size */}
    <span className="text-2xl sm:text-3xl md:text-4xl p-2">TeaStall Reviews</span> {/* Responsive font */}
  </Link>
</div>


        {/* Hamburger Icon for mobile view */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="text-white block sm:hidden focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        {/* Links - Hidden on mobile unless menu is open */}
        <div className={`sm:flex ${isMenuOpen ? "block" : "hidden"} sm:block`}>
          <Link to="/" className="text-white hover:text-gray-300 px-4 block sm:inline">
            Home
          </Link>
          <Link to="/review" className="text-white hover:text-gray-300 px-4 block sm:inline">
            Post Review
          </Link>
          {/* User Authentication Links */}
          <Link to="/login" className="text-white hover:text-gray-300 px-4 block sm:inline">
            Login
          </Link>
          <Link to="/signup" className="text-white hover:text-gray-300 px-4 block sm:inline">
            Signup
          </Link>
          <Link to="/profile" className="text-white hover:text-gray-300 px-4 block sm:inline">
            Profile
          </Link>
          <Link to="/admin/login" className="text-white hover:text-gray-300 px-4 block sm:inline">
            Admin Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
