import WishListService from "../../services/wishlist.service";
import { AuthContext } from "../../context/AuthContext"; // หรือ path ของ AuthContext จริงของคุณ
import { useContext } from "react";
import { useChatStore } from "../../stores/useChatStore";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import PostService from "../../services/postproduct.service";
import Swal from "sweetalert2";
import { AiOutlineMessage } from "react-icons/ai";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Modal from "../../components/Login/Modal";
import ProductCard from "../../components/ProductCard";

import { FaHeart, FaRegHeart } from "react-icons/fa";
import { PiWarningCircle } from "react-icons/pi";

import ModalReport from "../../components/ReportPost/ModalReport";

const ProductDetail = () => {
  const { createChatRoom, sendMessage } = useChatStore();
  const [postProductDetail, setPostProductDetail] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { id } = useParams();
  const [relatedProducts, setRelatedProducts] = useState([]); // เพิ่มตัวแปรนี้
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const { socket, getUser, user } = useContext(AuthContext);
  const jwtUser = getUser();
  const isLoggedIn = !!jwtUser;
  const isOwner = isLoggedIn && postProductDetail.owner?._id === jwtUser._id;

  const navigate = useNavigate();

  const handleHeartClick = async (e) => {
    e.preventDefault();
    if (!user) {
      Swal.fire({
        title: "กรุณาเข้าสู่ระบบก่อน",
        text: "คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถเพิ่มรายการโปรดได้",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "เข้าสู่ระบบ",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          const loginModal = document.getElementById("login");
          if (loginModal) {
            loginModal.showModal();
          }
        }
      });
      return;
    }
    try {
      await WishListService.toggleWishlist(id);
      setIsHeartFilled(!isHeartFilled);

      toast.success(
        !isHeartFilled ? "เพิ่มเข้ารายการโปรดสำเร็จ" : "ลบออกจากรายการโปรดแล้ว",
        {
          icon: isHeartFilled ? "💔" : "❤️",
          style: {
            borderRadius: "10px",
            background: !isHeartFilled ? "#ecfdf5" : "#fef2f2",
            color: !isHeartFilled ? "#065f46" : "#b91c1c",
            border: !isHeartFilled ? "1px solid #a7f3d0" : "1px solid #fecaca",
            boxShadow: "none",
          },
        }
      );
    } catch (err) {
      console.error("ไม่สามารถ toggle wishlist ได้", err);
      toast.error("เกิดข้อผิดพลาด ลองใหม่อีกครั้ง", {
        style: {
          borderRadius: "10px",
          background: "#fef2f2",
          color: "#b91c1c",
          border: "1px solid #fecaca",
          boxShadow: "none",
        },
      });
    }
  };

  useEffect(() => {
    const checkWishlist = async () => {
      if (!user || !id) return;

      try {
        const res = await WishListService.getWishlist();
        const wishlistArray = res.data.wishlist || []; // <--  แก้ตรงนี้จาก โอ๊ค
        const found = wishlistArray.some((item) => item._id === id); // หรือ item.post?._id === id
        setIsHeartFilled(found);

        setIsHeartFilled(found);
      } catch (error) {
        console.error("โหลด Wishlist ล้มเหลว", error);
      }
    };

    checkWishlist();
  }, [id, user]);

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
        if (response) {
          setPostProductDetail(response);

          const relatedResponse = await PostService.getAllPostsProduct();

          // ตรวจสอบค่าของ category และ _id ใน response
          console.log("หมวดหมู่สินค้าปัจจุบัน :", response.category);
          console.log("ID ผลิตภัณฑ์ปัจจุบัน :", response._id);

          // ตรวจสอบข้อมูลสินค้าที่ได้รับจาก relatedResponse
          console.log("ผลิตภัณฑ์ทั้งหมด :", relatedResponse.data);

          // ตรวจสอบการเปรียบเทียบ category ว่าเป็น string หรือ object
          const categoryId = response.category?._id || response.category; // ถ้า category เป็น object ให้เข้าถึง _id

          const related = relatedResponse.data.filter((product) => {
            const productCategory = product.category?._id || product.category; // ถ้า category ของสินค้าที่กรองเป็น object ให้ใช้ _id
            return (
              String(productCategory) === String(categoryId) &&
              String(product._id) !== String(response._id)
            );
          });

          console.log("กรองสินค้าที่เกี่ยวข้องแล้ว :", related); // ตรวจสอบข้อมูลที่กรองออกมา

          setRelatedProducts(related);
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

  const handleChat = async () => {
    if (!isLoggedIn) {
      document.getElementById("login").showModal();
      return;
    }

    try {
      const receiverId = postProductDetail.owner._id;
      const postId = postProductDetail._id;

      await createChatRoom({ receiverId }, socket);
      await sendMessage({ postId }, socket);

      navigate("/chat");
    } catch (error) {
      console.error("ไม่สามารถเริ่มแชทได้ :", error);
    }
  };

  return (
    <div className="section-container sm:mt-7 mt-6 px-6 py-14">
      <Toaster position="buttom-center" />
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
            <div className="relative">
              <button
                onClick={handleHeartClick}
                className="absolute top-0 right-0  text-red-500 "
              >
                {isHeartFilled ? (
                  <FaHeart size={24} />
                ) : (
                  <FaRegHeart size={24} />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pb-1">
            <p className="text-xl font-semibold mt-3">
              สภาพสินค้า -{" "}
              <span className="text-xl text-base-500">
                {postProductDetail.condition}
              </span>
            </p>
          </div>

          <div className="border-b-1 mt-2"></div>

          <div className="flex items-center justify-between pb-2 mt-4 ">
            <h2 className="text-xl font-semibold ">รายละเอียด</h2>
            <ModalReport postId={postProductDetail._id} />
            {/* <ModalReport name="report_modal" /> */}
          </div>
          <p className="text-sm leading-relaxed mt-2 text-base-800 whitespace-pre-line">
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
            <a className="underline-offset-8 font-medium hover:underline cursor-pointer">
              ดูโปรไฟล์
            </a>
          </div>
          {/* ปุ่มแชท */}
          <button
            disabled={isOwner}
            onClick={handleChat}
            className={`mt-4 flex items-center justify-center px-4 py-2 rounded-2xl w-full transition
    ${
      isOwner
        ? "bg-base-200 cursor-not-allowed opacity-50"
        : "bg-base-200 hover:bg-base-300 cursor-pointer"
    }`}
          >
            <AiOutlineMessage size={20} className="mr-2" />
            แชท
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

      <div className="mt-22">
        <h2 className="text-xl font-semibold mb-4">สินค้าที่คล้ายกัน</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {relatedProducts.slice(0, 5).map((product) => (
            <div
              key={product._id}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                navigate(`/postproductdetail/${product._id}`);
              }}
              className="cursor-pointer"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
      <Modal name="login" />
    </div>
  );
};

export default ProductDetail;
