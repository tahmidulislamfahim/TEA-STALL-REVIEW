// src/components/ReviewForm.js
import React, { useState } from 'react';
import { db, storage } from '../firebase'; // Ensure correct import path
import { collection, addDoc } from "firebase/firestore"; // Firestore methods
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase storage methods

const ReviewForm = () => {
  const [location, setLocation] = useState('');  // State for location
  const [shopName, setShopName] = useState(''); 
  const [text, setText] = useState('');
  const [rating, setRating] = useState(1);
  const [file, setFile] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

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
      console.error("Error uploading image: ", error);
      return null;
    }
  };

  const submitReview = async (reviewData) => {
    try {
      const docRef = await addDoc(collection(db, "reviews"), reviewData);
      console.log("Review written with ID: ", docRef.id);

      // Show snackbar and reset form
      setShowSnackbar(true);
      setLocation('');
      setShopName('');
      setText('');
      setRating(1);
      setFile(null);

      // Hide snackbar after 3 seconds
      setTimeout(() => setShowSnackbar(false), 3000);
    } catch (e) {
      console.error("Error adding review: ", e);
    }
  };

  return (
    <div className="bg-gray-100 p-8 rounded-lg shadow-md max-w-lg mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Share Your Tea Stall Experience</h2>
      <form onSubmit={handleSubmit}>
        {/* Location Input Field */}
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <input
          type="text"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          placeholder="Shop name"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your review..."
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded"
          required
        >
          <option value={1}>1 Star</option>
          <option value={2}>2 Stars</option>
          <option value={3}>3 Stars</option>
          <option value={4}>4 Stars</option>
          <option value={5}>5 Stars</option>
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Submit Review
        </button>
      </form>
      
      {/* Snackbar Notification */}
      {showSnackbar && (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded shadow-lg">
       Review submitted successfully!
       </div>
      )}
    </div>
  );
};

export default ReviewForm;
