import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";

import banner4 from "/Banner/banner4.png";
import banner5 from "/Banner/banner5.png";

const BannerSection = () => {
  return (
    <div className="section-container pt-20">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper max-w-[1280px] aspect-[16/6] rounded-lg"
      >
        <SwiperSlide>
          <div className="w-full h-full rounded-lg overflow-hidden">
            <img
              src={banner4}
              alt="Slide 1"
              className="w-full h-full object-cover scale-100 md:scale-100 transition-transform duration-500"
            />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="w-full h-full rounded-lg overflow-hidden">
            <img
              src={banner5}
              alt="Slide 2"
              className="w-full h-full object-cover scale-100 md:scale-100 transition-transform duration-500"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default BannerSection;
