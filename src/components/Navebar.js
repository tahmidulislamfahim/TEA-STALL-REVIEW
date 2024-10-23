import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-teal-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          TeaStall Reviews
        </Link>
        <div>
          <Link to="/" className="text-white hover:text-gray-300 px-4">Home</Link>
          <Link to="/review" className="text-white hover:text-gray-300 px-4">Post Review</Link>
          
          <Link to="/admin/login" className="mr-4">Admin Login</Link>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
