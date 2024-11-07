import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/profile'); // Redirect to profile after successful login
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center">Login</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleLogin} className="mt-6 space-y-4">
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
          Login
        </button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account? <a href="/signup" className="text-teal-600">Sign Up</a>
      </p>
    </div>
  );
};

export default UserLogin;
