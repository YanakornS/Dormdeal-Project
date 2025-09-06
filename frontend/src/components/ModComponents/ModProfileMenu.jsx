import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { CiUser } from "react-icons/ci";
import { BiCategory } from "react-icons/bi";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoWarningOutline } from "react-icons/io5";

const ModProfileMenu = () => {
  const { user, logout, getUser, isLoading } = useContext(AuthContext); // ใช้ useContext เข้าถึง Fn ที่เก็บไว้ใน Authcontext
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
            href="/mod/reportpost"
            role="button"
            data-test="modmenu-link-reportpost"
            className="btn btn-ghost flex items-center"
          >
            <div className="indicator flex items-center gap-2">
              <IoWarningOutline className="w-6 h-6" />
              <span className="hidden 2xl:inline text-sm font-light">
                ตรวจสอบรายงานปัญหา
              </span>
            </div>
          </a>
        </div>

        <div className="dropdown dropdown-end ">
          <a
            href="/mod"
            role="button"
            data-test="modmenu-link-posts"
            className="btn btn-ghost flex items-center"
          >
            <div className="indicator flex items-center gap-2">
              <IoBagCheckOutline className="w-6 h-6" />
              <span className="hidden 2xl:inline text-sm font-light">
                ตรวจสอบโพสต์ซื้อขาย
              </span>
            </div>
          </a>
        </div>

        <div className="dropdown dropdown-end ">
          <a
            href="/mod/managecategories"
            role="button"
            data-test="modmenu-link-categories"
            className="btn btn-ghost flex items-center"
          >
            <div className="indicator flex items-center gap-2">
              <BiCategory className="w-6 h-6" />
              <span className="hidden 2xl:inline text-sm font-light">
                จัดการหมวดหมู่สินค้า
              </span>
            </div>
          </a>
        </div>

        <div className="dropdown dropdown-end">
          <div
            className="btn-profile flex items-center gap-2 transition transform duration-300"
            tabIndex={0}
            role="button"
            aria-label="Profile Button"
            data-test="modmenu-profile-button"
          >
            <CiUser className="w-6 h-6" />
            <span className="hidden lg:inline truncate">
              {userInfo?.displayName || "ผู้ใช้"}
            </span>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a href="/mod/reportpost" data-test="modmenu-dropdown-report">
                ตรวจสอบรายงานปัญหา
              </a>
            </li>
            <li>
              <a href="/mod" data-test="modmenu-dropdown-posts">
                ตรวจสอบโพสต์ซื้อขาย
              </a>
            </li>
            <li>
              <a
                href="/mod/managecategories"
                data-test="modmenu-dropdown-categories"
              >
                จัดการหมวดหมู่สินค้า
              </a>
            </li>
            <li>
              <a href="/" data-test="modmenu-dropdown-editprofile">
                แก้ไขโปรไฟล์
              </a>
            </li>
            <li>
              <a onClick={handleLogout} data-test="modmenu-dropdown-logout">
                ออกจากระบบ
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ModProfileMenu;
