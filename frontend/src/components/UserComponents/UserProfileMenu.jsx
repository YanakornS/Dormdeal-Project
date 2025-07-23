import React from "react";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { useChatStore } from "../../stores/useChatStore";

import { CiUser } from "react-icons/ci";
import { BiBell, BiMessageSquareDetail } from "react-icons/bi";
import { LuPlus } from "react-icons/lu";

const UserMenu = () => {
  //ใช้ฟังก์ชันgetUserคืนข้อมูลผู้ใช้ละเอียดกว่า user
  const { user, logout, getUser } = useContext(AuthContext);

  //ใช้เพื่อนำผู้ใช้ไปยังหน้า /post และส่ง breadcrumb เพื่อบอกทางกลับ
  const handleGoToPost = () => {
    navigate("/post", { state: { breadcrumb: ["หน้าแรก"] } });
  };
  const totalUnread = useChatStore((state) => state.getTotalUnread());

  const userInfo = getUser();
  console.log("User Info:", userInfo);

  const handleLogout = () => {
    logout();
  };

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

        <div className="dropdown dropdown-end">
          <a
            href="/notifications"
            role="button"
            className="btn btn-ghost btn-circle"
          >
            <div className="indicator">
              <BiBell className="w-6 h-6" />
              <span className="badge badge-xs badge-error indicator-item">
                5
              </span>
            </div>
          </a>
        </div>

        <a href="/chat" className="btn btn-ghost btn-circle">
          <div className="indicator">
            <BiMessageSquareDetail className="w-6 h-6" />
            {totalUnread > 0 && (
              <span className="badge badge-error badge-xs indicator-item">
                {totalUnread > 9 ? "9+" : totalUnread}
              </span>
            )}
          </div>
        </a>

        <div className="dropdown dropdown-end">
          <div
            className="btn-profile flex items-center gap-2 hover:scale-105 transition transform duration-300"
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
              <a href={`/ManagePostStatus`}
              data-test="my-announcement">จัดการโพสต์ประกาศ</a>
            </li>
            {/* userInfo	เก็บผลลัพธ์จาก getUser() (เช่น _id) */}
            {userInfo?._id && (
              <li>
                <a href={`/ManagePost/${userInfo._id}`}
                data-test="my-announcement">โพสต์ประกาศของฉัน</a>
              </li>
            )}

            {/* sdfsfsefsefs */}
            <li>
              <a href="/wishlish">รายการสินค้าที่สนใจ</a>
            </li>
            <li>
              <a href="/profile">แก้ไขโปรไฟล์</a>
            </li>
            <li>
              <a onClick={handleLogout}>ออกจากระบบ</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default UserMenu;
