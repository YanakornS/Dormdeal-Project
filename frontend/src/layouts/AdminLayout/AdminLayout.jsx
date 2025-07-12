import { Outlet } from "react-router";
import NavbarAdmin from "../../components/AdminComponents/NavbarAdmin";
import Footer from "../../components/Footer";
import ThemeToggleFloating from "../../components/ThemeToggleFloating";

const AdminLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarAdmin />
      <div className="flex-grow pt-[32px] px-4"> {/* ปรับตามความสูงของ navbar */}
        <Outlet />
        <ThemeToggleFloating />
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
