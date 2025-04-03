import logo from "/Logo/logo.png";
import Modal from "../Login/Modal";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import UserMenu from "./UserProfileMenu";

const UserNavbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="section-container navbar bg-base-100 fixed top-0 left-1/2 transform -translate-x-1/2 w-full shadow-sm z-10 ">
      <div className="navbar-start">
        <div className="dropdown">
          {/* <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div> */}
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Item 10</a>
            </li>
            <li>
              <a>Parent</a>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </li>
            <li>
              <a>Item 3</a>
            </li>
          </ul>
        </div>
        <a
          className="flex items-center text-xl hover:scale-105 transition transform duration-300"
          href="/"
        >
          <img
            src={logo}
            alt="DormDeals Logo"
            className="h-6 lg:h-8 pr-1 mr-2"
          />
          <span className="font-bold hidden sm:block">DormDeals</span>
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        {/* <ul className="menu menu-horizontal px-1">
      <li><a>Item 1</a></li>
      <li>
        <details>
          <summary>Parent</summary>
          <ul className="p-2">
            <li><a>Submenu 1</a></li>
            <li><a>Submenu 2</a></li>
          </ul>
        </details>
      </li>
      <li><a>Item 3</a></li>
    </ul> */}
      </div>
      <div className="navbar-end gap-4">
        {user ? (
          <UserMenu />
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

export default UserNavbar;
