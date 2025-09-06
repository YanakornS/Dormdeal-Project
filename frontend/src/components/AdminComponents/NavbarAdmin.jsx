import logo from "/Logo/logo.png";
import Modal from "../Login/Modal";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import AdminProfileMenu from "./AdminProfileMenu";

const NavbarAdmin = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="section-container navbar bg-base-100 fixed top-0 w-full shadow-sm z-10">
      <div className="navbar-start">
        <div className="dropdown">
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>เมนู A</a>
            </li>
            <li>
              <a>เมนู B</a>
              <ul className="p-2">
                <li>
                  <a>Submenu A</a>
                </li>
                <li>
                  <a>Submenu B</a>
                </li>
              </ul>
            </li>
            <li>
              <a>เมนู C</a>
            </li>
          </ul>
        </div>
        <a
          className="flex items-center text-xl transition transform duration-300"
          href="/admin"
        >
          <img
            src={logo}
            alt="DormDeals Logo"
            className="h-6 lg:h-8 pr-1 mr-2"
          />
          <p className="font-bold hidden sm:block">DormDeals <span className="text-red-600 border border-red-600 rounded-md  px-3">Admin</span></p>
        </a>
      </div>

      <div className="navbar-center hidden lg:flex">{/* กลางว่างไว้ */}</div>

      <div className="navbar-end gap-4">
        {user ? (
          <AdminProfileMenu />
        ) : (
          <a
            className="btn-sign"
            onClick={() => document.getElementById("login").showModal()}
          >
            เข้าสู่ระบบ / สมัครสมาชิก
          </a>
        )}
      </div>
      <Modal name="login" />
    </div>
  );
};

export default NavbarAdmin;
