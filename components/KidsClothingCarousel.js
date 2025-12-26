// components/KidsClothingCarousel.js
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';  // Import Swiper's core styles
// Optionally, add other styles for pagination or navigation
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const KidsClothingCarousel = ({ items }) => {
  return (
    <div className="kids-clothing-carousel">
      <Swiper
        spaceBetween={20} // Space between items
        slidesPerView={3} // Number of items visible at once
        loop={true} // Infinite loop for carousel
        autoplay={{ delay: 3000 }} // Autoplay the carousel with a delay of 3 seconds
        breakpoints={{
          640: {
            slidesPerView: 1, // Show 1 slide for small screens
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2, // Show 2 slides for medium screens
            spaceBetween: 20,
          },
        }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="carousel-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.name} />
              <h4>{item.name}</h4>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default KidsClothingCarousel;
