import React from "react";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { CiUser } from "react-icons/ci";
import { BiBell, BiMessageSquareDetail } from "react-icons/bi";
import { LuPlus } from "react-icons/lu";

const UserMenu = () => {
  const { user, logout, getUser } = useContext(AuthContext);

  const handleGoToPost = () => {
    navigate("/post", { state: { breadcrumb: ["หน้าแรก"] } });
  };

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

        <div className="dropdown dropdown-end">
          <a href="/alerts" role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <BiMessageSquareDetail className="w-6 h-6" />
              <span className="badge badge-xs badge-error indicator-item">
                8
              </span>
            </div>
          </a>
        </div>

        <div className="dropdown dropdown-end">
          <div
            className="btn-profile flex items-center gap-2 hover:scale-105 transition transform duration-300"
            tabIndex={0}
            role="button"
            aria-label="Profile Button"
          >
            <CiUser className="w-6 h-6" />
            <span className="hidden lg:inline-block truncate">
              {user?.displayName || "ผู้ใช้"}
            </span>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a href="/ManagePostStatus">จัดการโพสต์ประกาศ</a>
            </li>
            <li>
              <a href="/ManagePost">โพสต์ประกาศของฉัน</a>
            </li>
            <li>
              <a href="/">รายการสินค้าที่สนใจ</a>
            </li>
            <li>
              <a href="/">แก้ไขโปรไฟล์</a>
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
