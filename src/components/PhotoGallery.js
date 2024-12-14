import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      const querySnapshot = await getDocs(collection(db, 'reviews'));
      const photoData = querySnapshot.docs.map(doc => doc.data()).filter(review => review.imageUrl);

      // Shuffle the array and pick the first 10 items
      const shuffledPhotos = photoData.sort(() => Math.random() - 0.5).slice(0, 10);
      setPhotos(shuffledPhotos);
    };

    fetchPhotos();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Photo Gallery</h2>
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={16}
        slidesPerView={4}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {photos.map((photo, index) => (
          <SwiperSlide key={index}>
            <div className="overflow-hidden rounded-lg shadow-lg">
              <img
                src={photo.imageUrl}
                alt={`Review ${index}`}
                className="w-full h-60 object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PhotoGallery;
