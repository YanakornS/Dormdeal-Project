import React from "react";

const PostReviewCard = ({ post }) => {
  return (
    <div
      key={post._id}
      className="relative flex gap-4 items-start w-full max-w-xl bg-white  rounded-xl p-4"
    >
      {/* 🔥 Badge โฆษณา */}
      {post.postPaymentType === "Paid" && (
        <div className="absolute top-3 left-4">
          <span className="badge badge-warning px-1 py-1 text-xs font-semibold">
            🔥 โฆษณา
          </span>
        </div>
      )}

      {/* รูปภาพสินค้า */}
      <img
        src={post.images?.[0]}
        alt={post.productName}
        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
      />

      {/* ข้อมูลโพสต์ */}
      <div className="flex flex-col justify-center w-full">
        <h2 className="text-sm font-semibold break-words leading-snug">
          {post.productName}
        </h2>

        <p className="text-base font-bold text-black mt-2">
          ฿ {post.price?.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default PostReviewCard;
