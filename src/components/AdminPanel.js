import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get('/api/reviews').then((response) => {
      setReviews(response.data);
    });
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/reviews/${id}`);
      setReviews(reviews.filter((review) => review.id !== id));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <div>
        {reviews.map((review) => (
          <div key={review.id}>
            <h2>{review.title}</h2>
            <img src={review.photoUrl} alt={review.title} width="200" />
            <p>{review.description}</p>
            <p>Rating: {review.rating}</p>
            <button onClick={() => handleDelete(review.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
