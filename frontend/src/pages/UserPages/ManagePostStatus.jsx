import { Outlet, Link } from "react-router";
import Breadcrumbs from "../../components/Breadcrumb";

const ManagePostStatus = () => {
  const breadcrumbMenu = [
    { name: "หน้าแรก", link: "/" },
    { name: "จัดการโพสต์ประกาศ", link: "#" },
  ];

  return (
    <div className="section-container mt-16">
      <Breadcrumbs breadcrumbMenu={breadcrumbMenu} />
      <div className="drawer drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content flex flex-col items-center justify-center">
          <Outlet />
        </div>

        <div className="drawer-side items-end">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu text-black mt-10 gap-4 text-base w-80 p-4 items-end bg-white pr-9">
            {/* ✅ เปลี่ยนจาก <a href="..."> เป็น <Link to="..."> */}
            <li>
              <Link to="pending">รอการตรวจสอบ (0)</Link>
            </li>
            <li>
              <Link to="revision">รอการแก้ไข (0)</Link>
            </li>
            <li>
              <Link to="rejected">ไม่ผ่านการตรวจสอบ (0)</Link>
            </li>
            <li>
              <Link to="sold-out">ปิดการขาย (0)</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManagePostStatus;
