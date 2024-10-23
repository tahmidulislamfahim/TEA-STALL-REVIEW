import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReviewList from '../components/ReviewList';

const Home = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get('/api/reviews')
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the reviews!", error);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-teal-600">Tea Stall Reviews</h1>
      
      {/* Create a card for posting a new review */}
      <div className="bg-teal-100 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-teal-700 mb-4">Post a Review</h2>
        <p className="text-gray-700">Share your experience about a tea stall you've visited!</p>
      </div>

      {/* Display the list of reviews */}
      <ReviewList reviews={reviews} />
    </div>
  );
};

export default Home;
