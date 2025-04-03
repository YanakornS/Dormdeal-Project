import React from "react";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { CiUser } from "react-icons/ci";
import { BiCategory } from "react-icons/bi";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoWarningOutline } from "react-icons/io5";

const ModProfileMenu = () => {
  const { user, logout, getUser, isLoading } = useContext(AuthContext);
  const userInfo = getUser();
  console.log("User Object:", user);
  console.log("User Role:", user?.role);
  console.log("User Info:", userInfo);
  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="dropdown dropdown-end">
          <a
            href="/post"
            role="button"
            className="btn btn-ghost flex items-center"
          >
            <div className="indicator flex items-center gap-2">
              <IoWarningOutline className="w-6 h-6" />
              <span className="text-sm font-light text-l">
                ตรวจสอบรายงานปัญหา
              </span>
            </div>
          </a>
        </div>

        <div className="dropdown dropdown-end ">
          <a
            href="/post"
            role="button"
            className="btn btn-ghost flex items-center"
          >
            <div className="indicator flex items-center gap-2">
              <IoBagCheckOutline className="w-6 h-6" />
              <span className="text-sm font-light text-l">
                ตรวจสอบโพสต์ซื้อขาย
              </span>
            </div>
          </a>
        </div>

        <div className="dropdown dropdown-end ">
          <a
            href="/post"
            role="button"
            className="btn btn-ghost flex items-center"
          >
            <div className="indicator flex items-center gap-2">
              <BiCategory className="w-6 h-6" />
              <span className="text-sm font-light text-l">
                จัดการหมวดหมู่สินค้า
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
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a href="/">ตรวจสอบรายงานปัญหา</a>
            </li>
            <li>
              <a href="/">ตรวจสอบโพสต์ซื้อขาย</a>
            </li>
            <li>
              <a href="/">จัดการหมวดหมู่สินค้า</a>
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

export default ModProfileMenu;
