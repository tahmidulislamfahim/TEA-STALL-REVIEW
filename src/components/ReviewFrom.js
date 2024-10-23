// src/components/ReviewForm.js
import React, { useState } from 'react';
import { db, storage } from '../firebase'; // Ensure correct import path
import { collection, addDoc } from "firebase/firestore"; // Firestore methods
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase storage methods

const ReviewForm = () => {
  const [title, setTitle] = useState(''); // State for title
  const [text, setText] = useState('');
  const [rating, setRating] = useState(1);
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      const imageUrl = await uploadImage(file);
      const reviewData = {
        title, // Include title in review data
        text,
        rating,
        imageUrl,
        timestamp: new Date(),
      };
      submitReview(reviewData);
    } else {
      // Handle case when there's no file (if needed)
      const reviewData = { title, text, rating, timestamp: new Date() }; // Include title here
      submitReview(reviewData);
    }
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
      // Optionally reset form state after submission
      setTitle(''); // Reset title
      setText('');
      setRating(1);
      setFile(null);
    } catch (e) {
      console.error("Error adding review: ", e);
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-4">Share Your Tea Stall Experience</h2> {/* Title for the form */}
      <form onSubmit={handleSubmit}>
        {/* Title Input Field */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title of your review"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your review here"
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
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
