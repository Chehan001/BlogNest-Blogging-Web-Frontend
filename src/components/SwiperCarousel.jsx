import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import "swiper/css";

const SwiperCarousel = ({ blogs = [] }) => {
  return (
    <Swiper modules={[Autoplay]} slidesPerView={1} autoplay={{ delay: 3000 }}>
      {blogs.map((blog) => (
        <SwiperSlide key={blog._id}>
          <img src={blog.image} className="w-full h-80 object-cover" alt={blog.title} />
          <h2 className="text-center text-xl mt-2">{blog.title}</h2>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperCarousel;
