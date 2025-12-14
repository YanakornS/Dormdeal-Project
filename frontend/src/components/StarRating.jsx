import React, { useState } from "react";
import PostService from "../services/postproduct.service";
import Swal from "sweetalert2";

const StarRating = ({ postId, initialRating = 0, onRated }) => {
  const [selectedRating, setSelectedRating] = useState(initialRating);
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
      Swal.fire({
        title: "กำลังบันทึก...",
        text: "กำลังบันทึกคะแนนโปรดรอสักครู่",
        icon: "info",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await PostService.rateSeller(postId, { rating: selectedRating });
      setRated(true);

      if (onRated) onRated(postId);

      Swal.fire({
        icon: "success",
        title: `คุณให้ ${selectedRating} คะแนนสำเร็จ!`,
        timer: 4500,
        showConfirmButton: false,
        didOpen: (popup) => {
          const title = popup.querySelector(".swal2-title");
          if (title) {
            title.setAttribute("data-test", "swal-rating-success-title");
          }
        },
      });
    } catch (err) {
      console.error("Error rating seller:", err);
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถให้คะแนนได้",
        text: err.response?.data?.message || "กรุณาลองใหม่",
      });
    }
  };

  if (rated)
    return <div className="text-green-600 font-medium" data-test="notification-rated-success-message">คุณให้คะแนนแล้ว</div>;

  return (
    <div className="flex items-center justify-between mt-2 gap-4">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
             data-test={`star-${i}`}
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
        data-test="rating-confirm-button"
        disabled={!selectedRating}
        onClick={handleConfirm}
        className={`px-3 py-1 rounded text-white transition ${
          selectedRating
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-500 cursor-not-allowed"
        }`}
      >
        ยืนยัน
      </button>
    </div>
  );
};

export default StarRating;
