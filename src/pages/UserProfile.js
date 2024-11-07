import React, { useState, useEffect } from 'react';
import { db, auth, storage } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth"; // Import signOut from Firebase Auth

const UserProfile = () => {
  const [user] = useAuthState(auth);
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [updatedReview, setUpdatedReview] = useState({});
  const [file, setFile] = useState(null);

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
  };

  const handleDeleteReview = async (reviewId) => {
    await deleteDoc(doc(db, "reviews", reviewId));
    setReviews(reviews.filter(review => review.id !== reviewId));
  };

  // Logout function
  const handleLogout = () => {
    signOut(auth); // Sign out the user from Firebase
  };

  return (
    <div className="container mx-auto p-6">
      {user && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Welcome, {user.email}!</h1>
          {/* Logout Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
          <p className="text-gray-600 mt-2">Here are your reviews:</p>
        </div>
      )}

      {reviews.length > 0 ? (
        reviews.map(review => (
          <div key={review.id} className="bg-white p-4 shadow rounded mb-4">
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
                  className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 mr-2"
                >
                  Save
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
                <h2 className="text-xl font-bold">{review.shopName}</h2>
                <p><strong>Location:</strong> {review.location}</p>
                <p><strong>Review:</strong> {review.text}</p>
                <p><strong>Rating:</strong> {review.rating} Stars</p>
                {review.imageUrl && (
                  <img src={review.imageUrl} alt="Review" className="w-20 h-auto mt-2" />
                )}
                <div className="mt-4">
                  <button
                    onClick={() => handleEditClick(review)}
                    className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 mr-2"
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
        ))
      ) : (
        <p className="text-gray-600">No reviews found.</p>
      )}

      
    </div>
  );
};

export default UserProfile;
