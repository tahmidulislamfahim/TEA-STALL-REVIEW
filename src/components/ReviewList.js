// src/components/ReviewList.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Adjust the path as needed
import { collection, getDocs } from 'firebase/firestore';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const reviewsCollection = collection(db, 'reviews');
      const reviewSnapshot = await getDocs(reviewsCollection);
      const reviewList = reviewSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(reviewList);
    };

    fetchReviews();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map(review => (
          <div key={review.id} className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-xl font-semibold">{review.title}</h3>
            <p className="text-gray-700 mt-2">{review.text}</p>
            <div className="flex items-center mt-2">
              <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
              <span className="ml-2 text-gray-500">{review.rating} Stars</span>
            </div>
            {review.imageUrl && (
              <img src={review.imageUrl} alt={review.title} className="mt-2 rounded" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
