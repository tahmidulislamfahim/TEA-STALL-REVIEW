// src/components/PhotoGallery.js
import React from 'react';

const photos = [
  { id: 1, src: '/images/tea1.jpg', alt: 'Tea Stall 1' },
  { id: 2, src: '/images/tea1.jpg', alt: 'Tea Stall 2' },
  { id: 3, src: '/images/tea3.jpg', alt: 'Tea Stall 3' },
  { id: 4, src: '/images/tea4.jpeg', alt: 'Tea Stall 3' },
  { id: 5, src: '/images/tea5.jpeg', alt: 'Tea Stall 3' },
  { id: 6, src: '/images/tea6.jpeg', alt: 'Tea Stall 3' },
  // Add more photos as needed
];

const PhotoGallery = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Photo Gallery</h2>
      {/* Wrapper for horizontal scroll */}
      <div className="flex overflow-x-scroll whitespace-nowrap space-x-4 p-2">
        {photos.map(photo => (
          <div key={photo.id} className="inline-block overflow-hidden rounded-lg shadow-lg">
            <img src={photo.src} alt={photo.alt} className="w-60 h-60 object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;
