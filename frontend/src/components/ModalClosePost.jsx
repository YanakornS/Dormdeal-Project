import { useEffect, useState } from "react";
import PostService from "../services/postproduct.service";
import Swal from "sweetalert2";

const ModalClosePost = ({ postId, onClose, onSuccess }) => {
  const [post, setPost] = useState(null);
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postData = await PostService.getPostById(postId);
        const interested = await PostService.getInterestedUsers(postId);
        setPost(postData);
        setInterestedUsers(interested || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [postId]);

  const handleBuyerSelection = (userId) => {
    setSelectedBuyer((prev) => (prev === userId ? null : userId));
  };

  const handleCloseSale = async () => {
    if (!selectedBuyer) {
      alert("กรุณาเลือกผู้ซื้ออย่างน้อยหนึ่งคน");
      return;
    }

    const confirm = await Swal.fire({
      title: "ยืนยันการปิดการขาย?",
      text: "คุณต้องการปิดการขายและขายให้ผู้ซื้อที่เลือกใช่หรือไม่",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    });

    if (!confirm.isConfirmed) return;

    try {
      await PostService.closePostAndNotify(postId, {
        buyerIds: [selectedBuyer],
      });
      if (onSuccess) onSuccess(postId); // ส่ง id กลับไปเพื่อซ่อนสินค้า
      onClose();
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการปิดการขาย");
    }
  };

  if (loading)
    return <div className="text-center py-10 text-gray-600">กำลังโหลด...</div>;

  return (
    <div className="modal modal-open bg-black bg-opacity-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="modal-box max-w-md w-full bg-white rounded-xl shadow-lg p-6 relative animate-scaleIn">
        <h3 className="font-bold text-2xl mb-4 text-center text-gray-800">
          ปิดการขาย
        </h3>

        {post && (
          <div className="border border-gray-300 rounded-lg p-4 flex items-center gap-4 mb-6 bg-gray-50">
            <img
              src={post.images}
              alt={post.productName}
              className="w-20 h-20 object-cover rounded-md shadow-sm"
            />
            <div>
              <div className="font-semibold text-lg text-gray-900">
                {post.productName}
              </div>
              <div className="text-gray-700 mt-1 text-sm">
                ราคา: <span className="font-bold">{post.price} บาท</span>
              </div>
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">
            รายชื่อคนที่สนใจล่าสุด
          </h4>
          {interestedUsers.length > 0 ? (
            <ul className="max-h-52 overflow-y-auto divide-y divide-gray-200 rounded-md border border-gray-200">
              {interestedUsers.map((user) => (
                <li
                  key={user.userId}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleBuyerSelection(user.userId)}
                >
                  <input
                    type="radio"
                    name="buyer"
                    value={user.userId}
                    checked={selectedBuyer === user.userId}
                    onChange={() => handleBuyerSelection(user.userId)}
                    className="form-radio h-5 w-5 text-indigo-600"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt={user.displayName}
                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                  />
                  <span className="text-gray-900 font-medium">{user.displayName}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic text-center py-4">ยังไม่มีคนสนใจ</p>
          )}
        </div>

        <div className="modal-action mt-6 flex justify-end gap-3">
          <button
            className="btn btn-ghost px-5 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition"
            onClick={onClose}
          >
            ยกเลิก
          </button>
          <button
            className={`btn btn-primary px-5 py-2 rounded-lg text-white transition ${
              !selectedBuyer
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
            onClick={handleCloseSale}
            disabled={!selectedBuyer}
          >
            ยืนยันปิดการขาย
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalClosePost;
