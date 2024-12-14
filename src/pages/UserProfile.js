import React, { useState, useEffect } from 'react';
import { db, auth, storage } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

const UserProfile = () => {
  const [user] = useAuthState(auth);
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [updatedReview, setUpdatedReview] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      if (user) {
        const q = query(collection(db, "reviews"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const userReviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReviews(userReviews);
      }
    };
    fetchReviews();
  }, [user]);

  const handleEditClick = (review) => {
    setEditingReview(review.id);
    setUpdatedReview(review);
  };

  const handleUpdateChange = (e) => {
    setUpdatedReview({
      ...updatedReview,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    const reviewRef = doc(db, "reviews", editingReview);
    let updatedImageUrl = updatedReview.imageUrl;

    if (file) {
      const storageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(storageRef, file);
      updatedImageUrl = await getDownloadURL(storageRef);
    }

    await updateDoc(reviewRef, {
      ...updatedReview,
      imageUrl: updatedImageUrl,
    });

    const updatedReviews = reviews.map(review =>
      review.id === editingReview ? { ...updatedReview, imageUrl: updatedImageUrl } : review
    );
    setReviews(updatedReviews);
    setEditingReview(null);
    setFile(null);
    setLoading(false);
  };

  const handleDeleteReview = async (reviewId) => {
    await deleteDoc(doc(db, "reviews", reviewId));
    setReviews(reviews.filter(review => review.id !== reviewId));
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
        {user && (
          <div>
            <img
              className="w-20 h-20 rounded-full mx-auto mb-4"
              src={`https://ui-avatars.com/api/?name=${user.email}&background=random`}
              alt="User Avatar"
            />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {user.email}!</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mt-2"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Your Reviews</h2>
        {reviews.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map(review => (
              <div
                key={review.id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
              >
                {editingReview === review.id ? (
                  <div>
                    <input
                      type="text"
                      name="location"
                      value={updatedReview.location || ''}
                      onChange={handleUpdateChange}
                      placeholder="Location"
                      className="w-full p-2 border border-gray-300 rounded mb-2"
                    />
                    <input
                      type="text"
                      name="shopName"
                      value={updatedReview.shopName || ''}
                      onChange={handleUpdateChange}
                      placeholder="Shop Name"
                      className="w-full p-2 border border-gray-300 rounded mb-2"
                    />
                    <textarea
                      name="text"
                      value={updatedReview.text || ''}
                      onChange={handleUpdateChange}
                      placeholder="Review"
                      className="w-full p-2 border border-gray-300 rounded mb-2"
                    />
                    <select
                      name="rating"
                      value={updatedReview.rating || 1}
                      onChange={handleUpdateChange}
                      className="w-full p-2 border border-gray-300 rounded mb-2"
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
                      onChange={handleFileChange}
                      className="w-full mb-2"
                    />
                    <button
                      onClick={handleSaveEdit}
                      className={`bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 mr-2 ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditingReview(null)}
                      className="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{review.shopName}</h3>
                    <p className="text-gray-600">
                      <strong>Location:</strong> {review.location}
                    </p>
                    <p className="text-gray-600">
                      <strong>Review:</strong> {review.text}
                    </p>
                    <p className="text-yellow-500">
                      <strong>Rating:</strong> {'⭐'.repeat(review.rating)}
                    </p>
                    {review.imageUrl && (
                      <img
                        src={review.imageUrl}
                        alt="Review"
                        className="w-full h-40 object-cover rounded mt-2"
                      />
                    )}
                    <div className="mt-4 flex justify-between">
                      <button
                        onClick={() => handleEditClick(review)}
                        className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No reviews found.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
