import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const AdminPanel = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [editReviewId, setEditReviewId] = useState(null);
  const [editReviewData, setEditReviewData] = useState({
    location: '',
    shopName: '',
    text: '',
    rating: 1,
    imageUrl: ''
  });
  const [searchLocation, setSearchLocation] = useState(''); // State for search input

  useEffect(() => {
    const fetchReviews = async () => {
      const querySnapshot = await getDocs(collection(db, 'reviews'));
      const reviewsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(reviewsData);
      setFilteredReviews(reviewsData); // Initially display all reviews
    };
    fetchReviews();
  }, []);

  // Delete a review
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'reviews', id));
      setReviews(reviews.filter(review => review.id !== id));
      setFilteredReviews(filteredReviews.filter(review => review.id !== id)); // Filter out deleted review from filtered reviews
      alert('Review deleted successfully.');
    } catch (error) {
      console.error('Error deleting review: ', error);
    }
  };

  // Edit a review
  const handleEdit = (review) => {
    setEditReviewId(review.id);
    setEditReviewData({
      location: review.location,
      shopName: review.shopName,
      text: review.text,
      rating: review.rating,
      imageUrl: review.imageUrl || ''
    });
  };

  // Update the review in Firestore
  const handleUpdate = async (e) => {
    e.preventDefault();
    const { location, shopName, text, rating, imageUrl } = editReviewData;

    try {
      const reviewRef = doc(db, 'reviews', editReviewId);
      await updateDoc(reviewRef, { location, shopName, text, rating, imageUrl });
      
      const updatedReviews = reviews.map(review =>
        review.id === editReviewId ? { ...review, location, shopName, text, rating, imageUrl } : review
      );
      setReviews(updatedReviews);
      setFilteredReviews(updatedReviews); // Ensure filtered reviews are updated as well
      setEditReviewId(null);
      alert('Review updated successfully.');
    } catch (error) {
      console.error('Error updating review: ', error);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditReviewId(null);
    setEditReviewData({
      location: '',
      shopName: '',
      text: '',
      rating: 1,
      imageUrl: ''
    });
  };

  // Handle search by location
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchLocation(query);

    // Filter reviews by location
    const filtered = reviews.filter(review =>
      review.location.toLowerCase().includes(query)
    );
    setFilteredReviews(filtered);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Panel - Manage Reviews</h2>
      
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchLocation}
          onChange={handleSearch}
          placeholder="Search by location"
          className="w-60 p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-white p-4 rounded-lg shadow-md">
              {editReviewId === review.id ? (
                // Edit review form
                <form onSubmit={handleUpdate}>
                  <input
                    type="text"
                    value={editReviewData.location}
                    onChange={(e) => setEditReviewData({ ...editReviewData, location: e.target.value })}
                    placeholder="Location"
                    className="w-full p-2 mb-4 border rounded"
                    required
                  />
                  <input
                    type="text"
                    value={editReviewData.shopName}
                    onChange={(e) => setEditReviewData({ ...editReviewData, shopName: e.target.value })}
                    placeholder="Shop Name"
                    className="w-full p-2 mb-4 border rounded"
                    required
                  />
                  <textarea
                    value={editReviewData.text}
                    onChange={(e) => setEditReviewData({ ...editReviewData, text: e.target.value })}
                    placeholder="Write your review..."
                    className="w-full p-2 mb-4 border rounded"
                    required
                  />
                  <select
                    value={editReviewData.rating}
                    onChange={(e) => setEditReviewData({ ...editReviewData, rating: parseInt(e.target.value) })}
                    className="w-full p-2 mb-4 border rounded"
                    required
                  >
                    <option value={1}>1 Star</option>
                    <option value={2}>2 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={5}>5 Stars</option>
                  </select>
                  <input
                    type="text"
                    value={editReviewData.imageUrl}
                    onChange={(e) => setEditReviewData({ ...editReviewData, imageUrl: e.target.value })}
                    placeholder="Image URL (optional)"
                    className="w-full p-2 mb-4 border rounded"
                  />
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update Review</button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">{review.shopName}</h3>
                  <p>Location: {review.location}</p>
                  <p>{review.text}</p>
                  <p>Rating: {review.rating}</p>
                  {review.imageUrl && <img src={review.imageUrl} alt="Review" className="w-full h-64 object-cover mt-4" />}
                  <p>Reviewed on: {new Date(review.timestamp.seconds * 1000).toLocaleDateString() || 'Not available'}</p>
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
