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
        className="mySwiper max-w-[1280px] h-[400px] rounded-lg"
      >
        <SwiperSlide>
          <img
            src={banner4}
            alt="Slide 1"
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={banner5}
            alt="Slide 2"
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </SwiperSlide>
        {/* เพิ่ม SwiperSlide ตามต้องการ */}
      </Swiper>
    </div>
  );
};

export default BannerSection;
