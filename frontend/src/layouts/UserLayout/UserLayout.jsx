import { Outlet } from "react-router";
import Navbar from "../../components/UserComponents/UserNavbar";
import Footer from "../../components/Footer";
import ThemeToggleFloating from "../../components/ThemeToggleFloating";

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow pt-[height-of-navbar]">
        <Outlet />
        <ThemeToggleFloating />
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;
