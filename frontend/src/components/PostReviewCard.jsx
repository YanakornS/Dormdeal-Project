import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import PostService from "../services/postproduct.service";
import Swal from "sweetalert2";
import Index from "../pages/PostProduct/Index";
import { useNavigate } from "react-router";
import { useState } from "react";

const PostReviewCard = ({ post, onDelete = () => {} }) => {
  const isRevision = post.status === "needs_revision";
  const navigate = useNavigate();

  const handleEditPost = () => {
    navigate(`/updatepost/${post._id}`);
  };

  const handleDeletePost = async (id) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "โพสต์นี้จะถูกลบแบบถาวร",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบโพสต์",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        await PostService.deletePostByOwner(id);
        Swal.fire("ลบสำเร็จ", "โพสต์ถูกลบแล้ว", "success");

        if (typeof onDelete === "function") {
          onDelete();
        }
      } catch (err) {
        Swal.fire(
          "เกิดข้อผิดพลาด",
          err.response?.data?.message || err.message,
          "error"
        );
      }
    }
  };
  console.log("status:", post.status);
  console.log("modNote:", post.modNote);

  return (
    <div className="relative flex flex-col sm:flex-row   items-start sm:items-center justify-between w-full max-w-4xl rounded-xl p-4 pt-2  gap-3">
      {/* 🔥 Badge โฆษณา */}
      {post.postPaymentType === "Paid" && (
        <div className="absolute top-1 left-4">
          <span className="badge badge-warning px-1 py-1 text-xs font-semibold sm:items-center  justify-between w-full max-w-4xl rounded-xl p-2 ">
            🔥 โฆษณา
          </span>
        </div>
      )}

      {/* ซ้าย: รูป + ข้อมูลสินค้า */}
      <div className="flex items-center gap-4 flex-1">
        <img
          src={post.images?.[0]}
          alt={post.productName}
          className="w-24 h-24 object-cover rounded-lg"
        />
        <div>
          <h2 className="text-sm font-semibold break-words leading-snug">
            {post.productName}
          </h2>
          <p className="text-base font-bold  mt-2">
            ฿ {post.price?.toLocaleString()}
          </p>
          <div>
            {post.status === "rejected" && post.modNote && (
              <p className="text-sm text-red-500 mt-1">{post.modNote}</p>
            )}
          </div>
          <div>
            {(post.status === "sold" || post.status === "sold") &&
              post.modNote && (
                <p className="text-sm text-green-600 mt-1">{post.modNote}</p>
              )}
          </div>
        </div>
      </div>

      {/*  ปุ่มฝั่งขวา */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        {/* ปุ่มลบอันแรก: สำหรับ pending_review หรือ rejected */}
        {(post.status === "pending_review" || post.status === "rejected") && (
          <button
            onClick={() => handleDeletePost(post._id)}
            className="btn btn-outline btn-sm px-3 rounded-lg text-black-600"
          >
            <FaTrashAlt />
          </button>
        )}
      </div>

      {/* ปุ่มลบ + แก้ไข (เฉพาะ status: needs_revision) */}
      {isRevision && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDeletePost(post._id)}
            className="btn btn-outline btn-sm px-3 rounded-lg text-black-600"
          >
            <FaTrashAlt />
          </button>
          <button
            onClick={handleEditPost}
            className="btn border-vivid rounded-lg btn-sm px-8 text-vivid"
          >
            แก้ไข
          </button>
        </div>
      )}
    </div>
  );
};

export default PostReviewCard;
