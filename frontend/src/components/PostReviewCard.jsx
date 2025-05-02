import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import PostService from "../services/postproduct.service";
import Swal from "sweetalert2";

import { useState } from "react";

const PostReviewCard = ({ post, onDelete = () => {} }) => {
  const isRevision = post.status === "needs_revision";

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
    <div className="relative flex items-center justify-between w-full max-w-4xl bg-white rounded-xl p-4 shadow-sm">
      {/* 🔥 Badge โฆษณา */}
      {post.postPaymentType === "Paid" && (
        <div className="absolute top-3 left-4">
          <span className="badge badge-warning px-1 py-1 text-xs font-semibold">
            🔥 โฆษณา
          </span>
        </div>
      )}

      {/* ซ้าย: รูป + ข้อมูลสินค้า */}
      <div className="flex items-center gap-4">
        <img
          src={post.images?.[0]}
          alt={post.productName}
          className="w-24 h-24 object-cover rounded-lg"
        />
        <div>
          <h2 className="text-sm font-semibold break-words leading-snug">
            {post.productName}
          </h2>
          <p className="text-base font-bold text-black mt-2">
            ฿ {post.price?.toLocaleString()}
          </p>
          <div>
            {post.status === "rejected" && post.modNote && (
              <p className="text-sm text-red-500 mt-1">
                {post.modNote}
              </p>
            )}
          </div>
        </div>
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
          <button className="btn border-vivid rounded-lg btn-sm px-8 text-vivid">
            แก้ไข
          </button>
        </div>
      )}
    </div>
  );
};

export default PostReviewCard;
