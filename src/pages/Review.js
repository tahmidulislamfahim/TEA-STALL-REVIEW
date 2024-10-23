import React from 'react';
import ReviewForm from '../components/ReviewFrom';

const Review = () => {
  return (
    <div>
      <h1 className="text-gray-700 text-center mt-3"># চা হলো জীবনের সেই অমৃত যা মানুষের জীবনীশক্তি ,মানুষকে বেঁচে থাকার প্রেরণা জোগায়।</h1>
      <h1 className="text-gray-700 text-center mt-3"># যখন কিছুই আপনার অনুকূলে যায় না তখন এক কাপ চা’ই পারে সব কিছুকে একটু অন্যরকম করে তুলে ধরতে।</h1>
      <ReviewForm />
    </div>
  );
};

export default Review;
