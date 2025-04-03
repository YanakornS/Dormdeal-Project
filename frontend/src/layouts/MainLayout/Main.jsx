import { Outlet } from "react-router";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Main = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow pt-[height-of-navbar]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Main;
