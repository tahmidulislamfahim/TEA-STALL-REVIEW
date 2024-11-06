// src/components/ReviewList.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Adjust the path as needed
import { collection, getDocs } from 'firebase/firestore';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      const reviewsCollection = collection(db, 'reviews');
      const reviewSnapshot = await getDocs(reviewsCollection);
      const reviewList = reviewSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(reviewList);
    };

    fetchReviews();
  }, []);

  // Filter reviews based on search term, ensuring location is defined
  const filteredReviews = reviews.filter(review =>
    review.location && review.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search by location"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReviews.map(review => (
          <div key={review.id} className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-xl font-semibold">Location: {review.location}</h3>
            <h3 className="text-xl font-semibold">Shop Name: {review.shopName}</h3>
            <p className="text-gray-700 mt-2">{review.text}</p>
            <div className="flex items-center mt-2">
              <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
              <span className="ml-2 text-gray-500">{review.rating} Stars</span>
            </div>
            {review.imageUrl && (
              <img src={review.imageUrl} alt={review.location} className="mt-2 rounded w-64 h-48 object-cover" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
