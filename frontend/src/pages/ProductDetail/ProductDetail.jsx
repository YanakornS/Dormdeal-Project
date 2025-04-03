import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import PostService from "../../services/postproduct.service";
import Swal from "sweetalert2";
import { AiOutlineMessage } from "react-icons/ai";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import { FaRegHeart, FaHeart, FaBold } from "react-icons/fa6";
import { PiWarningCircle } from "react-icons/pi";

const ProductDetail = () => {
  const [postProductDetail, setPostProductDetail] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { id } = useParams();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await PostService.getPostById(id);
        if (response.status === 200) {
          setPostProductDetail(response.data);
        }
      } catch (error) {
        Swal.fire({
          title: "Post Detail",
          text: error?.response?.data?.message || error.message,
          icon: "error",
        });
      }
    };
    fetchPost();
  }, [id]);

  return (
    <div className="section-container sm:mt-7 mt-6 px-6 py-14">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col">
          {/* Main Image */}
          <img
            src={postProductDetail?.images?.[0]}
            alt="Main Product"
            className="w-130 h-130 rounded-lg shadow-md object-cover cursor-pointer"
            onClick={() => {
              setCurrentIndex(0);
              setLightboxOpen(true);
            }}
          />

          {/* Thumbnail */}
          <div className="flex mt-2 space-x-2">
            {postProductDetail?.images?.slice(1).map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Gallery ${index + 1}`}
                className="w-20 h-20 rounded-md shadow-sm cursor-pointer"
                onClick={() => {
                  setCurrentIndex(index + 1);
                  setLightboxOpen(true);
                }}
              />
            ))}
          </div>
        </div>

        {/* รายละเอียดสินค้า */}
        <div>
          <h1 className="text-2xl font-bold">
            {postProductDetail.productName}
          </h1>

          <div className="flex items-center justify-between my-2">
            <p className="text-3xl font-bold">
              {formatPrice(postProductDetail.price)}
            </p>
            <button className="text-gray-500 hover:text-red-500">
              <FaRegHeart size={24} />
            </button>
          </div>

          <div className="flex items-center justify-between mt-4 pb-1">
            <p className="text-xl font-semibold mt-3">
              สภาพสินค้า -{" "}
              <span className="text-xl text-gray-700">
                {postProductDetail.condition}
              </span>
            </p>
          </div>

          <div className="border-b-1 mt-2"></div>

          <div className="flex items-center justify-between pb-2 mt-4 ">
            <h2 className="text-xl font-semibold ">รายละเอียด</h2>
            <button className="flex items-center justify-center btn-report">
              <PiWarningCircle className="mr-2" size={24} />
              รายงานโพสต์
            </button>
            {/* <ModalReport name="report_modal" /> */}
          </div>
          <p className="text-gray-700 text-sm leading-relaxed mt-1">
            {postProductDetail.description}
          </p>
        </div>

        {/* รายละเอียดผู้ขาย */}
        <div className="shadow-lg p-6 w-full sm:w-[400px] rounded-2xl mt-6">
          <h2 className="text-xl mb-4">รายละเอียดผู้ขาย</h2>
          <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={postProductDetail.owner?.photoURL}
              alt="User PhotoURL"
              className="w-14 h-14 rounded-full"
            />
            <p className="font-medium truncate w-32 sm:w-auto">
              {postProductDetail.owner?.displayName || "ไม่พบผู้ใช้"}
            </p>
          </div>
          <a
              className="text-blue-600 font-medium hover:underline cursor-pointer"
            >
              ดูโปรไฟล์
            </a>
          </div>
          {/* ปุ่มแชท */}
          <button className="mt-4 flex items-center justify-center bg-gray-200 text-black px-4 py-2 rounded-2xl w-full border border-gray-300 hover:bg-gray-300 cursor-pointer">
            <AiOutlineMessage size={20} className="mr-2" /> แชท
          </button>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={postProductDetail.images?.map((src) => ({ src })) || []}
        styles={{ container: { backgroundColor: "rgba(0, 0, 0, 0.2)" } }}
        index={currentIndex}
      />
    </div>
  );
};

export default ProductDetail;
