import React, { useState } from "react";
import PostService from "../services/postproduct.service";
import Swal from "sweetalert2";

const StarRating = ({ postId, initialRating = 0, onRated }) => {
  const [selectedRating, setSelectedRating] = useState(initialRating);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selectedRating) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเลือกคะแนนก่อนยืนยัน",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await PostService.rateSeller(postId, {
        rating: selectedRating,
      });

      Swal.fire({
        icon: "success",
        title: `คุณให้ ${selectedRating} คะแนนสำเร็จ!`,
        timer: 1500,
        showConfirmButton: false,
      });

      if (onRated) {
        onRated(selectedRating, res.data?.data?.sellerNewRating);
      }
    } catch (err) {
      console.error("Error rating seller:", err);
      const msg =
        err.response?.data?.message || "ไม่สามารถให้คะแนนได้ กรุณาลองใหม่";
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between mt-2 gap-4">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`cursor-pointer text-2xl ${
              i <= selectedRating ? "text-yellow-400" : "text-gray-300"
            }`}
            onClick={() => setSelectedRating(i)}
          >
            ★
          </span>
        ))}
      </div>

      <button
        disabled={!selectedRating || loading}
        onClick={handleConfirm}
        className={`px-3 py-1 rounded text-white transition ${
          selectedRating && !loading
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        {loading ? "กำลังบันทึก..." : "ยืนยัน"}
      </button>
    </div>
  );
};

export default StarRating;
