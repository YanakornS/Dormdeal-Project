import React, { useEffect, useState, useRef } from "react";
import NotificationService from "../services/notification.service";
import PostService from "../services/postproduct.service";
import StarRating from "./StarRating";

const NotificationModal = ({ onClose, anchorRef }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [flipUp, setFlipUp] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const modalWidth = 384;
      const modalHeight = 500;

      let left = rect.left + window.scrollX;

      if (left + modalWidth > window.innerWidth - 10) {
        left = window.innerWidth - modalWidth - 10;
      }
      if (left < 10) left = 10;

      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const shouldFlip = spaceBelow < modalHeight && spaceAbove > spaceBelow;

      setFlipUp(shouldFlip);

      setPosition({
        top: shouldFlip
          ? rect.top + window.scrollY - modalHeight - 5
          : rect.bottom + window.scrollY + 5,
        left,
      });
    }
  }, [anchorRef]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await NotificationService.getNotifications();
        let notis = res.data.data.notifications || [];
        notis = notis.filter((n) => n.requiresRating);

        const notisWithPosts = await Promise.all(
          notis.map(async (n) => {
            if (n.type === "purchase_success" && n.post) {
              try {
                const postData = await PostService.getPostById(n.post._id);
                return { ...n, post: postData };
              } catch {
                return { ...n, post: n.post };
              }
            }
            return n;
          })
        );

        setNotifications(notisWithPosts);
      } catch (err) {
        console.error(err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div
      ref={modalRef}
      className="absolute bg-white rounded-xl shadow-xl w-[90vw] sm:w-96 max-h-[70vh] overflow-y-auto p-4 z-50"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">แจ้งเตือน</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">กำลังโหลด...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center text-gray-500">ไม่มีแจ้งเตือน</div>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => {
            const post = n.post;
            const canRate = n.requiresRating === true;

            return (
              <li
                key={n._id}
                className="rounded-lg p-3 flex flex-col gap-2 bg-gray-50 shadow-sm"
              >
                <div className="flex gap-3 items-center flex-wrap sm:flex-nowrap">
                  {post?.images?.[0] && (
                    <img
                      src={post.images[0]}
                      alt={post.productName}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">
                      {post?.productName}
                    </h3>
                    <p className="text-gray-600">฿ {post?.price}</p>

                    {canRate && (
                      <StarRating
                        postId={post._id}
                        onRated={() => {
                          setNotifications((prev) =>
                            prev.filter((notif) => notif._id !== n._id)
                          );
                        }}
                      />
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default NotificationModal;
