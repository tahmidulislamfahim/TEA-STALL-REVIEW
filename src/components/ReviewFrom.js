import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const ReviewForm = () => {
  const [location, setLocation] = useState('');
  const [shopName, setShopName] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(1);
  const [file, setFile] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [user] = useAuthState(auth);  // Listen to auth state
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirect to login if not logged in
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageUrl = file ? await uploadImage(file) : null;

    const reviewData = {
      location,
      shopName,
      text,
      rating,
      imageUrl,
      timestamp: new Date(),
      userId: user?.uid,  // Save the user ID with the review
    };

    submitReview(reviewData);
  };

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `images/${file.name}`);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image: ', error);
      return null;
    }
  };

  const submitReview = async (reviewData) => {
    try {
      const docRef = await addDoc(collection(db, 'reviews'), reviewData);
      console.log('Review written with ID: ', docRef.id);

      setShowSnackbar(true);
      setLocation('');
      setShopName('');
      setText('');
      setRating(1);
      setFile(null);

      setTimeout(() => setShowSnackbar(false), 3000);
    } catch (e) {
      console.error('Error adding review: ', e);
    }
  };

  return (
    <div className="bg-gray-100 p-6 sm:p-8 rounded-lg shadow-md max-w-lg mx-auto mt-10 w-full">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Share Your Tea Stall Experience</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="w-full p-2 border border-gray-300 rounded sm:text-lg"
          required
        />
        <input
          type="text"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          placeholder="Shop name"
          className="w-full p-2 border border-gray-300 rounded sm:text-lg"
          required
        />
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded sm:text-lg"
          required
        >
          <option value={1}>1 Star</option>
          <option value={2}>2 Stars</option>
          <option value={3}>3 Stars</option>
          <option value={4}>4 Stars</option>
          <option value={5}>5 Stars</option>
        </select>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your review..."
          className="w-full p-2 border border-gray-300 rounded sm:text-lg"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 sm:text-lg"
        >
          Submit Review
        </button>
      </form>

      {/* Snackbar Notification */}
      {showSnackbar && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded shadow-lg sm:text-lg">
          Review submitted successfully!
        </div>
      )}
    </div>
  );
};

export default ReviewForm;
