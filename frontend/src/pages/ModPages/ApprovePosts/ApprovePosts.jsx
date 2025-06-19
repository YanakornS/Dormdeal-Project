import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import ModPostService from "../../../services/mod.service";

import { useNavigate } from "react-router";

import Swal from "sweetalert2";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import { AiOutlineMessage } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa6";
import { PiWarningCircle } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import { FaRegEdit, FaRegCheckCircle } from "react-icons/fa";

const ApprovePosts = () => {
  const [postProductDetail, setPostProductDetail] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { id } = useParams();

  const navigate = useNavigate();

  // ฟอร์แมตราคาให้ดูสวย
  const formatPrice = (price) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // ดึงโพสต์จาก backend เมื่อโหลดหน้า
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await ModPostService.getPostByIdMod(id);
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

  // แปลง status เป็นข้อความไทย
  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "ผ่านการตรวจสอบ";
      case "rejected":
        return "ไม่ผ่านการตรวจสอบ";
      case "needs_revision":
        return "ต้องแก้ไข";
      default:
        return status;
    }
  };

  // ฟังก์ชันเปลี่ยนสถานะโพสต์
  const handleApproveStatus = async (status) => {
    try {
      let payloadrejected = { action: status };

      //  ถ้าสถานะคือ rejected ลบโพสต์
      if (status === "rejected") {
        const confirm = await Swal.fire({
          title: "ยืนยันการไม่อนุมัติโพสต์?",
          text: "โพสต์นี้จะถูกปฏิเสธและจะถูกลบออกจากรายการ",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "ยืนยัน",
          cancelButtonText: "ยกเลิก",
        });

        if (!confirm.isConfirmed) return;

        const payload = {
          action: "rejected",
          message: "ขออภัย โพสต์ประกาศของคุณไม่ผ่านการตรวจสอบครับ",
        };

        const response = await ModPostService.reviewPostByMod(id, payload);
        if (response.status === 200) {
          Swal.fire({
            title: "ดำเนินการสำเร็จ",
            text: "โพสต์ถูกปฏิเสธเรียบร้อยแล้ว",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            navigate("/mod", { replace: true });
          });
        }

        return;
      }

      let payload = { action: status };

      //  ถ้าสถานะคือ needs_revision ต้องแก้ไข
      if (status === "needs_revision") {
        const { value: reason } = await Swal.fire({
          title: "เลือกเหตุผลให้ผู้ใช้แก้ไข",
          input: "select",
          inputOptions: {
            "ข้อมูลไม่ครบถ้วน – กรุณาเพิ่มรายละเอียดสินค้า":
              "ข้อมูลไม่ครบถ้วน – กรุณาเพิ่มรายละเอียดสินค้า",
            "รูปภาพไม่เหมาะสม – กรุณาเปลี่ยนรูปให้ชัดเจน":
              "รูปภาพไม่เหมาะสม – กรุณาเปลี่ยนรูปให้ชัดเจน",
            "หมวดหมู่ไม่ถูกต้อง – กรุณาเลือกหมวดหมู่ใหม่":
              "หมวดหมู่ไม่ถูกต้อง – กรุณาเลือกหมวดหมู่ใหม่",
            "ราคาผิดพลาด – กรุณาตรวจสอบและแก้ไขราคา":
              "ราคาผิดพลาด – กรุณาตรวจสอบและแก้ไขราคา",
            "รายละเอียดไม่ตรงกับสินค้า – กรุณาปรับให้ตรงกับสินค้าจริง":
              "รายละเอียดไม่ตรงกับสินค้า – กรุณาปรับให้ตรงกับสินค้าจริง",
            "ข้อความไม่เหมาะสม – กรุณาแก้ไขเนื้อหาให้เหมาะสม":
              "ข้อความไม่เหมาะสม – กรุณาแก้ไขเนื้อหาให้เหมาะสม",
            "สินค้าผิดกฎแพลตฟอร์ม – กรุณาปรับให้ถูกต้อง":
              "สินค้าผิดกฎแพลตฟอร์ม – กรุณาปรับให้ถูกต้อง",
            "สลิปไม่ชัดเจน – กรุณาแนบสลิปที่อ่านได้":
              "สลิปไม่ชัดเจน – กรุณาแนบสลิปที่อ่านได้",
            "สลิปผิดหรืออาจเป็นของปลอม – ตรวจสอบและอัปโหลดใหม่":
              "สลิปผิดหรืออาจเป็นของปลอม – ตรวจสอบและอัปโหลดใหม่",
          },
          inputPlaceholder: "เลือกเหตุผล...",
          showCancelButton: true,
          confirmButtonText: "ส่งกลับ",
          cancelButtonText: "ยกเลิก",
        });

        if (!reason) {
          Swal.fire("โปรดเลือกเหตุผล", "", "warning");
          return;
        }

        payload.message = reason;
      }

      // ถ้าสถานะคือ confirm ปกติ
      const confirm = await Swal.fire({
        title: "ยืนยันการเปลี่ยนสถานะ?",
        // text: `คุณต้องการตั้งโพสต์นี้เป็น "${getStatusText(status)}" ใช่หรือไม่?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
      });

      if (!confirm.isConfirmed) return;

      // เรียก service ไปยัง backend
      const response = await ModPostService.reviewPostByMod(id, payload);

      if (response.status === 200) {
        Swal.fire({
          title: "สำเร็จ",
          text: `อัปเดตสถานะเป็น "${getStatusText(status)}" แล้ว`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          navigate("/mod", { replace: true });
        });
      }
    } catch (error) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: error?.response?.data?.message || error.message,
        icon: "error",
      });
    }
  };

  if (!postProductDetail) return <div className="p-10">Loading...</div>;

  return (
    <div className="section-container sm:mt-7 mt-6 px-6 py-14 ">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="flex flex-col">
          <img
            src={postProductDetail.images?.[0]}
            alt="Main Product"
            className="w-130 h-130 rounded-lg shadow-md object-cover cursor-pointer"
            onClick={() => {
              setCurrentIndex(0);
              setLightboxOpen(true);
            }}
          />
          <div className="flex mt-2 space-x-2">
            {postProductDetail.images?.slice(1).map((img, index) => (
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

        {/* Product Detail Section */}
        <div>
          <h1 className="text-2xl font-bold">
            {postProductDetail.productName}
          </h1>
          <div className="flex items-center justify-between my-2">
            <p className="text-3xl font-bold">
              {formatPrice(postProductDetail.price)}
            </p>
            <button className="text-red-500 hover:text-red-500">
              <FaRegHeart size={24} />
            </button>
          </div>
          <p className="text-xl font-semibold mt-3">
            สภาพสินค้า -{" "}
            <span className="text-xl text-gray-500">
              {postProductDetail.condition}
            </span>
          </p>
          <div className="border-b my-4" />
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-xl font-semibold">รายละเอียด</h2>
            <button className="flex items-center btn-report">
              <PiWarningCircle className="mr-2" size={24} />
              รายงานโพสต์
            </button>
          </div>
          <p className=" text-sm leading-relaxed">
            {postProductDetail.description}
          </p>
        </div>

        {/* Seller Info */}
        <div className="shadow-lg p-6 w-full sm:w-[400px] rounded-2xl mt-6">
          <h2 className="text-xl mb-4">รายละเอียดผู้ขาย</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={postProductDetail.owner?.photoURL}
                alt="User"
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
        index={currentIndex}
        styles={{ container: { backgroundColor: "rgba(0, 0, 0, 0.2)" } }}
      />

      <div className="flex bg-gray-300 justify-center items-center gap-4 mt-12 p-4 rounded-2xl ">
        {/* ปุ่มไม่ผ่านการตรวจสอบ (ลบ) */}
        <button
          className="flex items-center justify-center px-6 py-3 w-full text-base rounded-xl border text-white bg-red-500 border-red-500 hover:bg-red-400 transition-all"
          // onClick={handleRejectPost}
          onClick={() => handleApproveStatus("rejected")}
        >
          <IoClose className="text-white w-8 h-8 mr-2" />
          ไม่ผ่านการตรวจสอบ
        </button>

        {/* ปุ่มต้องแก้ไข */}
        <button
          className="flex items-center justify-center px-6 py-3 w-full text-base rounded-xl border text-white bg-gray-700 border-gray-400 hover:bg-gray-400 transition-all"
          onClick={() => handleApproveStatus("needs_revision")}
        >
          <FaRegEdit className="text-white w-8 h-8 mr-2" />
          ต้องแก้ไข
        </button>

        {/* ปุ่มผ่านการตรวจสอบ */}
        <button
          className="flex items-center justify-center px-6 py-3 w-full text-base rounded-xl border text-white bg-green-500 border-green-500 hover:bg-green-400 transition-all"
          onClick={() => handleApproveStatus("approved")}
        >
          <FaRegCheckCircle className="text-white w-8 h-8 mr-2" />
          ผ่านการตรวจสอบ
        </button>
      </div>
    </div>
  );
};

export default ApprovePosts;
