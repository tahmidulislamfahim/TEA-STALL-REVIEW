import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';


const AdminPanel = () => {
  const [reviews, setReviews] = useState([]);
  const [editReviewId, setEditReviewId] = useState(null);
  const [editReviewData, setEditReviewData] = useState({ title: '', description: '', rating: 0 });

  useEffect(() => {
    const fetchReviews = async () => {
      const querySnapshot = await getDocs(collection(db, 'reviews'));
      const reviewsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(reviewsData);
    };
    fetchReviews();
  }, []);

  // Delete a review
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'reviews', id));
      setReviews(reviews.filter(review => review.id !== id));
      alert('Review deleted successfully.');
    } catch (error) {
      console.error('Error deleting review: ', error);
    }
  };

  // Edit a review
  const handleEdit = (review) => {
    setEditReviewId(review.id);
    setEditReviewData({
      title: review.title,
      description: review.description,
      rating: review.rating
    });
  };

  // Update the review in Firestore
  const handleUpdate = async (e) => {
    e.preventDefault();
    const { title, description, rating } = editReviewData;
    try {
      const reviewRef = doc(db, 'reviews', editReviewId);
      await updateDoc(reviewRef, { title, description, rating });
      const updatedReviews = reviews.map(review =>
        review.id === editReviewId ? { ...review, title, description, rating } : review
      );
      setReviews(updatedReviews);
      setEditReviewId(null);
      alert('Review updated successfully.');
    } catch (error) {
      console.error('Error updating review: ', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Panel - Manage Reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="bg-white p-4 rounded-lg shadow-md">
              {editReviewId === review.id ? (
                // Edit review form
                <form onSubmit={handleUpdate}>
                  <input
                    type="text"
                    value={editReviewData.title}
                    onChange={(e) => setEditReviewData({ ...editReviewData, title: e.target.value })}
                    className="w-full p-2 mb-4 border rounded"
                    required
                  />
                  <textarea
                    value={editReviewData.description}
                    onChange={(e) => setEditReviewData({ ...editReviewData, description: e.target.value })}
                    className="w-full p-2 mb-4 border rounded"
                    required
                  />
                  <input
                    type="number"
                    value={editReviewData.rating}
                    onChange={(e) => setEditReviewData({ ...editReviewData, rating: parseInt(e.target.value) })}
                    className="w-full p-2 mb-4 border rounded"
                    required
                  />
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update Review</button>
                </form>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">{review.title}</h3>
                  <p>{review.description}</p>
                  <p>Rating: {review.rating}</p>
                  <button
                    onClick={() => handleEdit(review)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
