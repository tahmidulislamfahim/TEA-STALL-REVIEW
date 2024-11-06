import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReviewList from '../components/ReviewList';
import PhotoGallery from '../components/PhotoGallery';

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
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <p className="text-gray-700 text-center text-sm sm:text-base lg:text-lg">
        জীবনটা ঠিক যেন এক কাপ চায়ের মতো, তার স্বাদ ঠিক তেমনটাই হবে যেমনটা আপনি সেটিকে বানাবেন।
      </p>
      
      {/* Photo gallery with responsive margin and padding */}
      <div className="my-4 sm:my-6 lg:my-8">
        <PhotoGallery />
      </div>
      
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-6 lg:mb-8 text-teal-600">
        Tea Stall Reviews
      </h1>
      
      {/* Responsive card for posting a new review */}
      <div className="bg-teal-100 p-4 sm:p-6 lg:p-8 rounded-lg shadow-md mb-6 lg:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-teal-700 mb-2 sm:mb-4">
          Post a Review
        </h2>
        <p className="text-gray-700 text-sm sm:text-base lg:text-lg">
          Share your experience about a tea stall you've visited!
        </p>
      </div>

      {/* Responsive review list */}
      <ReviewList reviews={reviews} />
    </div>
  );
};

export default Home;
