import { useState, useContext } from "react";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { MdOutlineSell } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import PostService from "../services/postproduct.service";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import ModalClosePost from "./ModalClosePost";

const PostProfileCard = ({ product, onDelete = () => {} }) => {
  const { user } = useContext(AuthContext);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // เอาไว้ซ่อนการ์ดหลังปิดการขาย
  const navigate = useNavigate();

  const handleEditPost = () => {
    navigate(`/updatepost/${product._id}`);
  };

  const onMarkSoldOut = () => {
    setShowCloseModal(true);
  };

  const handleDeletePost = async (id) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "โพสต์นี้จะถูกลบแบบถาวร",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบโพสต์",
      cancelButtonText: "ยกเลิก",
      didOpen: () => {
        const confirmButton = document.querySelector(".swal2-confirm");
        if (confirmButton) {
          confirmButton.setAttribute("data-test", "swal-post-delete");
        }
      },
    });

    if (result.isConfirmed) {
      try {
        await PostService.deletePostByOwner(id);
        Swal.fire({
          title: "ลบสำเร็จ",
          text: "โพสต์ถูกลบแล้ว",
          icon: "success",
          timer: 2500, // ปิดเองใน 2.5 วิ
          showConfirmButton: false,
          didOpen: () => {
            const title = document.querySelector(".swal2-title");
            if (title) {
              title.setAttribute("data-test", "swal-post-confirm-delete");
            }
          },
        }).then(() => {
          navigate("/ManagePostStatus");
        });
      } catch (err) {
        Swal.fire(
          "เกิดข้อผิดพลาด",
          err.response?.data?.message || err.message,
          "error"
        );
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!isVisible) return null; // ซ่อนการ์ดออก

  return (
    <div className="card shadow-md flex flex-col h-full relative rounded-xl overflow-hidden">
      <Toaster position="bottom-center" />
      <figure className="relative">
        <img
          src={product.images}
          alt={product.productName}
          className="w-full h-56 object-cover"
        />

        {product.postPaymentType === "Paid" && (
          <span className="badge badge-warning absolute top-2 left-2 text-xs">
            🔥 โฆษณา
          </span>
        )}

        <button
          onClick={() => handleDeletePost(product._id)}
          data-test={`icon-delete-post-${product._id}`}
          className="absolute top-2 right-2 text-black-600 p-1.5 border-1 rounded-lg "
        >
          <FaTrashAlt size={14} />
        </button>
      </figure>

      <div className="card-body px-3 py-4 flex flex-col">
        <h3 className="text-sm font-semibold line-clamp-2 min-h-[42px]">
          {product.productName}
        </h3>

        <p className="text-base font-bold text-base-700 mt-1">
          {formatPrice(product.price)}
        </p>

        <div className="flex justify-between gap-2 mt-3">
          <button
            onClick={handleEditPost}
            data-test={`icon-edit-post-${product._id}`}
            className="btn btn-sm btn-outline w-26 rounded-2xl flex items-center text-vivid hover:bg-vivid border-vivid hover:text-white justify-center gap-1"
          >
            <FaEdit size={14} />
            แก้ไข
          </button>
          <button
            onClick={onMarkSoldOut}
            className="btn btn-sm btn-outline rounded-2xl shadow w-26 flex items-center text-vivid hover:bg-vivid border-vivid hover:text-white justify-center gap-1"
          >
            <MdOutlineSell size={15} />
            ปิดขาย
          </button>
        </div>
      </div>

      {showCloseModal && (
        <ModalClosePost
          postId={product._id}
          onClose={() => setShowCloseModal(false)}
          onSuccess={() => {
            setShowCloseModal(false);
            toast.success("ปิดการขายสำเร็จ");
            setIsVisible(false); // ลบการ์ดออกจากหน้าโดยไม่ต้องรีเฟรช
          }}
        />
      )}
    </div>
  );
};

export default PostProfileCard;
