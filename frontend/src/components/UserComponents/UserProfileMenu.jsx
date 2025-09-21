import { useRef } from "react";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useChatStore } from "../../stores/useChatStore";
import NotificationService from "../../services/notification.service";
import { CiUser } from "react-icons/ci";
import { BiBell, BiMessageSquareDetail } from "react-icons/bi";
import { LuPlus } from "react-icons/lu";
import NotificationModal from "../NotificationModal";
const UserMenu = () => {
  const { user, logout, getUser } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const openNotificationModal = () => setIsNotificationOpen(true);
  const closeNotificationModal = () => setIsNotificationOpen(false);
  const notificationBtnRef = useRef(null);
  const handleGoToPost = () => {
    navigate("/post", { state: { breadcrumb: ["หน้าแรก"] } });
  };

  const totalUnread = useChatStore((state) => state.getTotalUnread());
  const userInfo = getUser();

  const handleLogout = () => logout();

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await NotificationService.getNotifications();
        setUnreadCount(res.data.data.unreadCount || 0);
      } catch (err) {
        console.error(err);
        setUnreadCount(0);
      }
    };
    fetchUnread();
  }, []);

  return (
    <>
      <div className="flex items-center gap-4 ">
        <div className="dropdown dropdown-end">
          <a
            onClick={handleGoToPost}
            href="/post"
            data-test="post-button"
            role="button"
            className="btn btn-ghost flex items-center"
          >
            <div className="indicator flex items-center gap-2">
              <LuPlus className="w-6 h-6" />
              <span className="text-sm font-light text-l">เริ่มโพสต์</span>
            </div>
          </a>
        </div>

        <button
          ref={notificationBtnRef}
          onClick={openNotificationModal}
          className="btn btn-ghost btn-circle"
        >
          <div className="indicator">
            <BiBell className="w-6 h-6" />
            <span className="badge badge-xs badge-soft badge-primary indicator-item">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </div>
        </button>

        <a href="/chat" className="btn btn-ghost btn-circle">
          <div className="indicator">
            <BiMessageSquareDetail className="w-6 h-6" />
            {totalUnread > 0 && (
              <span className="badge badge-soft badge-primary badge-xs indicator-item">
                {totalUnread > 9 ? "9+" : totalUnread}
              </span>
            )}
          </div>
        </a>

        <div className="dropdown dropdown-end">
          <div
            className="btn-profile flex items-center gap-2 transition transform duration-300"
            tabIndex={0}
            role="button"
            data-test="profile-button"
            aria-label="Profile Button"
          >
            <CiUser className="w-6 h-6" />
            <span className="hidden lg:inline-block truncate">
              {user?.displayName || "ผู้ใช้"}
            </span>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a href={`/ManagePostStatus`} data-test="my-managepoststatus">
                จัดการโพสต์ประกาศ
              </a>
            </li>
            {userInfo?._id && (
              <li>
                <a
                  href={`/ManagePost/${userInfo._id}`}
                  data-test="my-announcement"
                >
                  โพสต์ประกาศของฉัน
                </a>
              </li>
            )}
            <li>
              <a href="/wishlish">รายการสินค้าที่สนใจ</a>
            </li>
            <li>
              <a href="/profile">แก้ไขโปรไฟล์</a>
            </li>
            <li>
              <a onClick={handleLogout} href="/">ออกจากระบบ</a>
            </li>
          </ul>
        </div>

        {isNotificationOpen && (
          <NotificationModal
            onClose={closeNotificationModal}
            anchorRef={notificationBtnRef}
          />
        )}
      </div>
    </>
  );
};

export default UserMenu;
