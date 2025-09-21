import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import NotificationService from "../services/notification.service";
import PostService from "../services/postproduct.service";
import StarRating from "./StarRating";

const CLAMP_MARGIN = 8;
const FALLBACK_W = 384;
const FALLBACK_H = 500;

const getScrollParents = (node) => {
  const parents = [];
  if (!node) return parents;
  let parent = node.parentElement;
  const scrollRegex = /(auto|scroll|overlay)/;
  while (parent && parent !== document.body) {
    const style = getComputedStyle(parent);
    const canScroll =
      scrollRegex.test(style.overflow) ||
      scrollRegex.test(style.overflowY) ||
      scrollRegex.test(style.overflowX);
    if (canScroll) parents.push(parent);
    parent = parent.parentElement;
  }
  return parents;
};

const NotificationModal = ({ onClose, anchorRef }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const modalRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [flipUp, setFlipUp] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await NotificationService.getNotifications();
        let notis = res?.data?.data?.notifications || [];
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

        if (alive) {
          setNotifications(notisWithPosts);

          await NotificationService.markAllAsRead();
        }
      } catch (e) {
        console.error(e);
        if (alive) setNotifications([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const updatePosition = useCallback(() => {
    const anchor = anchorRef?.current;
    const modal = modalRef?.current;
    if (!anchor || !modal) return;

    const rect = anchor.getBoundingClientRect();
    const modalW = modal.offsetWidth || FALLBACK_W;
    const modalH = modal.offsetHeight || FALLBACK_H;

    let left = rect.left;
    if (left + modalW > window.innerWidth - CLAMP_MARGIN) {
      left = window.innerWidth - modalW - CLAMP_MARGIN;
    }
    if (left < CLAMP_MARGIN) left = CLAMP_MARGIN;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const shouldFlip = spaceBelow < modalH && spaceAbove > spaceBelow;

    const top = shouldFlip
      ? Math.max(CLAMP_MARGIN, rect.top - modalH - 8)
      : Math.min(window.innerHeight - CLAMP_MARGIN - modalH, rect.bottom + 8);

    setFlipUp(!!shouldFlip);
    setCoords({ top, left });
  }, [anchorRef]);

  useLayoutEffect(() => {
    updatePosition();
  }, [updatePosition]);

  useEffect(() => {
    const opts = { passive: true };

    window.addEventListener("resize", updatePosition, opts);
    window.addEventListener("scroll", updatePosition, opts);

    const parents = getScrollParents(anchorRef?.current);
    parents.forEach((p) => p.addEventListener("scroll", updatePosition, opts));

    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", updatePosition, opts);
      vv.addEventListener("scroll", updatePosition, opts);
    }

    const ro =
      "ResizeObserver" in window
        ? new ResizeObserver(() => updatePosition())
        : null;
    if (ro) {
      if (anchorRef?.current) ro.observe(anchorRef.current);
      if (modalRef?.current) ro.observe(modalRef.current);
    }

    const onPointerDown = (e) => {
      const modal = modalRef.current;
      const anchor = anchorRef?.current;
      if (!modal || !anchor) return;
      if (!modal.contains(e.target) && !anchor.contains(e.target)) onClose?.();
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
      parents.forEach((p) => p.removeEventListener("scroll", updatePosition));
      if (vv) {
        vv.removeEventListener("resize", updatePosition);
        vv.removeEventListener("scroll", updatePosition);
      }
      if (ro) ro.disconnect();
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [anchorRef, updatePosition, onClose]);

  const content = (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="notif-title"
      className={`fixed z-[1000] w-[90vw] sm:w-96 max-h-[70vh] overflow-y-auto
                  bg-base-100  rounded-xl shadow-xl p-4
                  transition-transform duration-150 ease-out
                  ${flipUp ? "origin-bottom" : "origin-top"}`}
      style={{ top: coords.top, left: coords.left }}
    >
      <div
        aria-hidden
        className={`absolute ${
          flipUp ? "bottom-[-6px]" : "top-[-6px]"
        } left-6 w-3 h-3 rotate-45 bg-white shadow-sm`}
      />
      <div className="flex justify-between items-center mb-3">
        <h2 id="notif-title" className="text-lg font-semibold">
          แจ้งเตือน
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 rounded-lg px-2 py-1"
          aria-label="Close"
        >
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
                className="rounded-lg p-3 flex flex-col gap-2 bg-base-100  shadow-sm"
              >
                <div className="flex gap-3 items-center flex-wrap sm:flex-nowrap">
                  {post?.images?.[0] && (
                    <img
                      src={post.images[0]}
                      alt={post.productName}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0"
                      loading="lazy"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">
                      {post?.productName}
                    </h3>
                    <p className="text-base-600">฿ {post?.price}</p>

                    {canRate && (
                      <StarRating
                        postId={post._id}
                        onRated={() => {
                          setNotifications((prev) =>
                            prev.filter((x) => x._id !== n._id)
                          );
                          requestAnimationFrame(updatePosition);
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

  return createPortal(content, document.body);
};

export default NotificationModal;
