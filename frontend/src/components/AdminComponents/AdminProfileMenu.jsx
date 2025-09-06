import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { LuUserRoundPen } from "react-icons/lu";
import { TbMoodEdit } from "react-icons/tb";
import { CiUser } from "react-icons/ci";
import { MdOutlineSupportAgent } from "react-icons/md";

const AdminProfileMenu = () => {
  const { user, logout, getUser, isLoading } = useContext(AuthContext);
  const userInfo = getUser();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="dropdown dropdown-end">
          <a
            data-test="link-manage-permission"
            href="/admin/manage-permission"
            role="button"
            className="btn btn-ghost flex items-center"
          >
            <div className="indicator flex items-center gap-2">
              <LuUserRoundPen className="w-6 h-6" />
              <span className="hidden 2xl:inline text-sm font-light">
                สิทธิ์ของผู้ใช้งานระบบ
              </span>
            </div>
          </a>
        </div>

        <div className="dropdown dropdown-end">
          <a
            data-test="link-manage-status"
            href="/admin/manage-status"
            role="button"
            className="btn btn-ghost flex items-center"
          >
            <div className="indicator flex items-center gap-2">
              <TbMoodEdit className="w-6 h-6" />
              <span className="hidden 2xl:inline text-sm font-light">
                จัดการสถานะผู้ใช้งานระบบ
              </span>
            </div>
          </a>
        </div>

        <div className="dropdown dropdown-end">
          <a
            data-test="link-register-admin"
            href="/admin/register"
            role="button"
            className="btn btn-ghost flex items-center"
          >
            <div className="indicator flex items-center gap-2">
              <MdOutlineSupportAgent className="w-6 h-6" />
              <span className="hidden 2xl:inline text-sm font-light">
                เพิ่มเจ้าหน้าที่ดูแลระบบ
              </span>
            </div>
          </a>
        </div>

        <div className="dropdown dropdown-end">
          <div
            data-test="button-profile-menu"
            className="btn-profile flex items-center gap-2 transition transform duration-300"
            tabIndex={0}
            role="button"
            aria-label="Profile Button"
          >
            <CiUser className="w-6 h-6" />
            <span className="hidden lg:inline truncate">
              {userInfo?.displayName || "ผู้ดูแลระบบ"}
            </span>
          </div>

          <ul
            tabIndex={0}
            data-test="dropdown-profile-menu"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a data-test="dropdown-register-mod" href="/mod/register">
                เพิ่มเจ้าหน้าที่ดูแลระบบ
              </a>
            </li>
            <li>
              <a
                data-test="dropdown-manage-permission"
                href="/admin/manage-permission"
              >
                สิทธิ์ของผู้ใช้งานระบบ
              </a>
            </li>
            <li>
              <a data-test="dropdown-manage-status" href="/admin/manage-status">
                จัดการสถานะผู้ใช้งานระบบ
              </a>
            </li>
            <li>
              <a data-test="dropdown-edit-profile" href="/">
                แก้ไขโปรไฟล์
              </a>
            </li>
            <li>
              <a data-test="dropdown-logout" onClick={handleLogout}>
                ออกจากระบบ
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default AdminProfileMenu;
