import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const UserSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/login'); // Redirect to login after successful sign up
    } catch (err) {
      setError('Error creating account. Please try again.');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center">Sign Up</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleSignUp} className="mt-6 space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition duration-200"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-center">
        Already have an account? <a href="/login" className="text-teal-600">Login</a>
      </p>
    </div>
  );
};

export default UserSignup;
