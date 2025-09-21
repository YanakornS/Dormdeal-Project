import React, { useState } from "react";
import PostService from "../services/postproduct.service";
import Swal from "sweetalert2";

const StarRating = ({ postId, initialRating = 0, onRated }) => {
  const [selectedRating, setSelectedRating] = useState(initialRating);
  const [loading, setLoading] = useState(false);
  const [rated, setRated] = useState(false);

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
      await PostService.rateSeller(postId, { rating: selectedRating });
      setRated(true);

      if (onRated) onRated(postId);

      Swal.fire({
        icon: "success",
        title: `คุณให้ ${selectedRating} คะแนนสำเร็จ!`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error rating seller:", err);
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถให้คะแนนได้",
        text: err.response?.data?.message || "กรุณาลองใหม่",
      });
    } finally {
      setLoading(false);
    }
  };

  if (rated)
    return <div className="text-green-600 font-medium">คุณให้คะแนนแล้ว</div>;

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
            : "bg-gray-500 cursor-not-allowed"
        }`}
      >
        {loading ? "กำลังบันทึก..." : "ยืนยัน"}
      </button>
    </div>
  );
};

export default StarRating;
